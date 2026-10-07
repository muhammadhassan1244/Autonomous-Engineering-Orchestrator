/**
 * GRAVITON - MULTI-AGENT ORCHESTRATOR & POLICY ENGINE CONTROLLER
 * Architecture: Multi-Agent Dispatch, Two-Tier Escalation, FinOps Tracking & Jira Bi-Directional Sync
 */

class AntigravityApp {
  constructor() {
    this.currentScreen = 'dashboard';
    this.currentTicketKey = 'PAY-1429';
    this.diffMode = 'unified'; // 'unified' | 'split'
    this.activeDiffFileKey = 'schema';

    // Global Multi-Ticket Enterprise Store
    this.ticketsData = {
      'PAY-1429': {
        key: 'PAY-1429',
        title: 'PAY-1429: Stripe webhook duplicate charge due to missing idempotency',
        shortTitle: 'Stripe webhook idempotency key handling',
        status: 'executing', // 'idle' | 'planning' | 'gated' | 'executing' | 'verifying' | 'completed'
        repo: 'acme-corp/payment-service',
        baseBranch: 'main (c7a91bf)',
        agentBranch: 'feat/PAY-1429-idempotency',
        stack: 'TypeScript 5.4, Prisma, Fastify, Vitest',
        runtime: 'antigravity',
        runtimeName: 'Google Antigravity',
        model: 'Gemini 3 (Thinking Core)',
        cost: 0.038,
        costCap: 0.50,
        elapsedSeconds: 522,
        currentStep: 6,
        riskLevel: 'HIGH RISK',
        riskClass: 'risk-high',
        riskDesc: 'Database DDL migration required on relational table with >1.2M rows.',
        policyReason: 'Rule: Schema Boilerplate',
        subTask: 'Step 4/7: Applying Prisma DDL migration in container',
        commitHash: 'f81b3c9',
        prNumber: 342,
        impactFiles: [
          { state: 'state-mod', label: 'M', path: 'prisma/schema.prisma', lines: '+24 / -0', risk: 'HIGH (DDL)', why: 'Define IdempotencyKey model with compound unique constraint' },
          { state: 'state-add', label: 'A', path: 'src/services/idempotency.ts', lines: '+72 / -0', risk: 'LOW', why: 'Atomic pending reservation lock with 5s timeout & TTL support' },
          { state: 'state-mod', label: 'M', path: 'src/webhooks/stripe.ts', lines: '+18 / -18', risk: 'MED', why: 'Intercept webhook payload before ledger write' },
          { state: 'state-add', label: 'A', path: 'tests/webhook.test.ts', lines: '+32 / -0', risk: 'LOW', why: 'Concurrent stress simulation test (10 parallel requests)' }
        ],
        diffFiles: {
          schema: {
            filename: 'prisma/schema.prisma',
            type: 'PostgreSQL DDL Model',
            linesBadge: '+24 / -0',
            justification: 'Satisfies Jira AC-1: Atomic idempotency table with compound unique index',
            reasoning: 'Added compound unique constraint @@unique([provider, eventId]) to guarantee database-level atomic rejection of racing webhook retry packets.',
            lines: [
              { type: 'ctx', oldLn: '48', newLn: '48', code: 'model Customer {' },
              { type: 'ctx', oldLn: '49', newLn: '49', code: '  id        String   @id @default(uuid())' },
              { type: 'ctx', oldLn: '50', newLn: '50', code: '  email     String   @unique' },
              { type: 'ctx', oldLn: '51', newLn: '51', code: '}' },
              { type: 'ctx', oldLn: '52', newLn: '52', code: '' },
              { type: 'hunk-header', oldLn: '@@', newLn: '@@', code: '@@ -53,0 +54,24 @@ model IdempotencyKey' },
              { type: 'add', oldLn: '', newLn: '54', code: '+model IdempotencyKey {' },
              { type: 'add', oldLn: '', newLn: '55', code: '+  id          String   @id @default(cuid())' },
              { type: 'add', oldLn: '', newLn: '56', code: '+  provider    String   // e.g. "stripe"' },
              { type: 'add', oldLn: '', newLn: '57', code: '+  eventId     String' },
              { type: 'add', oldLn: '', newLn: '58', code: '+  status      String   // "PENDING" | "COMPLETED" | "FAILED"' },
              { type: 'add', oldLn: '', newLn: '59', code: '+  response    Json?' },
              { type: 'add', oldLn: '', newLn: '60', code: '+  expiresAt   DateTime @default(now() + 7 days)' },
              { type: 'add', oldLn: '', newLn: '61', code: '+  createdAt   DateTime @default(now())' },
              { type: 'add', oldLn: '', newLn: '62', code: '+  updatedAt   DateTime @updatedAt' },
              { type: 'add', oldLn: '', newLn: '63', code: '+' },
              { type: 'add', oldLn: '', newLn: '64', code: '+  @@unique([provider, eventId])' },
              { type: 'add', oldLn: '', newLn: '65', code: '+  @@index([createdAt])' },
              { type: 'add', oldLn: '', newLn: '66', code: '+  @@index([expiresAt])' },
              { type: 'add', oldLn: '', newLn: '67', code: '+}' }
            ]
          },
          idempotency: {
            filename: 'src/services/idempotency.ts',
            type: 'TypeScript Core Service',
            linesBadge: '+72 / -0',
            justification: 'Satisfies Jira AC-1 & AC-2: Atomic pending reservation lock with error recovery',
            reasoning: 'Implements atomic reservation lock (INSERT with PENDING status first) to prevent race windows where concurrent threads execute handler before key creation.',
            lines: [
              { type: 'hunk-header', oldLn: '@@', newLn: '@@', code: '@@ -0,0 +1,28 @@' },
              { type: 'add', oldLn: '', newLn: '1', code: '+import { prisma } from "../db/client";' },
              { type: 'add', oldLn: '', newLn: '2', code: '+import { FastifyReply } from "fastify";' },
              { type: 'add', oldLn: '', newLn: '3', code: '+' },
              { type: 'add', oldLn: '', newLn: '4', code: '+export async function withIdempotencyLock<T>(' },
              { type: 'add', oldLn: '', newLn: '5', code: '+  provider: string,' },
              { type: 'add', oldLn: '', newLn: '6', code: '+  eventId: string,' },
              { type: 'add', oldLn: '', newLn: '7', code: '+  handler: () => Promise<T>' },
              { type: 'add', oldLn: '', newLn: '8', code: '+): Promise<{ duplicate: boolean; data: T }> {' },
              { type: 'add', oldLn: '', newLn: '9', code: '+  // 1. ATOMIC RESERVATION: Try to create PENDING record before handler execution' },
              { type: 'add', oldLn: '', newLn: '10', code: '+  try {' },
              { type: 'add', oldLn: '', newLn: '11', code: '+    await prisma.idempotencyKey.create({' },
              { type: 'add', oldLn: '', newLn: '12', code: '+      data: { provider, eventId, status: "PENDING" }' },
              { type: 'add', oldLn: '', newLn: '13', code: '+    });' },
              { type: 'add', oldLn: '', newLn: '14', code: '+  } catch (err: any) {' },
              { type: 'add', oldLn: '', newLn: '15', code: '+    // Unique constraint collision -> Concurrent retry in progress or already completed' },
              { type: 'add', oldLn: '', newLn: '16', code: '+    const existing = await prisma.idempotencyKey.findUnique({' },
              { type: 'add', oldLn: '', newLn: '17', code: '+      where: { provider_eventId: { provider, eventId } }' },
              { type: 'add', oldLn: '', newLn: '18', code: '+    });' },
              { type: 'add', oldLn: '', newLn: '19', code: '+    if (existing?.status === "COMPLETED") {' },
              { type: 'add', oldLn: '', newLn: '20', code: '+      return { duplicate: true, data: existing.response as T };' },
              { type: 'add', oldLn: '', newLn: '21', code: '+    }' },
              { type: 'add', oldLn: '', newLn: '22', code: '+    throw new Error("Concurrent operation in progress. Please retry in 100ms.");' },
              { type: 'add', oldLn: '', newLn: '23', code: '+  }' },
              { type: 'add', oldLn: '', newLn: '24', code: '+' },
              { type: 'add', oldLn: '', newLn: '25', code: '+  try {' },
              { type: 'add', oldLn: '', newLn: '26', code: '+    const result = await handler();' },
              { type: 'add', oldLn: '', newLn: '27', code: '+    await prisma.idempotencyKey.update({' },
              { type: 'add', oldLn: '', newLn: '28', code: '+      where: { provider_eventId: { provider, eventId } },' },
              { type: 'add', oldLn: '', newLn: '29', code: '+      data: { status: "COMPLETED", response: result }' },
              { type: 'add', oldLn: '', newLn: '30', code: '+    });' },
              { type: 'add', oldLn: '', newLn: '31', code: '+    return { duplicate: false, data: result };' },
              { type: 'add', oldLn: '', newLn: '32', code: '+  } catch (handlerErr) {' },
              { type: 'add', oldLn: '', newLn: '33', code: '+    await prisma.idempotencyKey.update({' },
              { type: 'add', oldLn: '', newLn: '34', code: '+      where: { provider_eventId: { provider, eventId } },' },
              { type: 'add', oldLn: '', newLn: '35', code: '+      data: { status: "FAILED" }' },
              { type: 'add', oldLn: '', newLn: '36', code: '+    });' },
              { type: 'add', oldLn: '', newLn: '37', code: '+    throw handlerErr;' },
              { type: 'add', oldLn: '', newLn: '38', code: '+  }' },
              { type: 'add', oldLn: '', newLn: '39', code: '+}' }
            ]
          },
          webhook: {
            filename: 'src/webhooks/stripe.ts',
            type: 'Fastify Route Handler',
            linesBadge: '+18 / -18',
            justification: 'Satisfies Jira AC-2: Intercept webhook payload before ledger write',
            reasoning: 'Replaced un-gated credit allocation call with withIdempotencyLock guard.',
            lines: [
              { type: 'ctx', oldLn: '31', newLn: '31', code: 'export async function handleStripeWebhook(req: FastifyRequest, reply: FastifyReply) {' },
              { type: 'ctx', oldLn: '32', newLn: '32', code: '  const event = req.body as Stripe.Event;' },
              { type: 'del', oldLn: '33', newLn: '', code: '-  // BUG: Executes credit directly without lock check' },
              { type: 'del', oldLn: '34', newLn: '', code: '-  await ledgerService.creditCustomerAccount(event.data.object);' },
              { type: 'del', oldLn: '35', newLn: '', code: '-  return reply.send({ received: true });' },
              { type: 'add', oldLn: '', newLn: '33', code: '+  const { duplicate, data } = await withIdempotencyLock(' },
              { type: 'add', oldLn: '', newLn: '34', code: '+    "stripe",' },
              { type: 'add', oldLn: '', newLn: '35', code: '+    event.id,' },
              { type: 'add', oldLn: '', newLn: '36', code: '+    async () => {' },
              { type: 'add', oldLn: '', newLn: '37', code: '+      return await ledgerService.creditCustomerAccount(event.data.object);' },
              { type: 'add', oldLn: '', newLn: '38', code: '+    }' },
              { type: 'add', oldLn: '', newLn: '39', code: '+  );' },
              { type: 'add', oldLn: '', newLn: '40', code: '+' },
              { type: 'add', oldLn: '', newLn: '41', code: '+  if (duplicate) {' },
              { type: 'add', oldLn: '', newLn: '42', code: '+    return reply.status(200).send({ status: "already_processed", data });' },
              { type: 'add', oldLn: '', newLn: '43', code: '+  }' },
              { type: 'add', oldLn: '', newLn: '44', code: '+  return reply.status(200).send({ status: "processed", data });' }
            ]
          },
          test: {
            filename: 'tests/webhook.test.ts',
            type: 'Vitest Integration Suite',
            linesBadge: '+32 / -0',
            justification: 'Satisfies Jira AC-3: Concurrent stress simulation test (10 requests)',
            reasoning: 'Spawns 10 parallel asynchronous HTTP requests with identical event ID to prove zero double-credits.',
            lines: [
              { type: 'hunk-header', oldLn: '@@', newLn: '@@', code: '@@ -0,0 +1,18 @@' },
              { type: 'add', oldLn: '', newLn: '1', code: '+describe("Stripe Webhook Idempotency Concurrency", () => {' },
              { type: 'add', oldLn: '', newLn: '2', code: '+  it("handles 10 parallel identical events with single ledger credit", async () => {' },
              { type: 'add', oldLn: '', newLn: '3', code: '+    const eventId = `evt_test_${Date.now()}`;' },
              { type: 'add', oldLn: '', newLn: '4', code: '+    const payload = createMockStripeChargeEvent(eventId);' },
              { type: 'add', oldLn: '', newLn: '5', code: '+    ' },
              { type: 'add', oldLn: '', newLn: '6', code: '+    // Dispatch 10 requests concurrently' },
              { type: 'add', oldLn: '', newLn: '7', code: '+    const responses = await Promise.all(' },
              { type: 'add', oldLn: '', newLn: '8', code: '+      Array.from({ length: 10 }).map(() => app.inject({' },
              { type: 'add', oldLn: '', newLn: '9', code: '+        method: "POST",' },
              { type: 'add', oldLn: '', newLn: '10', code: '+        url: "/webhooks/stripe",' },
              { type: 'add', oldLn: '', newLn: '11', code: '+        payload' },
              { type: 'add', oldLn: '', newLn: '12', code: '+      }))' },
              { type: 'add', oldLn: '', newLn: '13', code: '+    );' },
              { type: 'add', oldLn: '', newLn: '14', code: '+    ' },
              { type: 'add', oldLn: '', newLn: '15', code: '+    expect(responses.every(r => r.statusCode === 200)).toBe(true);' },
              { type: 'add', oldLn: '', newLn: '16', code: '+    const credits = await prisma.ledgerEntry.count({ where: { ref: eventId } });' },
              { type: 'add', oldLn: '', newLn: '17', code: '+    expect(credits).toBe(1); // EXACTLY ONE' },
              { type: 'add', oldLn: '', newLn: '18', code: '+  });' },
              { type: 'add', oldLn: '', newLn: '19', code: '+});' }
            ]
          }
        },
        thoughts: [
          { step: 'Step 1', tool: 'read_file', time: '00:01:12', reasoning: 'I need to inspect the current Stripe webhook handler to see where ledger credit commits occur and how duplicate payloads are received.', call: 'read_file(path: "src/webhooks/stripe.ts", lines: 1-120)' },
          { step: 'Step 2', tool: 'write_file', time: '00:03:45', reasoning: 'Creating the dedicated idempotency service helper with atomic pending reservation locking to avoid race conditions.', call: 'write_file(path: "src/services/idempotency.ts")' },
          { step: 'Step 3', tool: 'replace_file_content', time: '00:05:20', reasoning: 'Appending IdempotencyKey model into Prisma schema with compound unique constraint on provider and eventId.', call: 'replace_file_content(path: "prisma/schema.prisma", +24 lines)' },
          { step: 'Step 4 (Active)', tool: 'exec_command', time: '00:08:42', reasoning: 'Running Prisma migration generation in ephemeral Postgres container to verify schema DDL.', call: 'run_command(cmd: "npx prisma migrate dev --name add_idempotency_keys")', active: true }
        ],
        terminal: [
          '<span class="term-dim">[00:01:05]</span> <span class="term-cyan">antigravity-orchestrator</span> initialized container sandbox (cgroup isolation: enabled)',
          '<span class="term-dim">[00:01:08]</span> <span class="term-dim">Policy Engine:</span> Dispatched to Antigravity (Gemini 3) • Tier 1 Budget Allocated ($0.20 cap)',
          '<span class="term-dim">[00:01:10]</span> $ git checkout -b feat/PAY-1429-idempotency',
          '<span class="term-green">Switched to a new branch \'feat/PAY-1429-idempotency\'</span>',
          '<span class="term-dim">[00:03:40]</span> $ cat << \'EOF\' > src/services/idempotency.ts',
          '<span class="term-dim">[00:05:15]</span> Patching prisma/schema.prisma... OK (+24 lines)',
          '<span class="term-dim">[00:07:30]</span> $ npx prisma validate\nThe schema is valid! ✨',
          '<span class="term-dim">[00:08:10]</span> $ npx prisma migrate dev --name add_idempotency_keys\n<span class="term-green">✔ Generated Prisma Client (v5.12.0) in 84ms\n✔ Migration applied successfully</span>',
          '<span class="term-dim">[00:08:35]</span> $ npm run test:unit -- src/services/idempotency.test.ts\n<span class="term-green">✓ src/services/idempotency.test.ts (6 tests passed)</span>',
          '<span class="term-dim">[00:08:42]</span> <span class="term-cyan">AGY Worker:</span> Next sub-task ready -> patching `src/webhooks/stripe.ts` with lock wrapper...'
        ]
      },

      'AUTH-891': {
        key: 'AUTH-891',
        title: 'AUTH-891: Add PKCE verification to OAuth2 redirect flows',
        shortTitle: 'Add PKCE verification to OAuth2 redirect',
        status: 'escalated',
        repo: 'acme-corp/identity-service',
        baseBranch: 'main (4e1902a)',
        agentBranch: 'feat/AUTH-891-pkce-oauth2',
        stack: 'TypeScript 5.4, Fastify, Jose, WebCrypto',
        runtime: 'cursor',
        runtimeName: 'Cursor Agent (Claude 3.7)',
        model: 'Claude 3.7 Sonnet (Thinking)',
        cost: 0.58,
        costCap: 1.00,
        elapsedSeconds: 940,
        currentStep: 6,
        riskLevel: 'MED RISK',
        riskClass: 'risk-med',
        riskDesc: 'Security-critical authentication challenge protocol changes (RFC 7636).',
        policyReason: 'Tier-2 Escalation Cascade',
        subTask: 'Step 5/7: Executing RFC 7636 timing-attack verification suite',
        commitHash: '9a31bc4',
        prNumber: 343,
        impactFiles: [
          { state: 'state-add', label: 'A', path: 'src/auth/pkce.ts', lines: '+48 / -0', risk: 'MED', why: 'Constant-time code_verifier and code_challenge generation using WebCrypto' },
          { state: 'state-mod', label: 'M', path: 'src/routes/oauth2.ts', lines: '+34 / -12', risk: 'MED', why: 'Enforce code_challenge verification on /oauth/token exchange endpoint' },
          { state: 'state-add', label: 'A', path: 'tests/pkce.test.ts', lines: '+44 / -0', risk: 'LOW', why: 'Replay attack and authorization code interception stress test' }
        ],
        diffFiles: {
          pkce: {
            filename: 'src/auth/pkce.ts',
            type: 'TypeScript Cryptographic Module',
            linesBadge: '+48 / -0',
            justification: 'Satisfies RFC 7636: Constant-time S256 code challenge verification',
            reasoning: 'Generates cryptographically random 43-octet verifier and computes SHA-256 base64url challenge with timing-safe comparison.',
            lines: [
              { type: 'hunk-header', oldLn: '@@', newLn: '@@', code: '@@ -0,0 +1,24 @@' },
              { type: 'add', oldLn: '', newLn: '1', code: '+import crypto from "crypto";' },
              { type: 'add', oldLn: '', newLn: '2', code: '+' },
              { type: 'add', oldLn: '', newLn: '3', code: '+export function generateCodeVerifier(): string {' },
              { type: 'add', oldLn: '', newLn: '4', code: '+  return crypto.randomBytes(32).toString("base64url");' },
              { type: 'add', oldLn: '', newLn: '5', code: '+}' },
              { type: 'add', oldLn: '', newLn: '6', code: '+' },
              { type: 'add', oldLn: '', newLn: '7', code: '+export function generateCodeChallenge(verifier: string): string {' },
              { type: 'add', oldLn: '', newLn: '8', code: '+  return crypto.createHash("sha256").update(verifier).digest("base64url");' },
              { type: 'add', oldLn: '', newLn: '9', code: '+}' },
              { type: 'add', oldLn: '', newLn: '10', code: '+' },
              { type: 'add', oldLn: '', newLn: '11', code: '+export function verifyCodeChallenge(verifier: string, challenge: string): boolean {' },
              { type: 'add', oldLn: '', newLn: '12', code: '+  const expected = generateCodeChallenge(verifier);' },
              { type: 'add', oldLn: '', newLn: '13', code: '+  const bufA = Buffer.from(expected);' },
              { type: 'add', oldLn: '', newLn: '14', code: '+  const bufB = Buffer.from(challenge);' },
              { type: 'add', oldLn: '', newLn: '15', code: '+  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);' },
              { type: 'add', oldLn: '', newLn: '16', code: '+}' }
            ]
          },
          route: {
            filename: 'src/routes/oauth2.ts',
            type: 'Fastify Route Handler',
            linesBadge: '+34 / -12',
            justification: 'Enforce PKCE challenge verification on token exchange',
            reasoning: 'Rejects authorization codes without corresponding valid code_verifier.',
            lines: [
              { type: 'ctx', oldLn: '45', newLn: '45', code: 'export async function tokenHandler(req: FastifyRequest, reply: FastifyReply) {' },
              { type: 'del', oldLn: '46', newLn: '', code: '-  // Only checked client_secret' },
              { type: 'del', oldLn: '47', newLn: '', code: '-  await validateClientSecret(req.body.client_id, req.body.client_secret);' },
              { type: 'add', oldLn: '', newLn: '46', code: '+  const { code, code_verifier } = req.body as TokenRequestBody;' },
              { type: 'add', oldLn: '', newLn: '47', code: '+  const authSession = await getAuthSession(code);' },
              { type: 'add', oldLn: '', newLn: '48', code: '+  if (!verifyCodeChallenge(code_verifier, authSession.codeChallenge)) {' },
              { type: 'add', oldLn: '', newLn: '49', code: '+    return reply.status(400).send({ error: "invalid_grant", error_description: "PKCE verification failed" });' },
              { type: 'add', oldLn: '', newLn: '50', code: '+  }' }
            ]
          }
        },
        thoughts: [
          { step: 'Step 1', tool: 'escalation: handoff', time: '00:02:10', reasoning: 'Tier-1 timeout occurred on crypto timing attack test. Orchestrator activated Tier-2 Cursor Agent (Claude 3.7 Sonnet) with packaged AST context.', call: 'handoff_to_cursor_agent(target: "claude-3-7-sonnet")' },
          { step: 'Step 2', tool: 'write_file', time: '00:06:14', reasoning: 'Created timing-safe PKCE module adhering strictly to RFC 7636 Section 4.', call: 'write_file(path: "src/auth/pkce.ts")' },
          { step: 'Step 3 (Active)', tool: 'exec_command', time: '00:15:40', reasoning: 'Running 10,000 timing test iterations to prove zero information leakage.', call: 'run_command(cmd: "npm run test:security -- src/auth/pkce.test.ts")', active: true }
        ],
        terminal: [
          '<span class="term-purple">[POLICY OVERRIDE] Task AUTH-891 escalated to Cursor Headless Daemon (PID 4040).</span>',
          '<span class="term-purple">[CURSOR AGENT] Connected. Deep reasoning engine initialized (Claude 3.7 Sonnet).</span>',
          '<span class="term-dim">[00:04:12]</span> $ git checkout -b feat/AUTH-891-pkce-oauth2',
          '<span class="term-dim">[00:08:22]</span> $ vitest run tests/pkce.test.ts',
          '<span class="term-green">✓ tests/pkce.test.ts (14 tests passed - RFC 7636 compliant)</span>',
          '<span class="term-purple">[CURSOR AGENT] Constant-time buffer comparison verified. Ready for PR review.</span>'
        ]
      },

      'CORE-402': {
        key: 'CORE-402',
        title: 'CORE-402: Graceful shutdown for Kafka consumers on SIGTERM',
        shortTitle: 'Graceful shutdown for Kafka consumers',
        status: 'gated',
        repo: 'acme-corp/platform-core',
        baseBranch: 'main (88bc112)',
        agentBranch: 'feat/CORE-402-kafka-graceful-shutdown',
        stack: 'TypeScript 5.4, KafkaJS, Node Lifecycle',
        runtime: 'antigravity',
        runtimeName: 'Google Antigravity',
        model: 'Gemini 3 Flash',
        cost: 0.02,
        costCap: 0.15,
        elapsedSeconds: 210,
        currentStep: 5, // Human sign-off gate
        riskLevel: 'LOW RISK',
        riskClass: 'risk-low',
        riskDesc: 'Non-breaking process lifecycle hook. Drain partitions with 15s timeout.',
        policyReason: 'Rule: Story Points ≤ 3',
        subTask: 'Step 3/7: Awaiting Staff Engineer Sign-Off on Plan',
        commitHash: 'b511dc7',
        prNumber: 344,
        impactFiles: [
          { state: 'state-mod', label: 'M', path: 'src/kafka/consumer.ts', lines: '+28 / -6', risk: 'LOW', why: 'Attach SIGTERM listener and pause consumer partition reads' },
          { state: 'state-add', label: 'A', path: 'src/lifecycle/shutdown.ts', lines: '+36 / -0', risk: 'LOW', why: 'Lifecycle coordinator providing 15s grace drain period' },
          { state: 'state-add', label: 'A', path: 'tests/shutdown.test.ts', lines: '+38 / -0', risk: 'LOW', why: 'Mock consumer test verifying all offsets committed before exit' }
        ],
        diffFiles: {
          consumer: {
            filename: 'src/kafka/consumer.ts',
            type: 'Kafka Consumer Wrapper',
            linesBadge: '+28 / -6',
            justification: 'Pause consumer partitions cleanly on termination signal',
            reasoning: 'Intercepts SIGTERM and pauses reads to prevent consumer group rebalance thrashing.',
            lines: [
              { type: 'hunk-header', oldLn: '@@', newLn: '@@', code: '@@ -50,6 +50,18 @@' },
              { type: 'ctx', oldLn: '50', newLn: '50', code: 'export async function startKafkaConsumer() {' },
              { type: 'add', oldLn: '', newLn: '51', code: '+  registerShutdownHook(async () => {' },
              { type: 'add', oldLn: '', newLn: '52', code: '+    console.log("Pausing Kafka consumer partitions...");' },
              { type: 'add', oldLn: '', newLn: '53', code: '+    await consumer.pause([{ topic: "payment-events" }]);' },
              { type: 'add', oldLn: '', newLn: '54', code: '+    await consumer.disconnect();' },
              { type: 'add', oldLn: '', newLn: '55', code: '+  });' }
            ]
          }
        },
        thoughts: [
          { step: 'Step 1', tool: 'ast_index', time: '00:01:05', reasoning: 'Indexed process signal listeners. Platform core currently lacks coordinated SIGTERM drain.', call: 'index_repository_ast(repo: "platform-core")' },
          { step: 'Step 2 (Gate)', tool: 'human_gate: approval', time: '00:03:30', reasoning: 'Formulated implementation proposal. Awaiting operator authorization to apply changes.', call: 'request_approval(risk: "LOW", budget: "$0.02")', active: true }
        ],
        terminal: [
          '<span class="term-cyan">[POLICY ENGINE] Dispatched CORE-402 to Antigravity (Gemini 3 Flash) • Tier 1 Budget Allocated</span>',
          '<span class="term-dim">[00:01:10]</span> $ git checkout -b feat/CORE-402-kafka-graceful-shutdown',
          '<span class="term-yellow">[GATE] Plan generated. Pausing execution until Staff Engineer approval is granted.</span>'
        ]
      }
    };

    this.timerInterval = null;
    this.isPaused = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startExecutionTimer();
    this.initCommandPalette();
    this.loadPersistedSettings();
    this.switchTicket('PAY-1429');
  }

