"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const collector_1 = require("./collector");
const websocket_client_1 = require("./websocket-client");
/**
 * This extension tracks real-time AI agent activity.
 */
function activate(context) {
    console.log('Agent Tracker is now active!');
    let collector;
    let wsClient;
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
        wsClient = new websocket_client_1.WebSocketClient(backendUrl);
        wsClient.connect();
        // Initialize Collector
        collector = new collector_1.EventCollector(agentId, workspacePath);
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
function deactivate() { }
