import { BaseProvider } from './base';
import { PullRequest } from '../models/types';

/**
 * Azure DevOps Provider implementation.
 * Currently in MOCK mode.
 */
export class AzureDevOpsProvider extends BaseProvider {
  readonly name = 'Azure DevOps';
  readonly platform: 'azure-devops' = 'azure-devops';

  constructor(private token?: string) {
    super();
  }

  async getPullRequests(repo: string): Promise<PullRequest[]> {
    console.log(`[AzureDevOpsProvider] Fetching PRs for ${repo}...`);
    return [];
  }

  async getComments(repo: string, prId: string): Promise<any[]> {
    console.log(`[AzureDevOpsProvider] Fetching comments for PR #${prId}...`);
    return [];
  }

  async resolveComment(repo: string, prId: string, commentId: string): Promise<void> {
    console.log(`[AzureDevOpsProvider] Resolving comment ${commentId}...`);
  }
}
