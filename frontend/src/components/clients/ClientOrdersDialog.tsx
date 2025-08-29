"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
} from "@/components/ui/table";
import StatusBadge from "@/components/utils/StatusBadge";
import { formatCurrency } from "@/components/utils/format-currency";
import { useClientOrders } from "@/hooks/orders/useClientOrders";
import { OrderStatus } from "../orders/types";

type Props = {
  client: {
    id: number;
    email: string;
    name?: string | null;
  };
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function ClientOrdersDialog({
  client,
  open,
  onOpenChange,
}: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<
    "ALL" | "PENDING" | "PAID" | "SHIPPED" | "CANCELLED"
  >("ALL");

  const { data, isLoading, isError, refetch, isFetching } = useClientOrders({
    clientId: client.id,
    page,
    pageSize,
    q,
    status,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Orders for {client.name || client.email} (#{client.id})
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Search by ID, product, note…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[280px]"
            />

            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as OrderStatus);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(parseInt(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        </div>

        <div className="overflow-auto mt-3">
          <Table>
            <TableCaption className="text-left">Client orders</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-red-600"
                  >
                    Failed to load orders.
                  </TableCell>
                </TableRow>
              ) : data && data.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((o) => {
                  const d = new Date(o.createdAt);
                  const date = new Intl.DateTimeFormat("pl-PL", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(d);
                  const totalNumber = Number(o.totalAmount);
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">#{o.id}</TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>
                        <StatusBadge status={o.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {o.itemCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalNumber, "pl-PL", "PLN")}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-semibold">
                  Page {page} of {totalPages}
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="text-right text-sm text-muted-foreground"
                >
                  Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, total)} of {total}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="flex items-center justify-end mt-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
