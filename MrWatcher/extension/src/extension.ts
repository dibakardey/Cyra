import * as vscode from 'vscode';
import { EventCollector } from './collector';
import { WebSocketClient } from './websocket-client';

/**
 * This extension tracks real-time AI agent activity.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Agent Tracker is now active!');

    let collector: EventCollector | undefined;
    let wsClient: WebSocketClient | undefined;

    let disposable = vscode.commands.registerCommand('agent-tracker.start', () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const agentId = 'poc-agent-01';
        const backendUrl = 'ws://localhost:8080'; // Default for PoC

        vscode.window.showInformationMessage(`Agent Tracker started! Monitoring: ${workspacePath}`);

        // Initialize WebSocket Client
        wsClient = new WebSocketClient(backendUrl);
        wsClient.connect();

        // Initialize Collector
        collector = new EventCollector(agentId, workspacePath);
        
        // Start collecting and pipe to WebSocket
        collector.start((event) => {
            wsClient?.sendEvent(event);
        });
    });

    let stopDisposable = vscode.commands.registerCommand('agent-tracker.stop', () => {
        if (wsClient) {
            wsClient.disconnect();
            wsClient = undefined;
        }
        if (collector) {
            collector = undefined;
        }
        vscode.window.showInformationMessage('Agent Tracker stopped.');
    });

    context.subscriptions.push(disposable, stopDisposable);
}

export function deactivate() {}
