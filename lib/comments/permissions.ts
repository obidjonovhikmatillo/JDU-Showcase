import type { Role } from "@prisma/client";

export type CommentActor = {
  id: string;
  role: Role;
};

export function canManageComment(
  actor: CommentActor | null | undefined,
  commentAuthorId: string,
): boolean {
  if (!actor?.id) {
    return false;
  }

  return actor.role === "ADMIN" || actor.id === commentAuthorId;
}
