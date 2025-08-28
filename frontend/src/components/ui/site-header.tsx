"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useLogout } from "@/hooks/useLogout";

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

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "Dashboard";

  return lastSegment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function SiteHeader({ user }: { user: User }) {
  const pathname = usePathname();
  const logout = useLogout();
  const pageTitle = getPageTitle(pathname);

  const displayName = user.name ?? user.email;
  const initials = getInitials(displayName);

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 pb-4 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{pageTitle}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 cursor-pointer rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40">
              <Avatar className="h-9 w-9 rounded-lg bg-muted flex justify-center items-center">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid text-sm leading-tight text-left">
                <span className="font-medium">{displayName}</span>
                <span className="text-muted-foreground text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                logout.mutate();
              }}
              disabled={logout.isPending}
            >
              <IconLogout className="mr-2 h-4 w-4" />
              {logout.isPending ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
