export abstract class BaseProvider {
  abstract readonly name: string;
  abstract readonly platform: 'github' | 'azure-devops';

  abstract getPullRequests(repo: string): Promise<PullRequest[]>;
  abstract getComments(repo: string, prId: string): Promise<ReviewComment[]>;
  abstract resolveComment(repo: string, prId: string, commentId: string): Promise<void>;
}
