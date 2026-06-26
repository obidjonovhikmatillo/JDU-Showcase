import type { Role } from "@prisma/client";

import type { CommentAuthor, CommentImageRecord } from "@/lib/data/comment-types";

export type SerializedCommentRecord = {
  id: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  user: CommentAuthor;
  images: CommentImageRecord[];
};

export type CommentViewer = {
  id: string;
  role: Role;
};

export function serializeCommentForClient(comment: {
  id: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  user: CommentAuthor;
  images: CommentImageRecord[];
}): SerializedCommentRecord {
  return {
    id: comment.id,
    rating: comment.rating,
    title: comment.title,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    user: comment.user,
    images: comment.images,
  };
}
