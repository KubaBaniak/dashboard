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
    // Only for admin users
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
      adminOnly: true,
    },
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
