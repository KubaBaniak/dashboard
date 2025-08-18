"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useUrlPagination(defaults = { page: 1, pageSize: 10, q: "" }) {
  const router = useRouter();
  const sp = useSearchParams();
  const page = Number(sp.get("page") ?? defaults.page);
  const pageSize = Number(sp.get("pageSize") ?? defaults.pageSize);
  const q = sp.get("q") ?? defaults.q;

  const set = useCallback(
    (next: Partial<{ page: number; pageSize: number; q: string }>) => {
      const p = new URLSearchParams(sp);
      if (next.page != null) p.set("page", String(next.page));
      if (next.pageSize != null) p.set("pageSize", String(next.pageSize));
      if (next.q != null) p.set("q", next.q);
      router.replace(`?${p.toString()}`, { scroll: false });
    },
    [router, sp],
  );

  return { page, pageSize, q, set };
}
