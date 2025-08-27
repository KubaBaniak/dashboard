"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/components/utils/format-currency";
import { useOrderItems } from "@/hooks/orders/useOrderItems";

type Props = {
  orderId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currency?: string;
  locale?: string;
};

export default function OrderItemsDialog({
  orderId,
  open,
  onOpenChange,
  currency = "PLN",
  locale = "pl-PL",
}: Props) {
  const {
    data: items = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useOrderItems(orderId);

  const totalAmount = items.reduce((s, it) => s + it.lineTotal, 0);
  const totalQty = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order #{orderId} — items</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {isFetching ? "Refreshing…" : "\u00A0"}
          </span>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableCaption className="text-left">Order items</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[84px]">Item ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit</TableHead>
                <TableHead className="text-right">Line total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-red-600"
                  >
                    Failed to load order items.
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No items.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.id}</TableCell>
                    <TableCell className="truncate" title={it.productTitle}>
                      {it.productTitle}
                    </TableCell>
                    <TableCell className="truncate">{it.productSku}</TableCell>
                    <TableCell className="text-right">{it.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(it.unitPrice, locale, currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(it.lineTotal, locale, currency)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-semibold">
                  Items: {totalQty}
                </TableCell>
                <TableCell colSpan={3} className="text-right font-semibold">
                  Total: {formatCurrency(totalAmount, locale, currency)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
