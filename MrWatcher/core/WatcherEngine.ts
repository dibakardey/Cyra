import { BaseProvider } from './providers/base';
import { PullRequest, ReviewComment } from '../models/types';
import { TelemetryService } from './services/telemetryService';

export interface WatcherConfig {
  provider: BaseProvider;
  repository: string;
  pollIntervalMs: number;
  telemetryEndpoint: string;
}

export interface WatcherEvent {
  type: 'COMMENT_DETECTED' | 'COMMENT_RESOLVED' | 'ERROR';
  payload: any;
}

export class WatcherEngine {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private telemetry: TelemetryService;

  constructor(private config: WatcherConfig) {
    this.telemetry = new TelemetryService(config.telemetryEndpoint);
  }

  async start(onEvent: (event: WatcherEvent) => void): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[WatcherEngine] Starting watcher for ${this.config.repository} using ${this.config.provider.name}`);

    this.intervalId = setInterval(async () => {
      try {
        await this.poll(onEvent);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[WatcherEngine] Error: ${errorMsg}`);
        onEvent({
          type: 'ERROR',
          payload: errorMsg
        });
      }
    }, this.config.pollIntervalMs);
  }

  async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[WatcherEngine] Watcher stopped.');
  }

  private async poll(onEvent: (event: WatcherEvent) => void): Promise<void> {
    const prs = await this.config.provider.getPullRequests(this.config.repository);
    
    for (const pr of prs) {
      const comments = await this.config.provider.getComments(this.config.repository, pr.id);
      for (const comment of comments) {
        if (!comment.isResolved) {
          console.log(`[WatcherEngine] New comment detected on PR #${pr.id}`);
          
          // Send telemetry to your dashboard
          await this.telemetry.sendEvent('COMMENT_DETECTED', {
            prId: pr.id,
            author: comment.author,
            path: comment.path
          });

          onEvent({
            type: 'COMMENT_DETECTED',
            payload: { pr, comment }
          });
        }
      }
    }
  }
}
