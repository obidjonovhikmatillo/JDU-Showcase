import { cn } from "@/lib/utils";

type TaomchiIconProps = {
  className?: string;
};

export function TaomchiIcon({ className }: TaomchiIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8 shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M16 6.5c2.8 0 5 2.1 5 4.7 0 .8-.2 1.5-.5 2.2.7.5 1.2 1.3 1.2 2.3v1.2c0 1.4-1.1 2.5-2.5 2.5h-6.4c-1.4 0-2.5-1.1-2.5-2.5v-1.2c0-1 .5-1.8 1.2-2.3-.3-.7-.5-1.4-.5-2.2 0-2.6 2.2-4.7 5-4.7Z"
        className="fill-primary-foreground"
      />
      <path
        d="M12.5 8.5c.4-.8 1.1-1.3 2-1.3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="stroke-primary/40"
      />
      <path
        d="M19.5 8.5c-.4-.8-1.1-1.3-2-1.3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="stroke-primary/40"
      />
      <ellipse
        cx="16"
        cy="21.5"
        rx="7.5"
        ry="2.2"
        className="fill-primary-foreground/90"
      />
      <path
        d="M11.5 19.5c1.2 1.4 2.8 2.1 4.5 2.1s3.3-.7 4.5-2.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="stroke-primary/30"
      />
      <path
        d="M13.5 5.5c.3.8-.1 1.6-.9 1.9"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="stroke-primary-foreground/80"
      />
      <path
        d="M16 4.8V6.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="stroke-primary-foreground/80"
      />
      <path
        d="M18.5 5.5c-.3.8.1 1.6.9 1.9"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="stroke-primary-foreground/80"
      />
    </svg>
  );
}
