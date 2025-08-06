"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "../Sidebar";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

const HIDE_SIDEBAR_ROUTES = ["/auth/login", "/auth/register"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: user, isLoading } = useAuth();

  const isHiddenRoute = HIDE_SIDEBAR_ROUTES.includes(pathname);
  const isLoggedIn = !!user;
  const userRole = user?.role === "ADMIN" ? "ADMIN" : "USER";

  if (isLoading) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="flex">
      {isLoggedIn && !isHiddenRoute && <AppSidebar userRole={userRole} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
