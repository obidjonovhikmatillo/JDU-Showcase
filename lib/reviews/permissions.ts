import type { Role } from "@prisma/client";

export type ReviewActor = {
  id: string;
  role: Role;
};

export function canManageReview(
  actor: ReviewActor | null | undefined,
  reviewAuthorId: string,
): boolean {
  if (!actor?.id) {
    return false;
  }

  return actor.role === "ADMIN" || actor.id === reviewAuthorId;
}
