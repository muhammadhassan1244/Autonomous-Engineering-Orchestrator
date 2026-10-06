const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// In-Memory Store for Graviton Tickets & Policy Configuration
let ticketsStore = {
  'PAY-1429': {
    key: 'PAY-1429',
    title: 'Stripe webhook duplicate charge due to missing idempotency',
    repo: 'acme-corp/payment-service',
    status: 'executing',
    assignedRuntime: 'antigravity',
    activeModel: 'Gemini 3 (Thinking Core)',
    step: 4,
    totalSteps: 7,
    cost: 0.038,
    costCap: 0.50,
    elapsedSeconds: 522,
    branch: 'feat/PAY-1429-idempotency',
    riskLevel: 'HIGH (DDL Migration)',
    summary: 'Prevent duplicate credit ledger entries on Stripe webhook retry bursts'
  },
  'AUTH-891': {
    key: 'AUTH-891',
    title: 'Add PKCE verification to OAuth2 redirect flows',
    repo: 'acme-corp/identity-service',
    status: 'escalated',
    assignedRuntime: 'cursor',
    activeModel: 'Claude 3.7 Sonnet (Thinking)',
    step: 6,
    totalSteps: 7,
    cost: 0.58,
    costCap: 1.00,
    elapsedSeconds: 940,
    branch: 'feat/AUTH-891-pkce-oauth2',
    riskLevel: 'MED (Security)',
    summary: 'Mitigate authorization code interception attacks across mobile & SPA clients'
  },
  'CORE-402': {
    key: 'CORE-402',
    title: 'Graceful shutdown for Kafka consumers on SIGTERM',
    repo: 'acme-corp/platform-core',
    status: 'gated',
    assignedRuntime: 'antigravity',
    activeModel: 'Gemini 3 Flash',
    step: 5,
    totalSteps: 7,
    cost: 0.02,
    costCap: 0.15,
    elapsedSeconds: 210,
    branch: 'feat/CORE-402-kafka-graceful-shutdown',
    riskLevel: 'LOW (Lifecycle)',
    summary: 'Drain consumer partitions cleanly within 15-second grace period during deployment rollouts'
  }
};

let policyConfig = {
  tier1: {
    runtime: 'antigravity',
    endpoint: 'grpc://antigravity.internal:8443',
    model: 'Gemini 3 (Thinking Core)',
    workers: 4
  },
  tier2: {
    runtime: 'cursor',
    daemonUrl: 'http://localhost:4040/cursor/v1',
    model: 'Claude 3.7 Sonnet (Thinking)',
    autoEscalateFailures: 2
  },
  rules: [
    { id: 1, condition: 'Issue.Type == "Bug" AND Priority == "Highest"', target: 'Cursor Agent (Claude 3.7)', budget: 1.50 },
    { id: 2, condition: 'Components in ["DB", "Schema", "CRUD", "Fastify"]', target: 'Antigravity (Gemini 3)', budget: 0.20 },
    { id: 3, condition: 'StoryPoints <= 3 OR Labels in ["chore", "docs"]', target: 'Antigravity (Gemini 3 Flash)', budget: 0.10 },
    { id: 4, condition: 'Fallback: If Tier 1 tests fail 2x', target: 'Auto-Escalate to Cursor', budget: 0.80 }
  ],
  guardrails: {
    mandatoryDbApproval: true,
    blockDestructiveOps: true
  }
};

// Connected SSE clients
const sseClients = new Set();

// Broadcast SSE telemetry every 3 seconds to active connected clients
setInterval(() => {
  if (sseClients.size === 0) return;
  const payTicket = ticketsStore['PAY-1429'];
  if (payTicket && payTicket.status === 'executing') {
    payTicket.cost = parseFloat((payTicket.cost + 0.0005).toFixed(4));
    payTicket.elapsedSeconds++;
  }
  const payload = JSON.stringify({
    type: 'telemetry_tick',
    timestamp: new Date().toISOString(),
    ticket: payTicket
  });
  sseClients.forEach(res => {
    res.write(`data: ${payload}\n\n`);
  });
}, 3000);

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route: GET /api/tickets
  if (pathname === '/api/tickets' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Object.values(ticketsStore)));
    return;
  }

  // API Route: GET /api/tickets/:id
  if (pathname.startsWith('/api/tickets/') && req.method === 'GET') {
    const id = pathname.split('/')[3];
    const ticket = ticketsStore[id];
    if (ticket) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(ticket));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Ticket not found' }));
    }
    return;
  }

  // API Route: POST /api/tickets/:id/transition
  if (pathname.startsWith('/api/tickets/') && pathname.endsWith('/transition') && req.method === 'POST') {
    const id = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (ticketsStore[id]) {
          ticketsStore[id].status = data.status || ticketsStore[id].status;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, ticket: ticketsStore[id] }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Ticket not found' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // API Route: GET /api/policy-config
  if (pathname === '/api/policy-config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(policyConfig));
    return;
  }

  // API Route: POST /api/policy-config
  if (pathname === '/api/policy-config' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        policyConfig = { ...policyConfig, ...data };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, config: policyConfig }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // API Route: Server-Sent Events (SSE) /api/stream/events
  if (pathname === '/api/stream/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString() })}\n\n`);
    sseClients.add(res);
    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname.split('?')[0]);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Antigravity Bridge Desktop App listening at http://127.0.0.1:${PORT}`);
});
