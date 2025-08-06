import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type User = {
  id: string | number;
  email: string;
  role: string;
  name?: string;
};

function getInitials(nameOrEmail: string) {
  const parts = nameOrEmail.split(" ");
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return nameOrEmail.slice(0, 2).toUpperCase();
}

export function UserInfoBox({ user }: { user: User }) {
  const displayName = user.name ?? user.email;
  const initials = getInitials(displayName);

  return (
    <div className="p-4 bg-muted/10 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold leading-none">
          Welcome to the dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 rounded-lg bg-muted flex justify-center items-center">
          <AvatarImage src="" alt={displayName} />
          <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="grid text-sm leading-tight">
          <span className="font-medium">{displayName}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
      </div>
    </div>
  );
}
