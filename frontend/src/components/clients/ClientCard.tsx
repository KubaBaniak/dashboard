import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type ClientCardProps = {
  name: string;
  email: string;
  footer: React.ReactNode;
};

export function ClientCard({ name, email, footer }: ClientCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow border bg-background rounded-2xl bg-gradient-to-t from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{name}</CardTitle>
        <CardDescription className="truncate">{email}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {footer}
      </CardContent>
    </Card>
  );
}
