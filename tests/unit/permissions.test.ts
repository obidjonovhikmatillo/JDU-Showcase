import { describe, expect, it } from "vitest";

import { canAccessAdmin, canChangeUserRole, canDeactivateUser } from "@/lib/admin/access";
import { canManageComment } from "@/lib/comments/permissions";

describe("T005 admin access rules", () => {
  it("allows only admins into the admin area", () => {
    expect(canAccessAdmin({ role: "ADMIN" })).toBe(true);
    expect(canAccessAdmin({ role: "USER" })).toBe(false);
    expect(canAccessAdmin(null)).toBe(false);
  });

  it("prevents admins from deactivating or demoting themselves", () => {
    expect(canDeactivateUser("admin-1", "admin-1", false)).toBe(false);
    expect(canChangeUserRole("admin-1", "admin-1", "USER")).toBe(false);
  });
});

describe("T013 comment permission rules", () => {
  it("allows owners and admins to manage comments", () => {
    expect(canManageComment({ id: "user-1", role: "USER" }, "user-1")).toBe(true);
    expect(canManageComment({ id: "admin-1", role: "ADMIN" }, "user-2")).toBe(true);
  });

  it("blocks other users from managing someone else's comment", () => {
    expect(canManageComment({ id: "user-2", role: "USER" }, "user-1")).toBe(false);
    expect(canManageComment(null, "user-1")).toBe(false);
  });
});
