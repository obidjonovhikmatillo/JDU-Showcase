import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminStatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function AdminStatCard({ label, value, hint }: AdminStatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="truncate text-base/7 font-medium text-muted-foreground sm:text-sm/6">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-2xl">{value}</p>
        {hint ? (
          <p className="mt-1 text-base/7 text-muted-foreground sm:text-xs/5">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
