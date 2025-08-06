"use client";

import CenteredSpinner from "@/components/utils/CenteredSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="text-muted-foreground">
        Hello <strong>{user.name ?? user.email}</strong>! <br />
        Your role is:{" "}
        <span className="capitalize font-medium">{user.role}</span>
      </p>
    </div>
  );
}
