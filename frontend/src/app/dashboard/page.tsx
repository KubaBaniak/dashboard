"use client";

import CenteredSpinner from "@/components/utils/CenteredSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !data) {
      router.push("/auth/login");
    }
  }, [router, isLoading, data]);

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

  if (isLoading) return <CenteredSpinner />;

  return (
    <div>
      Welcome, user #{data?.id} ({data?.role})!
    </div>
  );
}
