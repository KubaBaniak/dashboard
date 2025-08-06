"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import CenteredSpinner from "@/components/utils/CenteredSpinner";

import { SiteHeader } from "@/components/ui/site-header";
import { SectionCards } from "@/components/dashboard/SectionCards";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { ClientSummaryCards } from "@/components/dashboard/ClientSummaryCards";

export default function DashboardPage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const loginSuccess = searchParams.get("loginSuccess");

    if (loginSuccess === "true") {
      toast.success("Successfully logged in");

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("loginSuccess");

      const newPath = `/dashboard${
        newParams.toString() ? `?${newParams.toString()}` : ""
      }`;

      router.replace(newPath);
    }
  }, [searchParams, router]);

  if (isLoading || !user) return <CenteredSpinner />;

  return (
    <>
      <SiteHeader />
      <div className="flex-1 flex flex-col px-4 lg:px-6 py-6">
        <div className="@container/main w-full max-w-screen-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
            <p className="text-muted-foreground">
              Hello <strong>{user.name ?? user.email}</strong>! <br />
              Your role is:{" "}
              <span className="capitalize font-medium">{user.role}</span>
            </p>
          </div>

          <SectionCards />

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/2">
              <RecentOrdersTable />
            </div>
            <div className="w-full lg:w-1/2">
              <ClientSummaryCards />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
