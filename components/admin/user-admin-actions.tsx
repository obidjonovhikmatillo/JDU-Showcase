"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateUserActiveStatus, updateUserRole } from "@/lib/actions/admin-user";

type UserItem = {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  _count: { reviews: number };
};

type UserAdminActionsProps = {
  user: UserItem;
  currentUserId: string;
};

export function UserAdminActions({ user, currentUserId }: UserAdminActionsProps) {
  const router = useRouter();
  const t = useTranslations("AdminUsers");
  const tToast = useTranslations("Toast");
  const isSelf = user.id === currentUserId;

  async function toggleActive() {
    const formData = new FormData();
    formData.set("userId", user.id);
    formData.set("isActive", String(!user.isActive));
    const result = await updateUserActiveStatus(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(user.isActive ? tToast("userDeactivated") : tToast("userActivated"));
    router.refresh();
  }

  async function toggleRole() {
    const formData = new FormData();
    formData.set("userId", user.id);
    formData.set("role", user.role === "ADMIN" ? "USER" : "ADMIN");
    const result = await updateUserRole(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(tToast("userRoleUpdated"));
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isSelf && user.isActive}
        onClick={() => void toggleActive()}
      >
        {user.isActive ? t("deactivate") : t("activate")}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isSelf}
        onClick={() => void toggleRole()}
      >
        {user.role === "ADMIN" ? t("makeUser") : t("makeAdmin")}
      </Button>
    </div>
  );
}
