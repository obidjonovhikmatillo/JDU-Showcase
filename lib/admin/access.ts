type AdminUser = {
  id?: string;
  role?: string;
};

export function canAccessAdmin(user: AdminUser | null | undefined): boolean {
  return user?.role === "ADMIN";
}

export function canDeactivateUser(
  actorId: string,
  targetUserId: string,
  isActive: boolean,
): boolean {
  if (actorId === targetUserId && !isActive) {
    return false;
  }

  return true;
}

export function canChangeUserRole(
  actorId: string,
  targetUserId: string,
  nextRole: string,
): boolean {
  if (actorId === targetUserId && nextRole !== "ADMIN") {
    return false;
  }

  return true;
}
