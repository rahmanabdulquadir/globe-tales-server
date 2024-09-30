export interface IPost {
  title: string;
  content: string;
  images: string[];
  categories: string;
  isPremium: boolean;
  user: string;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
}