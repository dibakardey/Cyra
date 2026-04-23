# System Design: Real-Time AI Agent Activity Tracker for VSCode Insiders

## 1. Objective
To design a system that provides real-time visibility into the actions performed by AI agents within the VSCode Insiders IDE. This includes tracking file modifications, terminal commands, editor interactions, and agent-specific communications.

## 2. Requirements

### 2.1 Functional Requirements
- **Real-time Tracking**: Capture and stream agent activities as they happen.
- **Activity Types**:
    - **File System Operations**: Create, delete, rename, and modify files.
    - **Editor Changes**: Text insertions, deletions, and formatting.
    - **Terminal Activity**: Commands executed in the integrated terminal.
    - **Agent Intent/Thought**: If the agent uses a specific protocol, capture its "reasoning" or "plans".
    - **Tool Usage**: Tracking which tools (e.g., `read_file`, `write_to_file`) the agent invokes.
- **Visualization**: A dashboard (VSCode Webview or Web App) showing a live feed of activities.
- **History/Audit Log**: Ability to review past activities for debugging and auditing.

### 2.2 Non-Functional Requirements
- **Low Overhead**: The tracker should not significantly impact IDE performance or agent latency.
- **Reliability**: Events should be captured accurately without loss.
- **Security**: Sensitive data (like credentials in commands) should be redacted or handled securely.

## 3. Proposed Architecture

The system follows a **Collector-Transporter-Aggregator-Observer** pattern.

### 3.1 Components

#### A. The Collector (VSCode Extension)
A VSCode extension that acts as the "sensor" inside the IDE.
- **Hooks**:
    - `vscode.workspace.onDidCreateFiles`, `onDidDeleteFiles`, `onDidRenameFiles`, `onDidSaveTextDocument`.
    - `vscode.window.onDidChangeTextDocument`.
    - `vscode.window.onDidWriteTerminalData` (or monitoring terminal processes).
    - Intercepting agent-specific communication (if the agent is a known extension).
- **Event Formatting**: Standardizing captured data into a JSON schema.

#### B. The Transporter (Real-time Stream)
A lightweight mechanism to move events from the IDE to the backend.
- **Primary Choice**: **WebSockets (WS/WSS)** for low-latency, bi-directional communication.
- **Fallback**: Local log files or HTTP POST requests if WebSockets are unavailable.

#### C. The Aggregator (Backend Service)
A lightweight server to receive, process, and store events.
- **Tech Stack**: Node.js with Fastify or Express.
- **Functions**:
    - Validate and sanitize incoming events.
    - Broadcast events to connected Observers.
    - Persist events to a database (e.g., SQLite for local dev, PostgreSQL for production).

#### D. The Observer (Dashboard)
The user interface for monitoring.
- **Option 1: VSCode Webview**: An integrated panel within VSCode providing a seamless experience.
- **Option 2: Standalone Web App**: A React/Next.js dashboard accessible via browser, useful for multi-monitor setups.
- **Features**:
    - Live Activity Feed (Timeline view).
    - Detail View (Show diffs for file changes, full command strings).
    - Filter/Search (Filter by activity type, file path, or agent ID).

## 4. Data Schema (Example Event)

```json
{
  "timestamp": "2026-04-19T19:07:45.123Z",
  "agentId": "cline-agent-01",
  "type": "FILE_MODIFICATION",
  "payload": {
    "path": "src/components/Button.tsx",
    "action": "update",
    "diff": "--- a/src/components/Button.tsx\n+++ b/src/components/Button.tsx\n@@ -1,4 +1,4 @@\n-const Button = () => <button>Click</button>;\n+const Button = () => <button className='btn'>Click</button>;"
  },
  "metadata": {
    "editor": "insiders",
    "workspace": "/Users/dibakardey/Downloads/project"
  }
}
```

## 5. Implementation Roadmap (PoC)

### Phase 1: Foundation (The Collector)
- Scaffold a VSCode extension project.
- Implement `FileSystemWatcher` and `TextDocument` event listeners.
- Implement a simple WebSocket client in the extension.

### Phase 2: The Backend (Aggregator)
- Create a Node.js WebSocket server.
- Implement a basic event ingestion endpoint.
- Implement simple SQLite persistence.

### Phase 3: The UI (Observer)
- Create a simple React-based Webview for the VSCode extension.
- Implement a real-time "Activity Feed" component.

### Phase 4: Refinement
- Add terminal command tracking.
- Implement diff visualization.
- Add security/redaction layer.