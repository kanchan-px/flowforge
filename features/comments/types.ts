export interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  author: { id: string; name: string } | null;
}