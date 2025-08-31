"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import CenteredSpinner from "@/components/utils/CenteredSpinner";

import { SiteHeader } from "@/components/ui/site-header";
import { SectionCards } from "@/components/dashboard/SectionCards";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { ClientSummaryCards } from "@/components/dashboard/ClientSummaryCards";

export default function DashboardPage() {
  const { data: user, isLoading, status, isError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);
  const toastShownRef = useRef(false);

  console.log(user, isLoading, status, isError);

  useEffect(() => {
    if ((status === "success" && !user) || isError) {
      setRedirecting(true);
      router.replace("/auth/login");
    }
  }, [status, user, isError, router]);

  useEffect(() => {
    const loginSuccess = searchParams.get("loginSuccess");
    console.log("login success ", loginSuccess);
    if (loginSuccess === "true" && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.success("Successfully logged in");

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("loginSuccess");
      const newPath = `/dashboard${newParams.toString() ? `?${newParams.toString()}` : ""}`;
      router.replace(newPath);
    }
  }, [searchParams, router]);

  if (isLoading || redirecting) return <CenteredSpinner />;

  return (
    <>
      <SiteHeader user={user!} />
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
