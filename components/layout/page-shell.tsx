import { SiteShell } from "@/components/layout/site-shell";

export { PageHeader, PlaceholderCard } from "@/components/layout/page-header";

export function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
