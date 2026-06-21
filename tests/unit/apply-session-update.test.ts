import { describe, expect, it } from "vitest";

import { applySessionUpdate } from "@/lib/auth/apply-session-update";

describe("applySessionUpdate", () => {
  it("updates fullName and name from a flat payload", () => {
    const token: Record<string, unknown> = { fullName: "Old Name", name: "Old Name" };

    applySessionUpdate(token, {
      fullName: "New Name",
      profileHeadline: "Designer",
    });

    expect(token.fullName).toBe("New Name");
    expect(token.name).toBe("New Name");
    expect(token.profileHeadline).toBe("Designer");
  });

  it("updates fields from a nested user payload", () => {
    const token: Record<string, unknown> = {};

    applySessionUpdate(token, {
      user: {
        fullName: "Nested Name",
        avatarUrl: null,
      },
    });

    expect(token.fullName).toBe("Nested Name");
    expect(token.name).toBe("Nested Name");
    expect(token.avatarUrl).toBeNull();
  });
});
