/** Apply client/server session update payloads onto a JWT token. */
export function applySessionUpdate(
  token: Record<string, unknown>,
  session: unknown,
) {
  if (!session || typeof session !== "object") {
    return;
  }

  const payload = session as Record<string, unknown>;
  const patch =
    payload.user && typeof payload.user === "object"
      ? (payload.user as Record<string, unknown>)
      : payload;

  if (typeof patch.fullName === "string") {
    token.fullName = patch.fullName;
    token.name = patch.fullName;
  } else if (typeof patch.name === "string") {
    token.fullName = patch.name;
    token.name = patch.name;
  }

  if (typeof patch.preferredLanguage === "string") {
    token.preferredLanguage = patch.preferredLanguage;
  }

  if ("avatarUrl" in patch) {
    token.avatarUrl = patch.avatarUrl ?? null;
  }

  if ("profileHeadline" in patch) {
    token.profileHeadline = patch.profileHeadline ?? null;
  }
}
