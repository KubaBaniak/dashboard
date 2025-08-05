"use client";

import LoginForm from "@/components/forms/LoginForm";
import CenteredSpinner from "@/components/utils/CenteredSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [router, isLoading, user]);

  if (isLoading) return <CenteredSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w space-y-6">
        <h1 className="text-2xl font-bold text-center">Dashboard login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
