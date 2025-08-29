"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import CenteredSpinner from "@/components/utils/CenteredSpinner";

import { SiteHeader } from "@/components/ui/site-header";
import ClientsTable from "@/components/clients/ClientsTable";

export default function ClientsPage() {
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
      <SiteHeader user={user} />
      <div className="flex-1 flex flex-col px-4 lg:px-6 py-6">
        <div className="@container/main w-full max-w-screen-2xl mx-auto space-y-6">
          <ClientsTable />
        </div>
      </div>
    </>
  );
}
