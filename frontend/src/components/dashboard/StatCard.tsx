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
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className={cn("flex items-center gap-1", badgeClasses)}
          >
            <Icon className="size-4" />
            {change}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter
        className={cn(
          "flex-col items-start gap-1.5 text-sm",
          isUp ? "text-green-700" : "text-red-700",
        )}
      >
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerMainText}
          <Icon className="size-4" />
        </div>
        <div className="text-muted-foreground">{footerSubText}</div>
      </CardFooter>
    </Card>
  );
}
