"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import CenteredSpinner from "@/components/utils/CenteredSpinner";

import { SiteHeader } from "@/components/ui/site-header";
import CategoriesTable from "@/components/categories/CategoriesTable";

export default function CategoriesPage() {
  const router = useRouter();

  const { data: user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <CenteredSpinner />;
  }

  return (
    <>
      <SiteHeader user={user} />
      <div className="flex-1 flex flex-col px-4 lg:px-6 py-6">
        <div className="@container/main w-full max-w-screen-2xl mx-auto space-y-6">
          <CategoriesTable />
        </div>
      </div>
    </>
  );
}
