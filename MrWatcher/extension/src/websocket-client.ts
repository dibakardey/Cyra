import { AgentEvent } from './types';
import WebSocket from 'ws';

export class WebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public connect() {
        this.ws = new WebSocket(this.url);

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

    public sendEvent(event: AgentEvent) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(event));
        } else {
            console.warn('WebSocket is not open. Event dropped:', event.type);
        }
    }

    public disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}
