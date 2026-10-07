# Graviton: Autonomous Engineering Orchestrator & Jira Bridge

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Architecture](https://img.shields.io/badge/architecture-Multi--Agent%20Dual--Tier-00e5ff)](https://github.com/muhammadhassan1244/Autonomous-Engineering-Orchestrator)
[![Tier 1 Runtime](https://img.shields.io/badge/Tier%201%20Runtime-Google%20Antigravity%20(Gemini%203)-4285F4?logo=google&logoColor=white)](https://deepmind.google/)
[![Tier 2 Runtime](https://img.shields.io/badge/Tier%202%20Runtime-Cursor%20Agent%20(Claude%203.7)-7c3aed)](https://cursor.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/status-active%20production%20ready-00f59b)](#)

> **Graviton** is an enterprise-grade, policy-driven autonomous engineering orchestrator that sits between issue trackers (Jira, Linear, GitHub Issues) and AI coding agent runtimes. It automates ticket triage, dynamically routes tasks to the most cost-effective agent tier based on complexity, enforces human-in-the-loop safety gates, executes changes in isolated sandboxes, and synchronizes code commits and PRs back to Jira.

---

## Table of Contents

1. [Executive Summary & Value Proposition](#executive-summary--value-proposition)
2. [System Architecture](#system-architecture)
   - [High-Level Architecture Diagram](#high-level-architecture-diagram)
   - [Ticket Lifecycle Sequence Flow](#ticket-lifecycle-sequence-flow)
   - [Two-Tier Escalation State Machine](#two-tier-escalation-state-machine)
3. [Core Capabilities & Features](#core-capabilities--features)
4. [The 8-Stage Engineering Workbench](#the-8-stage-engineering-workbench)
5. [Policy Routing Engine & FinOps](#policy-routing-engine--finops)
6. [API Specification](#api-specification)
   - [REST Endpoints](#rest-endpoints)
   - [Server-Sent Events (SSE) Telemetry Stream](#server-sent-events-sse-telemetry-stream)
7. [Repository Structure](#repository-structure)
8. [Getting Started & Quickstart](#getting-started--quickstart)
9. [Automated Verification & Testing](#automated-verification--testing)
10. [Configuration & Guardrails](#configuration--guardrails)
11. [License](#license)

---

## Executive Summary & Value Proposition

Enterprise engineering organizations adopting generative AI face three major bottlenecks:
1. **Excessive Frontier Model Costs**: Routing every simple CRUD bug, documentation fix, or schema patch to expensive frontier models burns tens of thousands in unmanaged API spend.
2. **Lack of Governance & Quality Gates**: Autonomous agents modifying database schemas or running unconstrained migrations risk catastrophic production outages without human authorization.
3. **Tool Fragmentation**: Disconnect between Jira ticketing, agent execution environments, diff review tools, and GitHub pull request lifecycles.

**Graviton** solves these challenges by introducing:
- **Intelligent Fleet Allocation**: 68% of standard tasks are resolved by **Tier 1 (Google Antigravity with Gemini 3 Thinking / Flash)** at ~$0.04/task. Critical architectural or cryptographically sensitive tasks escalate to **Tier 2 (Cursor Agent with Claude 3.7 Sonnet Thinking)** at ~$0.58-$1.00/task, saving **up to 78% Month-to-Date (MTD)**.
- **Mandatory Quality & Risk Gates**: Automated risk scoring flags DDL schema modifications, relational table migrations (>1M rows), and crypto changes, locking execution until authorized by a Staff Engineer.
- **Bi-Directional Jira & Git Sync**: Real-time ticket status transitions (`In Progress` &rarr; `In Review` &rarr; `PR Created`), automated branch creation (`feat/PAY-1429-idempotency`), and atomic PR assembly.
- **Glassmorphic Multi-Device Workbench**: High-density desktop IDE layout with an off-canvas drawer and media queries responsive down to 320px mobile screens.

---

## System Architecture

### High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph Ingestion["Issue Ingestion Layer"]
        Jira[Jira Cloud / Data Center Webhooks]
        Linear[Linear / GitHub Issues API]
    end

    subgraph Core["Graviton Orchestrator (server.js)"]
        IngestEngine[Webhook Ingest & Normalizer]
        PolicyEngine["Policy & Routing Engine<br/>(Rules Matrix + Budget Caps)"]
        Store[("In-Memory State Store<br/>(Tickets & Config)")]
        SSE["SSE Broadcaster<br/>(/api/stream/events)"]
        SafetyGate["Human-in-the-Loop Quality Gatekeeper<br/>(DDL & Destructive Ops Check)"]
    end

    subgraph Runtimes["Multi-Agent Execution Runtimes"]
        subgraph Tier1["Tier 1: Antigravity Runtime"]
            AGY_Core["Google Antigravity Core<br/>(gRPC :8443)"]
            Gemini3["Gemini 3 Deep Think & Flash"]
        end

        subgraph Tier2["Tier 2: Frontier Escalation"]
            Cursor_Daemon["Cursor Headless Daemon<br/>(HTTP :4040/cursor/v1)"]
            ClaudeSonnet["Claude 3.7 Sonnet (Thinking)"]
        end
    end

    subgraph Sandbox["Execution Sandbox & Verification"]
        Container["Isolated Container / cgroup Sandbox"]
        AST["AST Analyzer & Static Verifier"]
        TestRunner["Vitest / Jest / Prisma Runner"]
        BrowserSim["Headless Browser Simulator"]
    end

    subgraph Delivery["Delivery & Synchronization"]
        GitHub["GitHub Enterprise (PR #342)"]
        JiraSync["Jira Bidirectional Status Sync"]
    end

    Jira --> IngestEngine
    Linear --> IngestEngine
    IngestEngine --> PolicyEngine
    PolicyEngine <--> Store
    PolicyEngine -->|Rule Match: Fast / Budget| AGY_Core
    PolicyEngine -->|Rule Match: High Risk / Frontier| Cursor_Daemon

    AGY_Core --- Gemini3
    Cursor_Daemon --- ClaudeSonnet

    AGY_Core -->|Auto-Escalate on 2x Test Fail| Cursor_Daemon

    AGY_Core --> Container
    Cursor_Daemon --> Container

    Container --> AST
    Container --> TestRunner
    Container --> BrowserSim

    AST & TestRunner --> SafetyGate
    SafetyGate -->|Approved| GitHub
    SafetyGate -->|Status Update| JiraSync
    JiraSync --> Jira

    Store --> SSE
    SSE -.-> ClientUI["Graviton Web App (app.js + index.html)"]
```

---

### Ticket Lifecycle Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Lead
    participant Jira as Jira API
    participant Graviton as Graviton Orchestrator
    participant Policy as Policy Engine
    participant AGY as Tier 1: Antigravity (Gemini 3)
    participant Cursor as Tier 2: Cursor (Claude 3.7)
    participant Sandbox as Container Sandbox
    participant Git as GitHub Enterprise

    Dev->>Jira: Creates Ticket (PAY-1429: Webhook Idempotency)
    Jira->>Graviton: Webhook Event: issue_assigned
    Graviton->>Policy: Evaluate Ticket (Type, Priority, Components, Risk)
    Policy-->>Graviton: Route: Antigravity Tier 1 ($0.20 Cap, Gemini 3)
    Graviton->>AGY: Dispatch Task with Context & Git Branch
    AGY->>Sandbox: Spin up isolated cgroup container
    AGY->>Sandbox: Generate idempotency service & update schema.prisma
    Sandbox-->>AGY: DDL Migration Detected (High Risk)
    AGY->>Graviton: Trigger Human Quality Gate (DDL Schema Modification)
    Graviton-->>Dev: UI Alert: Gate Approval Required
    Dev->>Graviton: Authorize DDL Migration in UI
    Graviton->>AGY: Resume Execution
    AGY->>Sandbox: Execute Vitest (10 concurrent webhook stress test)
    Sandbox-->>AGY: 4/4 Tests Pass (100% assertions green)
    AGY->>Git: Commit (f81b3c9) & Open PR #342
    Graviton->>Jira: Transition Ticket: 'In Review', Link PR #342
    Graviton->>Dev: Telemetry & Notification: Complete ($0.038, 522s)
```

---

### Two-Tier Escalation State Machine

```mermaid
stateDiagram-v2
    [*] --> Triage: Ticket Ingested
    Triage --> PolicyRouting: Parse AST & Metadata

    state PolicyRouting {
        [*] --> EvaluateRules
        EvaluateRules --> Tier1_Candidate: Points <= 3 OR CRUD/Schema
        EvaluateRules --> Tier2_Candidate: Bug + Highest Priority OR Crypto
    }

    Tier1_Candidate --> Tier1_Execution: Dispatch Antigravity
    Tier2_Candidate --> Tier2_Execution: Dispatch Cursor Agent

    state Tier1_Execution {
        [*] --> Planning_T1
        Planning_T1 --> Implementation_T1
        Implementation_T1 --> Verification_T1
        Verification_T1 --> TestPassed_T1: Tests Pass (1st or 2nd try)
        Verification_T1 --> TestFailed_T1: Tests Fail 2x consecutive
    }

    TestFailed_T1 --> AutoEscalation: Auto-Escalate Triggered
    AutoEscalation --> Tier2_Execution: Package AST State & Hand off

    state Tier2_Execution {
        [*] --> DeepReasoning_T2
        DeepReasoning_T2 --> Implementation_T2
        Implementation_T2 --> Verification_T2
        Verification_T2 --> TestPassed_T2: Tests Pass
    }

    TestPassed_T1 --> QualityGate
    TestPassed_T2 --> QualityGate

    state QualityGate {
        [*] --> InspectRisk
        InspectRisk --> AutoApprove: Low Risk / No DDL
        InspectRisk --> AwaitHumanSignoff: DDL / High Risk (>1M rows)
        AwaitHumanSignoff --> Approved: Lead Engineer Signs Off
    }

    AutoApprove --> DeploymentSync
    Approved --> DeploymentSync

    state DeploymentSync {
        [*] --> GitPush
        GitPush --> CreatePR
        CreatePR --> JiraStatusUpdate
    }

    DeploymentSync --> [*]: Task Complete
```

---

## Core Capabilities & Features

| Capability | Graviton Orchestrator | Traditional Agent Tools |
| :--- | :--- | :--- |
| **Routing Architecture** | Dynamic dual-tier multi-agent (Antigravity & Cursor) | Single runtime locked to one provider |
| **FinOps Cost Optimization** | Policy-driven model selection saving up to 78% MTD | Uncontrolled frontier token burn |
| **Safety Guardrails** | Automatic DDL approval gates & destructive command interception | Unchecked terminal execution |
| **Live Telemetry** | Real-time Server-Sent Events (SSE) tracking elapsed time & budget | Static polling or manual refresh |
| **Sandbox Isolation** | Cgroup/container sandbox with isolated ephemeral Postgres | Executes directly on developer host |
| **Verification & QA** | AST diff mutation checks, Vitest runner, and UI playback | Manual linting or basic unit tests |
| **Jira & Git Sync** | Bi-directional workflow sync with branch & PR automation | Manual branch and status updating |
| **User Interface** | Responsive dark-mode dashboard with mobile off-canvas drawer | CLI-only or standard web view |

---

## The 8-Stage Engineering Workbench

Graviton provides an 8-stage interactive engineering workflow tailored for Staff and Principal Engineers:

1. **Dashboard**
   - Fleet-wide telemetry, agent allocation balance (68% Antigravity / 32% Cursor), ticket queue, and Month-to-Date (MTD) FinOps savings counter.
2. **Jira & Policy Routing**
   - Deep dive into incoming tickets (`PAY-1429`, `AUTH-891`, `CORE-402`), policy rule triggers, target runtime assignments, and cost budget caps.
3. **AI Implementation Plan**
   - Architectural risk scorecard, file impact matrix (Modified `M`, Added `A`, Deleted `D`), DDL migration alerts, and human-in-the-loop authorization gates.
4. **Agent Execution Runtime**
   - Split-view workbench pairing a real-time agent **Thought Stream** (reasoning logs, tool calls) with a sandboxed **Virtual Terminal** displaying containerized bash execution.
   - Interactive human steer bar allowing real-time guidance prompts or paused execution.
5. **Code Changes & AST Diff**
   - Syntax-highlighted unified and split side-by-side diff viewers with line numbering, hunk headers, and contextual AI reasoning for every file modified.
6. **Testing & Verification**
   - Automated test runner executing unit and integration suites with concurrent stress simulations (e.g. 10 simultaneous webhook requests).
   - Headless browser recording simulator with time-scrubber and playback controls.
7. **Completion & Sync**
   - GitHub Pull Request creation summary, diff statistics (`+142 / -18`), commit hash reference, and automated bi-directional Jira ticket transition to `IN REVIEW`.
8. **Policy Engine & Providers Matrix**
   - Central control plane for configuring runtime endpoints, gRPC connections, fallback cascades, budget limits, and destructive operation guardrails.

---

## Policy Routing Engine & FinOps

Graviton uses an extensible rules matrix to evaluate every incoming issue against structured criteria before dispatching to an agent runtime:

```json
{
  "tier1": {
    "runtime": "antigravity",
    "endpoint": "grpc://antigravity.internal:8443",
    "model": "Gemini 3 (Thinking Core)",
    "workers": 4
  },
  "tier2": {
    "runtime": "cursor",
    "daemonUrl": "http://localhost:4040/cursor/v1",
    "model": "Claude 3.7 Sonnet (Thinking)",
    "autoEscalateFailures": 2
  },
  "rules": [
    {
      "id": 1,
      "condition": "Issue.Type == \"Bug\" AND Priority == \"Highest\"",
      "target": "Cursor Agent (Claude 3.7)",
      "budget": 1.50
    },
    {
      "id": 2,
      "condition": "Components in [\"DB\", \"Schema\", \"CRUD\", \"Fastify\"]",
      "target": "Antigravity (Gemini 3)",
      "budget": 0.20
    },
    {
      "id": 3,
      "condition": "StoryPoints <= 3 OR Labels in [\"chore\", \"docs\"]",
      "target": "Antigravity (Gemini 3 Flash)",
      "budget": 0.10
    },
    {
      "id": 4,
      "condition": "Fallback: If Tier 1 tests fail 2x",
      "target": "Auto-Escalate to Cursor",
      "budget": 0.80
    }
  ],
  "guardrails": {
    "mandatoryDbApproval": true,
    "blockDestructiveOps": true
  }
}
```

---

## API Specification

The Graviton backend runs a native Node.js HTTP server (`server.js`) without external framework dependencies.

### REST Endpoints

#### 1. List All Active Tickets
- **Endpoint**: `GET /api/tickets`
- **Response**: `200 OK`
```json
[
  {
    "key": "PAY-1429",
    "title": "Stripe webhook duplicate charge due to missing idempotency",
    "repo": "acme-corp/payment-service",
    "status": "executing",
    "assignedRuntime": "antigravity",
    "activeModel": "Gemini 3 (Thinking Core)",
    "step": 4,
    "totalSteps": 7,
    "cost": 0.038,
    "costCap": 0.50,
    "elapsedSeconds": 522,
    "branch": "feat/PAY-1429-idempotency",
    "riskLevel": "HIGH (DDL Migration)"
  }
]
```

#### 2. Get Ticket Details
- **Endpoint**: `GET /api/tickets/:id`
- **Parameters**: `id` (e.g. `PAY-1429`, `AUTH-891`, `CORE-402`)
- **Response**: `200 OK` (JSON Ticket Object) or `404 Not Found`

#### 3. Transition Ticket Status
- **Endpoint**: `POST /api/tickets/:id/transition`
- **Request Body**:
```json
{
  "status": "completed"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "ticket": { "key": "PAY-1429", "status": "completed" }
}
```

#### 4. Get Policy Engine Configuration
- **Endpoint**: `GET /api/policy-config`
- **Response**: `200 OK` (Returns active tier configs, rule matrix, and guardrails)

#### 5. Update Policy Engine Configuration
- **Endpoint**: `POST /api/policy-config`
- **Request Body**: JSON partial or full policy configuration
- **Response**: `200 OK` with updated configuration

---

### Server-Sent Events (SSE) Telemetry Stream

- **Endpoint**: `GET /api/stream/events`
- **Headers**:
  ```http
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive
  ```
- **Event Payload (every 3 seconds)**:
  ```json
  data: {
    "type": "telemetry_tick",
    "timestamp": "2026-10-07T07:15:00.000Z",
    "ticket": {
      "key": "PAY-1429",
      "cost": 0.0385,
      "elapsedSeconds": 523
    }
  }
  ```

---

## Repository Structure

```
d:/google-antigravity/
├── index.html              # Graviton Desktop UI (8-stage workbench, modals, command palette)
├── app.js                  # Frontend Application Controller (state management, diffs, SSE)
├── style.css               # Design System (dark-mode theme, glassmorphism, responsive breakpoints)
├── server.js               # Node.js Backend Server (REST API, SSE telemetry, static hosting)
├── test-mobile-toggle.js   # Automated test suite (HTML structure, CSS queries, event listeners)
├── README.md               # Project documentation and architecture guide
└── .gitignore              # Git ignore configuration
```

---

## Getting Started & Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- Modern web browser (Chrome, Edge, Firefox, or Safari)

### Installation

1. Clone or open the repository workspace:
   ```bash
   git clone https://github.com/muhammadhassan1244/Autonomous-Engineering-Orchestrator.git
   cd Autonomous-Engineering-Orchestrator
   ```

2. Start the local Graviton Orchestrator server:
   ```bash
   node server.js
   ```

3. Launch the dashboard:
   Open your browser and navigate to:
   ```
   http://127.0.0.1:3000
   ```

### Command Palette & Keyboard Shortcuts

- Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or click the topbar search bar) to open the **Command Palette**.
- Rapidly switch between active tickets (`PAY-1429`, `AUTH-891`, `CORE-402`), trigger manual runtime escalations, or toggle split diff views.

---

## Automated Verification & Testing

Graviton includes an automated test runner verifying DOM elements, CSS media query rules, event binding, and state mutation:

```bash
node test-mobile-toggle.js
```

### Verification Checks:
- [x] `#mobile-menu-btn` hamburger structure and bar elements
- [x] `#sidebar-overlay` and `#sidebar-close-btn` drawer controls
- [x] Responsive CSS breakpoints at `1200px`, `1024px`, `768px`, and `480px`
- [x] Off-canvas drawer sliding transition (`.sidebar.mobile-open`)
- [x] Auto-dismiss drawer handler on navigation item selection
- [x] Multi-step simulated user interaction test

---

## Configuration & Guardrails

To protect production environments, Graviton enforces two critical guardrails configured in `server.js`:

1. **`mandatoryDbApproval: true`**:
   Any patch touching files matching `*schema.prisma`, `*migration*.sql`, or containing DDL statements will pause execution at Stage 3 (**AI Implementation Plan**) with a high-risk gate flag until explicitly authorized.
2. **`blockDestructiveOps: true`**:
   Sandboxed terminal commands containing `rm -rf /`, `DROP TABLE`, `TRUNCATE`, or `git push --force` are intercepted by the AST & sandbox security monitor and automatically rejected.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
