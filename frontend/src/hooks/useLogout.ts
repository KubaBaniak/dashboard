"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout", null, { withCredentials: true });
    },
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["auth", "me"] });

      router.push("/auth/login");
      router.refresh();
    },
    onError: () => {
      qc.removeQueries({ queryKey: ["auth", "me"] });
      router.push("/auth/login");
      router.refresh();
    },
  });
}
