import { PageHeader } from "@/components/layout/page-header";

type AuthPageShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthPageShell({ title, subtitle, children }: AuthPageShellProps) {
  return (
    <section className="relative mx-auto w-full max-w-lg">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 -top-8 bottom-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/8 via-background to-orange-500/5 sm:-inset-x-8"
      />
      <PageHeader title={title} subtitle={subtitle} />
      {children}
    </section>
  );
}
