import { cn } from "@/lib/utils";

type ShowcaseIconProps = {
  className?: string;
};

export function ShowcaseIcon({ className }: ShowcaseIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8 shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <rect x="7" y="8" width="18" height="13" rx="2" className="fill-primary-foreground" />
      <rect x="9" y="10" width="14" height="9" rx="1" className="fill-primary/30" />
      <path d="M12 23h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="stroke-primary-foreground" />
      <path d="M14 21v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="stroke-primary-foreground/80" />
      <path d="M18 21v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="stroke-primary-foreground/80" />
      <path d="M12 13l2.5 2.5L19 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-foreground" />
    </svg>
  );
}
