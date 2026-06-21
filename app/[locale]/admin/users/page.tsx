import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { UserAdminActions } from "@/components/admin/user-admin-actions";
import { PageHeader } from "@/components/layout/page-shell";
import { requireAdmin } from "@/lib/auth/guards";
import { listAdminUsersPaginated } from "@/lib/data/admin-users.server";
import { parseOptionalInt, parseSearchParam } from "@/lib/admin/pagination";
import { Card, CardContent } from "@/components/ui/card";

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AdminUsers");
  return { title: t("title") };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const session = await requireAdmin();
  const params = await searchParams;
  const q = parseSearchParam(params.q);
  const roleParam = parseSearchParam(params.role);
  const role = roleParam === "USER" || roleParam === "ADMIN" ? roleParam : undefined;
  const activeParam = parseSearchParam(params.active) ?? "all";
  const active =
    activeParam === "active" || activeParam === "inactive" ? activeParam : "all";
  const page = parseOptionalInt(params.page) ?? 1;

  const [result, t, tRoles, tCommon] = await Promise.all([
    listAdminUsersPaginated({ q, page, role, active }),
    getTranslations("AdminUsers"),
    getTranslations("Roles"),
    getTranslations("AdminCommon"),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <AdminSearchBar
        action="/admin/users"
        searchLabel={t("searchLabel")}
        searchPlaceholder={t("searchPlaceholder")}
        submitLabel={tCommon("applyFilters")}
        defaultQuery={q}
        filters={[
          {
            name: "role",
            label: t("roleFilter"),
            defaultValue: roleParam ?? "all",
            options: [
              { value: "all", label: t("allRoles") },
              { value: "USER", label: tRoles("USER") },
              { value: "ADMIN", label: tRoles("ADMIN") },
            ],
          },
          {
            name: "active",
            label: t("statusFilter"),
            defaultValue: activeParam,
            options: [
              { value: "all", label: t("allStatuses") },
              { value: "active", label: t("active") },
              { value: "inactive", label: t("inactive") },
            ],
          },
        ]}
      />

      {result.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="space-y-3">
          {result.items.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex flex-col gap-3 pt-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("meta", {
                      role: tRoles(user.role),
                      status: user.isActive ? t("active") : t("inactive"),
                      reviews: user._count.reviews,
                    })}
                  </p>
                </div>
                <UserAdminActions user={user} currentUserId={session.user.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminPagination
        page={result.page}
        totalPages={result.totalPages}
        basePath="/admin/users"
        searchParams={{
          q,
          role,
          active: active !== "all" ? active : undefined,
        }}
      />
    </section>
  );
}
