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
    return (
      <main className="min-h-screen flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {isLoggedIn && !isHiddenRoute && <AppSidebar userRole={userRole} />}

      <main className="flex-1 p-6 max-w-8xl mx-auto w-full">{children}</main>
    </div>
  );
}
