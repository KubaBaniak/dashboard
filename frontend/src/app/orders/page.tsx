"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import CenteredSpinner from "@/components/utils/CenteredSpinner";

import { SiteHeader } from "@/components/ui/site-header";
import { SectionCards } from "@/components/dashboard/SectionCards";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { ClientSummaryCards } from "@/components/dashboard/ClientSummaryCards";

export default function DashboardPage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return <CenteredSpinner />;

  return (
    <>
      <SiteHeader user={user} />
      <div className="flex-1 flex flex-col px-4 lg:px-6 py-6">
        <div className="@container/main w-full max-w-screen-2xl mx-auto space-y-6">
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
