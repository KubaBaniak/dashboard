import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type ClientOption = { id: number; email: string; name: string | null };

export function useClientOptions() {
  return useQuery<ClientOption[]>({
    queryKey: ["clientOptions"],
    queryFn: async () => {
      const res = await api.get("/clients/options", {
        withCredentials: true,
      });
      const payload = res.data;
      if (Array.isArray(payload)) return payload as ClientOption[];
      return (payload?.data ?? []) as ClientOption[];
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
