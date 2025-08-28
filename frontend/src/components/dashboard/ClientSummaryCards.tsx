// components/dashboard/ClientSummaryCards.tsx
"use client";

import {
  useLatestClients,
  useTopClients,
} from "@/hooks/clients/useClientSummary";
import { ClientCard } from "../clients/ClientCard";

const formatDate = (isoDate: string, locale = "en-US") =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));

const formatCurrency = (value: number, locale = "pl-PL", currency = "PLN") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

export function ClientSummaryCards() {
  const {
    data: latest,
    isLoading: latestLoading,
    isError: latestErr,
  } = useLatestClients(3);
  const {
    data: top,
    isLoading: topLoading,
    isError: topErr,
  } = useTopClients(3);

  return (
    <div className="space-y-10 flex flex-col justify-evenly h-full">
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">🆕 Latest Clients</h2>

        {latestLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : latestErr ? (
          <p className="text-sm text-red-600">Failed to load latest clients.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(latest ?? []).map((c) => (
              <ClientCard
                key={c.id}
                name={c.name ?? c.email}
                email={c.email}
                footer={`Registered on ${formatDate(c.createdAt)}`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">🏆 Top Clients</h2>

        {topLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : topErr ? (
          <p className="text-sm text-red-600">Failed to load top clients.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(top ?? []).map((c) => (
              <ClientCard
                key={c.id}
                name={c.name ?? c.email}
                email={c.email}
                footer={
                  <>
                    Total spent:{" "}
                    <span className="text-foreground font-medium">
                      {formatCurrency(c.totalSpent)}
                    </span>
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
