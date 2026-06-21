type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <header className="mb-8 space-y-3 sm:mb-10">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-2xl text-base/7 text-muted-foreground sm:text-lg/8">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

type PlaceholderCardProps = {
  children: React.ReactNode;
};

export function PlaceholderCard({ children }: PlaceholderCardProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-base/7 text-muted-foreground sm:p-8 sm:text-sm/6">
      {children}
    </div>
  );
}
