"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !data) {
      router.push("/auth/login");
    }
  }, [router, isLoading, data]);

  if (isLoading) return <p>Ładowanie...</p>;

  return (
    <div>
      Witaj użytkowniku #{data?.id} ({data?.role})!
    </div>
  );
}
