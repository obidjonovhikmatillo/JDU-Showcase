import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "error";
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border px-6 py-12 text-center sm:px-8 sm:py-14",
        variant === "error"
          ? "border-destructive/30 bg-destructive/5"
          : "border-dashed border-border bg-muted/20",
        className,
      )}
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        {icon ? (
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full",
              variant === "error"
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary",
            )}
          >
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="text-base/7 text-muted-foreground sm:text-sm/6">{description}</p>
          ) : null}
        </div>
        {action ? <div className="pt-1">{action}</div> : null}
      </div>
    </section>
  );
}
