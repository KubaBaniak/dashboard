"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import CenteredSpinner from "@/components/utils/CenteredSpinner";

import { SiteHeader } from "@/components/ui/site-header";
import OrdersTable from "@/components/orders/OrdersTable";

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
          <OrdersTable />
        </div>
      </div>
    </>
  );
}
