import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  change: string;
  direction: "up" | "down";
  footerMainText: string;
  footerSubText: string;
};

export function StatCard({
  title,
  value,
  change,
  direction,
  footerMainText,
  footerSubText,
}: StatCardProps) {
  const Icon = direction === "up" ? IconTrendingUp : IconTrendingDown;
  const isUp = direction === "up";

  const badgeClasses = isUp
    ? "bg-green-100 text-green-700 border-green-300"
    : "bg-red-100 text-red-700 border-red-300";

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col space-y-1">
        <CardDescription>{title}</CardDescription>

        <CardTitle className="break-words leading-tight text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>

        <div className="flex w-full">
          <CardAction className="mt-1 ml-0">
            <Badge
              variant="outline"
              className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap px-2 py-0.5 text-xs @[250px]/card:text-sm",
                badgeClasses,
              )}
            >
              <Icon className="size-4" />
              {change}
            </Badge>
          </CardAction>
        </div>
      </CardHeader>

      <CardFooter
        className={cn(
          "flex-col items-start gap-1.5 text-sm",
          isUp ? "text-green-700" : "text-red-700",
        )}
      >
        <div className="flex flex-wrap items-center gap-1 font-medium">
          {footerMainText}
          <Icon className="size-4" />
        </div>
        <div className="text-muted-foreground">{footerSubText}</div>
      </CardFooter>
    </Card>
  );
}
