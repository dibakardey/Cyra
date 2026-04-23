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
exports.EventCollector = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("./types");
class EventCollector {
    constructor(agentId, workspacePath) {
        this.agentId = agentId;
        this.workspacePath = workspacePath;
    }
    start(onEvent) {
        // 1. Track File System Changes
        vscode.workspace.onDidCreateFiles(e => {
            e.files.forEach(file => this.emitEvent(onEvent, types_1.EventType.FILE_MODIFICATION, {
                path: file.fsPath,
                action: 'create'
            }));
        });
        vscode.workspace.onDidDeleteFiles(e => {
            e.files.forEach(file => this.emitEvent(onEvent, types_1.EventType.FILE_MODIFICATION, {
                path: file.fsPath,
                action: 'delete'
            }));
        });
        vscode.workspace.onDidRenameFiles(e => {
            e.files.forEach(file => this.emitEvent(onEvent, types_1.EventType.FILE_MODIFICATION, {
                oldPath: file.oldUri.fsPath,
                newPath: file.newUri.fsPath,
                action: 'rename'
            }));
        });
        // 2. Track Editor Changes
        vscode.workspace.onDidChangeTextDocument(event => {
            const changes = event.contentChanges;
            if (changes.length > 0) {
                this.emitEvent(onEvent, types_1.EventType.EDITOR_CHANGE, {
                    path: event.document.uri.fsPath,
                    changes: changes.map(c => ({
                        range: c.range.toString(),
                        text: c.text
                    }))
                });
            }
        });
    }
    emitEvent(callback, type, payload) {
        const event = {
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
exports.EventCollector = EventCollector;
