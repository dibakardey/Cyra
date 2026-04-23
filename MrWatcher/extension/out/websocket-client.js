"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = void 0;
const ws_1 = __importDefault(require("ws"));
class WebSocketClient {
    constructor(url) {
        this.ws = null;
        this.url = url;
    }
    connect() {
        this.ws = new ws_1.default(this.url);
        this.ws.on('open', () => {
            console.log('Connected to Agent Tracker Backend');
        });
        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
        this.ws.on('close', () => {
            console.log('WebSocket connection closed. Retrying in 5s...');
            setTimeout(() => this.connect(), 5000);
        });
    }
    sendEvent(event) {
        if (this.ws && this.ws.readyState === ws_1.default.OPEN) {
            this.ws.send(JSON.stringify(event));
        }
        else {
            console.warn('WebSocket is not open. Event dropped:', event.type);
        }
    }
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}
exports.WebSocketClient = WebSocketClient;
