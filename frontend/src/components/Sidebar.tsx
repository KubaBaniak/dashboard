"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./ui/nav-main";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/useAuth";

import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Tags,
  Truck,
  PanelsTopLeft,
  LucideIcon,
} from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Deliveries", url: "/deliveries", icon: Truck },
  // { title: "Users", url: "/users", icon: Users, adminOnly: true },
];

function getInitials(text: string) {
  const trimmed = text.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return trimmed.slice(0, 2).toUpperCase();
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: user, isLoading } = useAuth();
  const role: "ADMIN" | "USER" = user?.role === "ADMIN" ? "ADMIN" : "USER";

  const items = React.useMemo(
    () => NAV_ITEMS.filter((i) => !i.adminOnly || role === "ADMIN"),
    [role],
  );

  const displayName =
    user?.name || user?.email || (isLoading ? "Loading…" : "—");
  const email = user?.email || "";
  const initials = getInitials(displayName);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <PanelsTopLeft className="!size-5" />
                <span className="text-base font-semibold">Sales Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={undefined} alt={displayName} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{displayName}</span>
            {email ? (
              <span className="text-muted-foreground truncate text-xs">
                {email}
              </span>
            ) : null}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
