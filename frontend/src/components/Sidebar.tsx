"use client";

import * as React from "react";
import {
  IconDashboard,
  IconShoppingCart,
  IconUsers,
  IconPackage,
  IconCategory,
  IconTruckDelivery,
  IconInnerShadowTop,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavUser } from "./ui/nav-user";
import { NavMain } from "./ui/nav-main";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: IconShoppingCart,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: IconUsers,
    },
    {
      title: "Products",
      url: "/products",
      icon: IconPackage,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: IconCategory,
    },
    {
      title: "Deliveries",
      url: "/deliveries",
      icon: IconTruckDelivery,
    },
    // Only for admin users later TODO
    //{
    //  title: "Users",
    //  url: "/users",
    //  icon: IconUsers,
    //  adminOnly: true,
    //},
  ],
};

export function AppSidebar({
  userRole = "USER",
  ...props
}: React.ComponentProps<typeof Sidebar> & { userRole?: "ADMIN" | "USER" }) {
  const navMainFiltered = data.navMain.filter(
    (item) => !item.adminOnly || userRole === "ADMIN",
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Sales Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainFiltered} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={data.user.avatar} alt={data.user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{data.user.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {data.user.email}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
