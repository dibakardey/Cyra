/**
 * Telemetry Service
 * Handles real-time event streaming to the Agent Tracker backend via WebSockets
 */

import { Event } from '../types/index';

class TelemetryService {
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:8080/ws';
  private eventQueue: Event[] = [];
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;

  /**
   * Sends an event to the telemetry backend.
   * If the connection is not active, the event is queued.
   */
  public async sendEvent(event: Event): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.transmit(event);
    } else {
      this.eventQueue.push(event);
      this.connect();
    }
  }

  /**
   * Establishes WebSocket connection with reconnection logic
   */
  private connect(): void {
    if (this.isConnecting || (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING))) {
      return;
    }

    this.isConnecting = true;
    console.log('[TelemetryService] Connecting to', this.url);

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[TelemetryService] Connected to telemetry backend');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.flushQueue();
      };

      this.ws.onmessage = (message) => {
        console.log('[TelemetryService] Message received:', message.data);
      };

      this.ws.onerror = (error) => {
        console.error('[TelemetryService] WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('[TelemetryService] WebSocket connection closed');
        this.isConnecting = false;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[TelemetryService] Failed to initiate connection:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  /**
   * Attempts to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`[TelemetryService] Reconnecting in ${delay}ms (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('[TelemetryService] Max reconnection attempts reached');
    }
  }

  /**
   * Transmits a single event through the socket
   */
  private transmit(event: Event): void {
    try {
      const message = JSON.stringify({
        type: event.type,
        payload: event,
      });
      this.ws?.send(message);
    } catch (error) {
      console.error('[TelemetryService] Failed to transmit event:', error);
    }
  }

  /**
   * Sends all queued events once connection is established
   */
  private flushQueue(): void {
    console.log(`[TelemetryService] Flushing ${this.eventQueue.length} queued events`);
    while (this.eventQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const event = this.eventQueue.shift();
      if (event) {
        this.transmit(event);
      }
    }
  }
}

export const telemetryService = new TelemetryService();