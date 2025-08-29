"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathName = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathName === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} passHref>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 rounded-md transition-colors cursor-pointer",
                      isActive
                        ? "bg-muted text-primary font-semibold shadow-sm"
                        : "text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={clsx(
                          "h-5 w-5",
                          isActive ? "text-primary" : "text-muted",
                        )}
                      />
                    )}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
