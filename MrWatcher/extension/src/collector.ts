import * as vscode from 'vscode';
import { AgentEvent, EventType } from './types';

export class EventCollector {
    private agentId: string;
    private workspacePath: string;

    constructor(agentId: string, workspacePath: string) {
        this.agentId = agentId;
        this.workspacePath = workspacePath;
    }

    public start(onEvent: (event: AgentEvent) => void) {
        // 1. Track File System Changes
        vscode.workspace.onDidCreateFiles(e => {
            e.files.forEach(file => this.emitEvent(onEvent, EventType.FILE_MODIFICATION, {
                path: file.fsPath,
                action: 'create'
            }));
        });

        vscode.workspace.onDidDeleteFiles(e => {
            e.files.forEach(file => this.emitEvent(onEvent, EventType.FILE_MODIFICATION, {
                path: file.fsPath,
                action: 'delete'
            }));
        });

        vscode.workspace.onDidRenameFiles(e => {
            e.files.forEach(file => this.emitEvent(onEvent, EventType.FILE_MODIFICATION, {
                oldPath: file.oldUri.fsPath,
                newPath: file.newUri.fsPath,
                action: 'rename'
            }));
        });

        // 2. Track Editor Changes
        vscode.workspace.onDidChangeTextDocument(event => {
            const changes = event.contentChanges;
            if (changes.length > 0) {
                this.emitEvent(onEvent, EventType.EDITOR_CHANGE, {
                    path: event.document.uri.fsPath,
                    changes: changes.map(c => ({
                        range: c.range.toString(),
                        text: c.text
                    }))
                });
            }
        });
    }

    private emitEvent(callback: (event: AgentEvent) => void, type: EventType, payload: any) {
        const event: AgentEvent = {
            timestamp: new Date().toISOString(),
            agentId: this.agentId,
            type: type,
            payload: payload,
            metadata: {
                editor: 'vscode-insiders',
                workspace: this.workspacePath
            }
        };
        callback(event);
    }
}