import { BaseProvider } from './base';
import { PullRequest, ReviewComment } from '../models/types';

/**
 * GitHub Provider implementation.
 * Currently in MOCK mode to allow development without a PAT.
 */
export class GitHubProvider extends BaseProvider {
  readonly name = 'GitHub';
  readonly platform: 'github' = 'github';

  constructor(private token?: string) {
    super();
  }

  async getPullRequests(repo: string): Promise<PullRequest[]> {
    console.log(`[GitHubProvider] Fetching PRs for ${repo}...`);
    
    // MOCK DATA
    return [
      {
        id: '1',
        title: 'Restructure project: move app to AppCyra',
        url: 'https://github.com/dibakardey/Cyra/pull/1',
        author: 'dibakardey',
        state: 'open',
        repository: repo,
      }
    ];
  }

  async getComments(repo: string, prId: string): Promise<ReviewComment[]> {
    console.log(`[GitHubProvider] Fetching comments for PR #${prId} in ${repo}...`);
    
    // MOCK DATA
    return [
      {
        id: 'c1',
        prId: prId,
        author: 'coderabbitai',
        body: 'Please ensure all types are strictly defined.',
        path: 'AppCyra/core/types/index.ts',
        line: 10,
        isResolved: false,
      }
    ];
  }

  async resolveComment(repo: string, prId: string, commentId: string): Promise<void> {
    console.log(`[GitHubProvider] Resolving comment ${commentId} on PR #${prId}...`);
    // Mock resolution
  }
}