  setupEventListeners() {
    // Sidebar navigation clicks
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.getAttribute('data-screen');
        if (screen) this.navigateTo(screen);
      });
    });

    // Stepper node clicks
    document.querySelectorAll('.stepper-track .step-node').forEach(node => {
      node.addEventListener('click', () => {
        const stepNum = node.getAttribute('data-step');
        this.handleStepperJump(stepNum);
      });
    });

    // Global Hotkeys
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openCommandPalette();
        return;
      }

      if (e.key === 'Escape') {
        this.closeModals();
        return;
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      const screenKeys = {
        '1': 'dashboard',
        '2': 'jira-detail',
        '3': 'ai-plan',
        '4': 'agent-execution',
        '5': 'code-changes',
        '6': 'testing',
        '7': 'completion',
        '8': 'settings'
      };

      if (screenKeys[e.key]) {
        this.navigateTo(screenKeys[e.key]);
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleAgentPause();
        return;
      }

      if (e.key.toLowerCase() === 'a' && this.currentScreen === 'ai-plan') {
        this.showApprovePlanModal();
        return;
      }

      if (e.key.toLowerCase() === 'r' && this.currentScreen === 'ai-plan') {
        this.showRequestChangesModal();
        return;
      }
    });

    // Command Search Trigger Button
    const cmdBtn = document.getElementById('cmd-palette-btn');
    if (cmdBtn) cmdBtn.addEventListener('click', () => this.openCommandPalette());

    // Diff view toggles (Unified vs Split)
    const uniBtn = document.getElementById('diff-unified-btn');
    const splitBtn = document.getElementById('diff-split-btn');
    if (uniBtn && splitBtn) {
      uniBtn.addEventListener('click', () => {
        this.diffMode = 'unified';
        uniBtn.classList.add('active');
        splitBtn.classList.remove('active');
        this.renderDiff(this.activeDiffFileKey);
        this.showToast('Switched to Unified Diff Mode');
      });
      splitBtn.addEventListener('click', () => {
        this.diffMode = 'split';
        splitBtn.classList.add('active');
        uniBtn.classList.remove('active');
        this.renderDiff(this.activeDiffFileKey);
        this.showToast('Switched to Side-by-Side Split Diff Mode');
      });
    }

    // Quick Settings button
    const quickSettings = document.getElementById('quick-settings-btn');
    if (quickSettings) quickSettings.addEventListener('click', () => this.navigateTo('settings'));

    // Mobile Navigation Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => this.toggleMobileSidebar());
    }

    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', () => this.closeMobileSidebar());
    }

    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => this.closeMobileSidebar());
    }
  }

  toggleMobileSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btn = document.getElementById('mobile-menu-btn');
    if (sidebar) sidebar.classList.toggle('mobile-open');
    if (overlay) overlay.classList.toggle('active');
    if (btn) btn.classList.toggle('open');
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btn = document.getElementById('mobile-menu-btn');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    if (btn) btn.classList.remove('open');
  }

  // Multi-Ticket Context Switching
  switchTicket(ticketKey) {
    const ticket = this.ticketsData[ticketKey];
    if (!ticket) return;

    this.currentTicketKey = ticketKey;

    // Update Topbar
    const topTicketBadge = document.getElementById('topbar-ticket-badge');
    const topRuntimeBadge = document.getElementById('topbar-runtime-badge');
    if (topTicketBadge) topTicketBadge.textContent = ticket.key;
    if (topRuntimeBadge) {
      topRuntimeBadge.textContent = `${ticket.runtimeName} (${ticket.model})`;
      topRuntimeBadge.className = ticket.runtime === 'cursor' ? 'text-purple font-mono' : 'text-cyan font-mono';
    }

    // Update Dashboard Table Selected Row
    document.querySelectorAll('#table-active-runs tbody tr').forEach(row => {
      const keySpan = row.querySelector('.jira-key');
      if (keySpan && keySpan.textContent === ticketKey) {
        row.classList.add('table-row-selected');
      } else {
        row.classList.remove('table-row-selected');
      }
    });

    // Update Screen 2 (Jira Issue Detail)
    const breadcrumbTicket = document.querySelector('#screen-jira-detail .breadcrumbs .text-cyan');
    if (breadcrumbTicket) breadcrumbTicket.textContent = ticket.key;
    const jiraTitle = document.querySelector('#screen-jira-detail .screen-title');
    if (jiraTitle) jiraTitle.textContent = ticket.title;

    // Update Metadata Box
    const metaProvider = document.getElementById('meta-provider-name');
    const metaModel = document.getElementById('meta-model-name');
    if (metaProvider) metaProvider.textContent = ticket.runtimeName;
    if (metaModel) metaModel.textContent = ticket.model;

    // Update Telemetry on Screen 4
    const execSubtask = document.getElementById('exec-subtask');
    const execRuntimeName = document.getElementById('exec-runtime-name');
    const execCost = document.getElementById('exec-cost');
    const liveRuntimePill = document.getElementById('live-runtime-pill');
    if (execSubtask) execSubtask.textContent = ticket.subTask;
    if (execRuntimeName) {
      execRuntimeName.textContent = `${ticket.runtimeName} (${ticket.model})`;
      execRuntimeName.className = ticket.runtime === 'cursor' ? 't-value font-mono text-purple' : 't-value font-mono text-cyan';
    }
    if (execCost) execCost.innerHTML = `$${ticket.cost.toFixed(3)} <span class="text-dim">/ $${ticket.costCap.toFixed(2)} cap</span>`;
    if (liveRuntimePill) {
      liveRuntimePill.innerHTML = ticket.runtime === 'cursor'
        ? `<span class="pulse-purple"></span> RUNTIME: ${ticket.runtimeName.toUpperCase()}`
        : `<span class="pulse-dot"></span> RUNTIME: ${ticket.runtimeName.toUpperCase()}`;
      liveRuntimePill.className = ticket.runtime === 'cursor' ? 'live-pill pill-cursor-live' : 'live-pill';
    }

    // Render Thought Stream
    this.renderThoughtStream(ticket.thoughts);

    // Render Live Terminal
    this.renderTerminal(ticket.terminal);

    // Render Diff Files Tree & Active Diff
    this.renderDiffFileTree(ticket.diffFiles);
    const firstKey = Object.keys(ticket.diffFiles)[0];
    this.selectDiffFile(firstKey);

    // Update Completion PR Card
    const prTitle = document.querySelector('.pr-title');
    if (prTitle) prTitle.textContent = ticket.shortTitle;
    const branchEl = document.querySelector('.pr-meta-row');
    if (branchEl) {
      branchEl.innerHTML = `<span>Branch: <code>${ticket.agentBranch}</code></span> <span>Base: <code>${ticket.baseBranch}</code></span> <span>Commit: <code>${ticket.commitHash}</code></span>`;
    }

    // Update Status Bar
    const sbBranch = document.querySelector('.statusbar-left .sb-item');
    if (sbBranch) sbBranch.innerHTML = `<span class="git-branch-icon">⎇</span> ${ticket.agentBranch}`;

    // Update Workflow Stepper Progress
    this.updateWorkflowStepper(this.currentScreen);

    this.showToast(`Switched active workspace to ${ticket.key} (${ticket.runtimeName})`, 'info');
  }

  renderThoughtStream(thoughts) {
    const stream = document.getElementById('thought-stream');
    if (!stream) return;
    stream.innerHTML = '';
    thoughts.forEach(t => {
      const card = document.createElement('div');
      card.className = `thought-card ${t.active ? 'active' : 'done'}`;
      card.innerHTML = `
        <div class="thought-meta">
          <span class="step-num ${t.active ? 'text-cyan' : ''}">${t.step}</span>
          <span class="tool-tag ${t.active ? 'tag-cyan' : ''}">tool: ${t.tool}</span>
          <span class="time font-mono">${t.time}</span>
        </div>
        <div class="thought-body">
          <p class="thought-reasoning">"${t.reasoning}"</p>
          <div class="tool-call-box ${t.active ? 'active-pulse' : ''}">
            <code>${t.call}</code>
          </div>
        </div>
      `;
      stream.appendChild(card);
    });
  }

  renderTerminal(logs) {
    const termBody = document.getElementById('live-terminal-body');
    if (!termBody) return;
    const pre = termBody.querySelector('.term-pre code');
    if (pre) {
      pre.innerHTML = logs.join('\n') + '\n<span class="term-cursor">█</span>';
      termBody.scrollTop = termBody.scrollHeight;
    }
  }

  renderDiffFileTree(diffFiles) {
    const treeList = document.querySelector('.diff-file-tree .tree-list');
    if (!treeList) return;
    treeList.innerHTML = '';
    Object.keys(diffFiles).forEach((key, index) => {
      const file = diffFiles[key];
      const item = document.createElement('div');
      item.className = `tree-item ${index === 0 ? 'active' : ''}`;
      item.setAttribute('data-file-key', key);
      item.innerHTML = `
        <span class="file-state state-mod">M</span>
        <div class="tree-item-info">
          <span class="file-name">${file.filename}</span>
          <span class="diff-counts"><span class="text-emerald">${file.linesBadge}</span></span>
        </div>
      `;
      item.addEventListener('click', () => {
        document.querySelectorAll('.diff-file-tree .tree-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.selectDiffFile(key);
      });
      treeList.appendChild(item);
    });
  }

  selectDiffFile(key) {
    this.activeDiffFileKey = key;
    this.renderDiff(key);
  }

  renderDiff(key) {
    const ticket = this.ticketsData[this.currentTicketKey];
    if (!ticket || !ticket.diffFiles[key]) return;
    const data = ticket.diffFiles[key];

    const fnEl = document.getElementById('diff-active-filename');
    if (fnEl) fnEl.textContent = data.filename;

    const annotation = document.querySelector('.agent-annotation-badge');
    if (annotation) annotation.innerHTML = `<span class="ai-sparkle">✨</span> Agent Justification: ${data.justification}`;

    const noteContent = document.querySelector('.inline-ai-note .note-content span');
    if (noteContent) noteContent.textContent = `"${data.reasoning}"`;

    const container = document.getElementById('diff-lines-display');
    if (!container) return;

    container.innerHTML = '';

    if (this.diffMode === 'unified') {
      // Unified Mode
      data.lines.forEach(line => {
        const row = document.createElement('div');
        row.className = `diff-line ${line.type}`;
        row.innerHTML = `<span class="ln">${line.newLn || line.oldLn}</span><span class="code">${this.escapeHtml(line.code)}</span>`;
        container.appendChild(row);
      });
    } else {
      // Split Side-by-Side Mode
      const splitBox = document.createElement('div');
      splitBox.className = 'diff-split-container';

      splitBox.innerHTML = `
        <div class="diff-split-header">
          <div class="split-head-col"><span>Original (Base Branch)</span></div>
          <div class="split-head-col"><span>Modified (${ticket.runtimeName})</span></div>
        </div>
        <div class="diff-split-body"></div>
      `;

      const splitBody = splitBox.querySelector('.diff-split-body');

      data.lines.forEach(line => {
        if (line.type === 'hunk-header') {
          const row = document.createElement('div');
          row.className = 'diff-split-row';
          row.innerHTML = `<div class="diff-split-cell hunk-header">${this.escapeHtml(line.code)}</div>`;
          splitBody.appendChild(row);
        } else if (line.type === 'ctx') {
          const row = document.createElement('div');
          row.className = 'diff-split-row';
          row.innerHTML = `
            <div class="diff-split-cell ctx"><span class="ln">${line.oldLn}</span><span class="code">${this.escapeHtml(line.code)}</span></div>
            <div class="diff-split-cell ctx"><span class="ln">${line.newLn}</span><span class="code">${this.escapeHtml(line.code)}</span></div>
          `;
          splitBody.appendChild(row);
        } else if (line.type === 'del') {
          const row = document.createElement('div');
          row.className = 'diff-split-row';
          row.innerHTML = `
            <div class="diff-split-cell del"><span class="ln">${line.oldLn}</span><span class="code">${this.escapeHtml(line.code)}</span></div>
            <div class="diff-split-cell empty"><span class="ln"></span><span class="code"></span></div>
          `;
          splitBody.appendChild(row);
        } else if (line.type === 'add') {
          const row = document.createElement('div');
          row.className = 'diff-split-row';
          row.innerHTML = `
            <div class="diff-split-cell empty"><span class="ln"></span><span class="code"></span></div>
            <div class="diff-split-cell add"><span class="ln">${line.newLn}</span><span class="code">${this.escapeHtml(line.code)}</span></div>
          `;
          splitBody.appendChild(row);
        }
      });

      container.appendChild(splitBox);
    }
  }

  navigateTo(screenId) {
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (!targetScreen) return;

    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    targetScreen.classList.add('active');

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.getAttribute('data-screen') === screenId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.currentScreen = screenId;
    this.updateWorkflowStepper(screenId);
    this.closeMobileSidebar();
    targetScreen.scrollTop = 0;
  }

  handleStepperJump(stepNum) {
    const stepMap = {
      '1': 'jira-detail',
      '2': 'jira-detail',
      '3': 'jira-detail',
      '4': 'ai-plan',
      '5': 'ai-plan',
      '6': 'agent-execution',
      '7': 'code-changes',
      '8': 'testing',
      '9': 'completion'
    };
    if (stepMap[stepNum]) {
      this.navigateTo(stepMap[stepNum]);
    }
  }

  updateWorkflowStepper(screenId) {
    const ticket = this.ticketsData[this.currentTicketKey];
    const ticketCurrentStep = ticket ? ticket.currentStep : 6;

    const screenToStep = {
      'dashboard': null,
      'jira-detail': 2,
      'ai-plan': 5,
      'agent-execution': 6,
      'code-changes': 7,
      'testing': 8,
      'completion': 9,
      'settings': null
    };

    const activeStep = screenToStep[screenId] || ticketCurrentStep;

    document.querySelectorAll('.stepper-track .step-node').forEach(node => {
      const nodeStep = parseInt(node.getAttribute('data-step'), 10);
      node.classList.remove('completed', 'in-progress', 'pending');

      if (nodeStep < activeStep) {
        node.classList.add('completed');
        node.querySelector('.step-dot').textContent = '✓';
      } else if (nodeStep === activeStep) {
        node.classList.add('in-progress');
        node.querySelector('.step-dot').textContent = nodeStep.toString();
      } else {
        node.classList.add('pending');
        node.querySelector('.step-dot').textContent = nodeStep.toString();
      }
    });
  }

  startExecutionTimer() {
    this.timerInterval = setInterval(() => {
      const ticket = this.ticketsData[this.currentTicketKey];
      if (ticket && !this.isPaused && ticket.status === 'executing') {
        ticket.elapsedSeconds++;
        this.renderExecutionTimer(ticket.elapsedSeconds);
      }
    }, 1000);
  }

  renderExecutionTimer(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    const timerEl = document.getElementById('exec-timer');
    if (timerEl) timerEl.textContent = `00:${mins}:${secs}`;
  }

  // Operator Steer Guidance with Agent Response Synthesis
  sendSteerCommand() {
    const input = document.getElementById('agent-steer-input');
    if (!input || !input.value.trim()) return;

    const commandText = input.value.trim();
    input.value = '';

    const ticket = this.ticketsData[this.currentTicketKey];
    const thoughtStream = document.getElementById('thought-stream');

    if (thoughtStream) {
      // 1. Inject Human Guidance Card
      const steerCard = document.createElement('div');
      steerCard.className = 'thought-card done';
      steerCard.innerHTML = `
        <div class="thought-meta">
          <span class="step-num text-amber">Human Operator Guidance</span>
          <span class="tool-tag tag-cyan">steer: operator_prompt</span>
          <span class="time font-mono">Just now</span>
        </div>
        <div class="thought-body">
          <p class="thought-reasoning">"Constraint injected by Alex Chen: '${commandText}'"</p>
          <div class="tool-call-box">
            <code>apply_constraint(instruction: "${commandText}")</code>
          </div>
        </div>
      `;
      thoughtStream.appendChild(steerCard);

      // 2. Synthesize Agent Immediate Response Card
      setTimeout(() => {
        const responseCard = document.createElement('div');
        responseCard.className = 'thought-card steer-response active';
        responseCard.innerHTML = `
          <div class="thought-meta">
            <span class="step-num text-cyan">${ticket.runtimeName} Adaptation</span>
            <span class="tool-tag tag-cyan">runtime: re-plan</span>
            <span class="time font-mono">Now</span>
          </div>
          <div class="thought-body">
            <p class="thought-reasoning">"Acknowledged constraint. Incorporating directive '${commandText}' into AST pipeline and updating assertions."</p>
            <div class="tool-call-box active-pulse">
              <code>recompile_ast(constraints: ["${commandText}"])</code>
            </div>
          </div>
        `;
        thoughtStream.appendChild(responseCard);
        thoughtStream.scrollTop = thoughtStream.scrollHeight;
      }, 500);

      thoughtStream.scrollTop = thoughtStream.scrollHeight;
    }

    this.appendTerminalLog(`<span class="term-yellow">[STEER] Operator injected constraint: "${commandText}"</span>`);
    this.appendTerminalLog(`<span class="term-cyan">[${ticket.runtimeName.toUpperCase()}] Updating AST parameters & re-verifying constraints...</span>`);
    this.showToast('Steer instruction acknowledged by runtime', 'success');
  }

  appendTerminalLog(htmlLine) {
    const termBody = document.getElementById('live-terminal-body');
    if (!termBody) return;
    const pre = termBody.querySelector('.term-pre code');
    if (pre) {
      const newLine = document.createElement('div');
      newLine.innerHTML = htmlLine;
      pre.appendChild(newLine);
      termBody.scrollTop = termBody.scrollHeight;
    }
  }

  clearTerminal() {
    const termBody = document.getElementById('live-terminal-body');
    if (!termBody) return;
    const pre = termBody.querySelector('.term-pre code');
    if (pre) {
      pre.innerHTML = '<span class="term-dim">Terminal cleared. Sandbox container active.</span>\n<span class="term-cursor">█</span>';
    }
  }

  toggleAgentPause() {
    this.isPaused = !this.isPaused;
    const pauseBtnText = document.getElementById('pause-text');
    const pauseIcon = document.getElementById('pause-icon');

    if (this.isPaused) {
      if (pauseBtnText) pauseBtnText.textContent = 'Resume Agent (Space)';
      if (pauseIcon) pauseIcon.textContent = '▶';
      this.showToast('Agent execution paused. Sandbox frozen.', 'warning');
      this.appendTerminalLog('<span class="term-yellow">[PAUSED] Agent state suspended by operator Alex Chen</span>');
    } else {
      if (pauseBtnText) pauseBtnText.textContent = 'Pause Agent (Space)';
      if (pauseIcon) pauseIcon.textContent = '⏸';
      this.showToast('Agent resumed execution.', 'success');
      this.appendTerminalLog('<span class="term-cyan">[RESUMED] Worker resuming container pipeline...</span>');
    }
  }

  abortAgentRun() {
    if (confirm('Are you sure you want to ABORT this orchestrator run? Ephemeral container state will be cleaned up.')) {
      this.isPaused = true;
      this.showToast('Agent run aborted. Branch safely preserved.', 'warning');
      this.appendTerminalLog('<span class="term-red">[ABORTED] Operator issued SIGINT. Cleaning up container cgroups...</span>');
    }
  }

  // 4-Stage Test Suite Runner Simulation
  simulateRunAllTests() {
    const btn = document.getElementById('btn-re-run-tests');
    const cards = document.querySelectorAll('.pipeline-pill-row .pipeline-card');

    if (btn) btn.innerHTML = '<span>⏳</span> Running verification...';

    // Step through each test stage
    cards.forEach((card, idx) => {
      card.classList.remove('passed');
      card.classList.add('running');
      card.querySelector('.badge-pipe-success').textContent = 'RUNNING';

      setTimeout(() => {
        card.classList.remove('running');
        card.classList.add('passed');
        card.querySelector('.badge-pipe-success').textContent = 'PASS';
      }, (idx + 1) * 600);
    });

    setTimeout(() => {
      if (btn) {
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          Re-Run Verification
        `;
      }
      this.showToast('All 4 Verification Stages Passed! Acceptance criteria satisfied.', 'success');
    }, 2600);
  }

  // Browser Subagent Video Replay
  replayBrowserSession() {
    const btn = document.getElementById('btn-replay-browser');
    const progressBar = document.getElementById('browser-video-progress');
    const cursor = document.getElementById('sim-cursor');
    if (!progressBar) return;

    if (btn) btn.innerHTML = '<span>⏳</span> Replaying...';
    progressBar.style.width = '0%';
    progressBar.style.transition = 'none';

    if (cursor) {
      cursor.style.transform = 'translate(-40px, -20px)';
      cursor.textContent = '🔄 Initializing Playwright sandbox...';
    }

    setTimeout(() => {
      progressBar.style.transition = 'width 3.5s linear';
      progressBar.style.width = '100%';
      if (cursor) {
        cursor.textContent = '⚡ Firing 10 concurrent webhook requests...';
        cursor.style.transform = 'translate(10px, 0px)';
      }
    }, 100);

    setTimeout(() => {
      if (cursor) {
        cursor.textContent = '✔ AC-3 Verified: 0 duplicate ledger writes!';
      }
      if (btn) btn.innerHTML = '<span>▶</span> Replay Session';
      this.showToast('Browser verification session replay completed (8.2s)', 'success');
    }, 3800);
  }

  // Jira Bi-Directional Synchronization & PR Release
  triggerJiraSyncComplete() {
    const ticket = this.ticketsData[this.currentTicketKey];
    const btn = document.getElementById('btn-sync-jira-final');
    if (btn) btn.innerHTML = '<span>⏳</span> Synchronizing with Jira Cloud...';

    setTimeout(() => {
      if (btn) {
        btn.innerHTML = `<span>✓</span> Synchronized to Jira (${ticket.key})`;
        btn.classList.add('btn-secondary');
        btn.classList.remove('btn-success');
      }

      ticket.status = 'completed';

      const topBadge = document.getElementById('topbar-ticket-badge');
      if (topBadge) topBadge.textContent = `${ticket.key} (IN REVIEW)`;

      this.showToast(`Jira issue ${ticket.key} transitioned to "In Review", FinOps metadata attached & PR #${ticket.prNumber} ready!`, 'success');
    }, 1500);
  }

  syncJiraWebhooks() {
    this.showToast('Jira Webhooks synced. Backlog issues ingested & evaluated by Policy Engine.', 'success');
  }

  // Multi-Agent Runtime Override
  handleRuntimeOverride(selectedRuntime) {
    const ticket = this.ticketsData[this.currentTicketKey];
    if (!ticket) return;

    if (selectedRuntime === 'cursor') {
      ticket.runtime = 'cursor';
      ticket.runtimeName = 'Cursor Agent';
      ticket.model = 'Claude 3.7 Sonnet (Thinking)';
      ticket.cost = 0.58;
      this.showToast('Runtime manually overridden to Cursor Agent (Claude 3.7 Sonnet) - Est: $0.58', 'purple');
      this.appendTerminalLog('<span class="term-purple">[POLICY OVERRIDE] Operator switched runtime: Cursor Headless Agent attached.</span>');
    } else {
      ticket.runtime = 'antigravity';
      ticket.runtimeName = 'Google Antigravity';
      ticket.model = selectedRuntime === 'antigravity-ultra' ? 'Gemini 3 Ultra' : 'Gemini 3 (Thinking Core)';
      ticket.cost = selectedRuntime === 'antigravity-ultra' ? 0.18 : 0.038;
      this.showToast(`Runtime set to ${ticket.runtimeName} (${ticket.model}) - Cost: $${ticket.cost}`, 'success');
      this.appendTerminalLog(`<span class="term-cyan">[POLICY ENGINE] Dispatched to ${ticket.runtimeName} (${ticket.model})</span>`);
    }

    this.switchTicket(this.currentTicketKey);
  }

  // Simulate Automatic Two-Tier Fallback / Escalation to Cursor Agent
  simulateEscalateToCursor() {
    const ticket = this.ticketsData[this.currentTicketKey];
    if (!ticket) return;

    ticket.status = 'escalated';
    this.handleRuntimeOverride('cursor');

    const thoughtStream = document.getElementById('thought-stream');
    if (thoughtStream) {
      const escCard = document.createElement('div');
      escCard.className = 'thought-card escalation-active';
      escCard.innerHTML = `
        <div class="thought-meta">
          <span class="step-num text-purple">Tier-2 Escalation Cascade</span>
          <span class="tool-tag tag-purple">orchestrator: handoff</span>
          <span class="time font-mono">Just now</span>
        </div>
        <div class="thought-body">
          <p class="thought-reasoning">"⚡ Policy Rule #4 Triggered: Freezing Antigravity container checkpoint. Escalating task to Cursor Agent (Claude 3.7 Sonnet) with packaged failure diff & AST context."</p>
          <div class="tool-call-box" style="border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
            <code>handoff_to_cursor_agent(checkpoint: "${ticket.agentBranch}", target: "claude-3-7-sonnet")</code>
          </div>
        </div>
      `;
      thoughtStream.appendChild(escCard);
      thoughtStream.scrollTop = thoughtStream.scrollHeight;
    }

    this.appendTerminalLog(`<span class="term-purple">[ESCALATION CASCADE] Snapshotting git branch \`${ticket.agentBranch}\`...</span>`);
    this.appendTerminalLog('<span class="term-purple">[CURSOR AGENT] Connected. Deep reasoning engine initialized (Claude 3.7 Sonnet).</span>');
    this.showToast(`Escalated ${ticket.key} to Cursor Agent (Claude 3.7 Sonnet)`, 'purple');

    if (this.currentScreen !== 'agent-execution') {
      this.navigateTo('agent-execution');
    }
  }

  // Modals & Human Gates
  showApprovePlanModal() {
    const modal = document.getElementById('modal-approve-plan');
    if (modal) modal.classList.add('active');
  }

  showRequestChangesModal() {
    const modal = document.getElementById('modal-request-changes');
    if (modal) modal.classList.add('active');
  }

  closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  confirmPlanApproval() {
    this.closeModals();
    const ticket = this.ticketsData[this.currentTicketKey];
    ticket.status = 'executing';
    ticket.currentStep = 6;
    this.showToast(`Plan approved for ${ticket.key} with High Risk Authorization. Granting sandbox permissions...`, 'success');
    setTimeout(() => {
      this.navigateTo('agent-execution');
    }, 600);
  }

  submitPlanChanges() {
    const txt = document.getElementById('request-change-textarea');
    const val = txt ? txt.value.trim() : '';
    this.closeModals();
    this.showToast(`Feedback submitted to ${this.ticketsData[this.currentTicketKey].runtimeName}: "${val || 'Regenerating plan proposal'}"`, 'warning');
  }

  // Settings & Policy Engine Persistence
  loadPersistedSettings() {
    try {
      const saved = localStorage.getItem('graviton_policy_settings');
      if (saved) {
        const config = JSON.parse(saved);
        const gateDb = document.getElementById('gate-db');
        if (gateDb && config.mandatoryDbApproval !== undefined) {
          gateDb.checked = config.mandatoryDbApproval;
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  saveSettings() {
    const gateDb = document.getElementById('gate-db');
    const settings = {
      mandatoryDbApproval: gateDb ? gateDb.checked : true,
      lastSaved: new Date().toISOString()
    };
    try {
      localStorage.setItem('graviton_policy_settings', JSON.stringify(settings));
    } catch (e) {}

    // Gracefully inform server if up
    fetch('/api/policy-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(() => {});

    this.showToast('Policy Engine Routing Rules & Provider Matrix saved successfully.', 'success');
  }

  testAllConnections() {
    this.showToast('Probing Jira Cloud (14ms), Antigravity gRPC (6ms), and Cursor daemon (2ms)... All healthy.', 'success');
  }

  // Command Palette
  initCommandPalette() {
    const input = document.getElementById('palette-search-input');
    const list = document.getElementById('palette-results-list');
    if (!input || !list) return;

    const commands = [
      { id: 'ticket_pay1429', title: 'Switch Active Ticket: PAY-1429 (Stripe Webhook Idempotency)', cat: 'Ticket', icon: '💳' },
      { id: 'ticket_auth891', title: 'Switch Active Ticket: AUTH-891 (PKCE OAuth2 Verification)', cat: 'Ticket', icon: '🔑' },
      { id: 'ticket_core402', title: 'Switch Active Ticket: CORE-402 (Kafka Graceful Shutdown)', cat: 'Ticket', icon: '⚡' },
      { id: 'dashboard', title: '1. Operations Dashboard', cat: 'Navigation', icon: '📊' },
      { id: 'jira-detail', title: '2. Jira & Policy Routing', cat: 'Policy', icon: '📋' },
      { id: 'ai-plan', title: '3. AI Implementation Plan (Approval Gate)', cat: 'Review', icon: '📐' },
      { id: 'agent-execution', title: '4. Agent Execution Runtime', cat: 'Runtime', icon: '⚡' },
      { id: 'code-changes', title: '5. Unified / Split Code Diff Viewer', cat: 'Diffs', icon: '📄' },
      { id: 'testing', title: '6. Testing & Browser UI Verification', cat: 'Quality', icon: '✅' },
      { id: 'completion', title: '7. Completion & Jira Bi-Directional Sync', cat: 'Release', icon: '🚀' },
      { id: 'settings', title: '8. Policy Engine & Provider Matrix', cat: 'Admin', icon: '🛡️' },
      { id: 'diff_toggle', title: 'Toggle Unified vs Side-by-Side Split Diff Mode', cat: 'View', icon: '⚖️' },
      { id: 'pause', title: 'Pause / Resume Current Agent Sandbox Run', cat: 'Control', icon: '⏸' },
      { id: 'approve', title: 'Approve Plan & Launch Execution', cat: 'Action', icon: '✓' }
    ];

    const render = (items) => {
      list.innerHTML = '';
      items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `palette-item ${index === 0 ? 'selected' : ''}`;
        div.innerHTML = `
          <div class="palette-item-left">
            <span>${item.icon}</span>
            <strong>${item.title}</strong>
          </div>
          <span class="badge-subtle font-mono text-xs">${item.cat}</span>
        `;
        div.addEventListener('click', () => {
          this.executePaletteAction(item.id);
          this.closeModals();
        });
        list.appendChild(div);
      });
    };

    render(commands);

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = commands.filter(c => c.title.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q));
      render(filtered);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const sel = list.querySelector('.palette-item.selected');
        if (sel) sel.click();
      }
    });
  }

  openCommandPalette() {
    const modal = document.getElementById('modal-cmd-palette');
    const input = document.getElementById('palette-search-input');
    if (modal) {
      modal.classList.add('active');
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  }

  executePaletteAction(id) {
    if (id === 'ticket_pay1429') {
      this.switchTicket('PAY-1429');
    } else if (id === 'ticket_auth891') {
      this.switchTicket('AUTH-891');
    } else if (id === 'ticket_core402') {
      this.switchTicket('CORE-402');
    } else if (id === 'diff_toggle') {
      const targetBtn = this.diffMode === 'unified' ? document.getElementById('diff-split-btn') : document.getElementById('diff-unified-btn');
      if (targetBtn) targetBtn.click();
    } else if (['dashboard', 'jira-detail', 'ai-plan', 'agent-execution', 'code-changes', 'testing', 'completion', 'settings'].includes(id)) {
      this.navigateTo(id);
    } else if (id === 'pause') {
      this.toggleAgentPause();
    } else if (id === 'approve') {
      this.showApprovePlanModal();
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'purple') icon = '⚡';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global App Initialization
window.addEventListener('DOMContentLoaded', () => {
  window.app = new AntigravityApp();
});
