export interface PullRequest {
  id: string;
  title: string;
  url: string;
  author: string;
  state: 'open' | 'closed' | 'merged';
  repository: string;
}

export interface ReviewComment {
  id: string;
  prId: string;
  author: string;
  body: string;
  path: string;
  line?: number;
  isResolved: boolean;
}
