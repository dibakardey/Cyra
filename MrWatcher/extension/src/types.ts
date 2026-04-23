export enum EventType {
    FILE_MODIFICATION = 'FILE_MODIFICATION',
    EDITOR_CHANGE = 'EDITOR_CHANGE',
    TERMINAL_COMMAND = 'TERMINAL_COMMAND',
    AGENT_INTENT = 'AGENT_INTENT',
    TOOL_USAGE = 'TOOL_USAGE'
}

export interface AgentEvent {
    timestamp: string;
    agentId: string;
    type: EventType;
    payload: any;
    metadata: {
        editor: string;
        workspace: string;
    };
}