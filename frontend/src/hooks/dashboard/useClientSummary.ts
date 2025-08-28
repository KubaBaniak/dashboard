"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type LatestClient = {
  id: number;
  email: string;
  name?: string | null;
  createdAt: string;
};

export type TopClient = {
  id: number;
  email: string;
  name?: string | null;
  totalSpent: number;
};

export function useLatestClients(limit = 6) {
  return useQuery<LatestClient[]>({
    queryKey: ["clients", "latest", limit],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<LatestClient[]>("/clients/latest", {
        params: { limit },
        withCredentials: true,
        signal,
      });
      return data;
    },
    staleTime: 30_000,
  });
}

export function useTopClients(limit = 6) {
  return useQuery<TopClient[]>({
    queryKey: ["clients", "top", limit],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<TopClient[]>("/clients/top", {
        params: { limit },
        withCredentials: true,
        signal,
      });
      return data;
    },
    staleTime: 30_000,
  });
}
