import type { Role } from "@prisma/client";

import { CommentListClient } from "@/components/comments/comment-list-client";
import type { CommentRecord } from "@/lib/data/comment-types";
import { serializeCommentForClient } from "@/lib/comments/comment-serialization";

type CommentListProps = {
  comments: CommentRecord[];
  projectSlug: string;
  viewer: { id: string; role: Role } | null;
};

export function CommentList({ comments, projectSlug, viewer }: CommentListProps) {
  const serializedComments = comments.map(serializeCommentForClient);

  return (
    <CommentListClient
      comments={serializedComments}
      projectSlug={projectSlug}
      viewer={viewer}
    />
  );
}
