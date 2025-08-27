"use client";

import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientDetails } from "@/hooks/clients/useClientDetails";
import { formatDate } from "@/components/utils/format-date";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import StatCard from "./StatCard";
import {
  CalendarClock,
  LineChart,
  Package,
  ShoppingCart,
  Wallet,
} from "lucide-react";

type ClientBase = {
  id: number;
  email: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  createdAt: string;
};

type Props = {
  client: ClientBase;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  currency?: string;
};

const qtyBarWidth = (q: number, max: number) =>
  `${Math.max(6, Math.round((q / Math.max(1, max)) * 100))}%`;

const money = (n: number, currency = "PLN") =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(n);

export default function ClientDetailsDrawer({
  client,
  open: controlledOpen,
  onOpenChange,
  currency = "PLN",
}: Props) {
  const [innerOpen, setInnerOpen] = useState(false);
  const open = controlledOpen ?? innerOpen;
  const setOpen = onOpenChange ?? setInnerOpen;

  const { data, isLoading, isFetching, isError } = useClientDetails(
    open ? client.id : null,
    { enabled: open },
  );

  const daysAsCustomer = useMemo(() => {
    const created = new Date(client.createdAt).getTime();
    const now = Date.now();
    const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }, [client.createdAt]);

  const stats = data?.stats;
  const topProducts = data?.topProducts ?? [];
  const orders = data?.orders ?? [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        {/* Header band */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent border-b p-4 sm:p-5">
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-xl font-semibold">
              Client #{client.id} — {client.name || client.email}
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              Joined {formatDate(client.createdAt, { dateStyle: "medium" })} ·{" "}
              {daysAsCustomer} days ago
            </p>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4 sm:p-6">
          {/* Profile */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Profile</h3>
              <Badge variant="secondary">ID {client.id}</Badge>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                {client.email}
              </div>
              {client.name && (
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {client.name}
                </div>
              )}
              {client.phone && (
                <div>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {client.phone}
                </div>
              )}
              {client.company && (
                <div>
                  <span className="text-muted-foreground">Company:</span>{" "}
                  {client.company}
                </div>
              )}
              {client.address && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {client.address}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <StatCard
              title="Orders"
              value={stats ? stats.totalOrders : "—"}
              icon={ShoppingCart}
            />
            <StatCard
              title="Lifetime Spend"
              value={stats ? money(stats.lifetimeSpend, currency) : "—"}
              icon={Wallet}
            />
            <StatCard
              title="Avg. Order"
              value={stats ? money(stats.averageOrderValue, currency) : "—"}
              icon={LineChart}
            />
            <StatCard
              title="Orders / mo"
              value={
                stats?.ordersPerMonth ? stats.ordersPerMonth.toFixed(2) : "—"
              }
              icon={CalendarClock}
            />
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Top Products</h3>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            {topProducts?.length ? (
              <div className="space-y-3">
                {(() => {
                  const maxQ = Math.max(
                    ...topProducts.map((p) => p.quantity),
                    1,
                  );
                  return topProducts.map((p) => (
                    <div key={p.productId} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm">
                          {p.title || `Product #${p.productId}`}
                        </p>
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap"
                        >
                          {p.quantity} pcs
                        </Badge>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: qtyBarWidth(p.quantity, maxQ) }}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No product data.</p>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Recent Orders</h3>
              {(isLoading || isFetching) && (
                <span className="text-xs text-muted-foreground">Updating…</span>
              )}
            </div>
            {isError ? (
              <p className="text-sm text-red-600">Failed to load orders.</p>
            ) : (
              <div className="overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(orders ?? []).slice(0, 10).map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell>
                          {formatDate(o.createdAt, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {o.total != null
                            ? money(Number(o.total), currency)
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!orders || orders.length === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-sm text-muted-foreground"
                        >
                          No orders yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
