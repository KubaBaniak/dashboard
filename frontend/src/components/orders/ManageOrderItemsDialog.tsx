"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { formatCurrency } from "@/components/utils/format-currency";
import { useOrderItems } from "@/hooks/orders/useOrderItems";
// import { useAddOrderItem, useRemoveOrderItem } from "@/hooks/orders/useOrderMutations";

type Props = {
  orderId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currency?: string;
  locale?: string;
};

type AddForm = { productId: number; quantity: number };

export default function ManageOrderItemsDialog({
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
    refetch,
  } = useOrderItems(orderId);
  // const addItem = useAddOrderItem();
  // const removeItem = useRemoveOrderItem();

  const { register, handleSubmit, reset, formState } = useForm<AddForm>({
    defaultValues: { productId: undefined as any, quantity: 1 },
    mode: "onChange",
  });

  const [saving, setSaving] = useState(false);

  const total = items.reduce((s, i) => s + i.lineTotal, 0);

  async function onAdd(values: AddForm) {
    setSaving(true);
    try {
      // await addItem.mutateAsync({ orderId, ...values });
      reset({ productId: undefined as any, quantity: 1 });
      await refetch();
    } finally {
      setSaving(false);
    }
  }

  async function onRemove(itemId: number) {
    setSaving(true);
    try {
      // await removeItem.mutateAsync({ orderItemId: itemId });
      await refetch();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage items — order #{orderId}</DialogTitle>
        </DialogHeader>

        {/* Add row */}
        <form
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
          onSubmit={handleSubmit(onAdd)}
        >
          <div className="sm:w-40">
            <label className="text-sm font-medium">Product ID</label>
            <Input
              type="number"
              min={1}
              {...register("productId", { valueAsNumber: true })}
            />
          </div>
          <div className="sm:w-32">
            <label className="text-sm font-medium">Qty</label>
            <Input
              type="number"
              min={1}
              {...register("quantity", { valueAsNumber: true })}
            />
          </div>
          <Button type="submit" disabled={!formState.isValid || saving}>
            {saving ? "Adding…" : "Add item"}
          </Button>
        </form>

        {/* Items list */}
        <div className="overflow-auto mt-3">
          <Table>
            <TableCaption className="text-left">Current items</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit</TableHead>
                <TableHead className="text-right">Line total</TableHead>
                <TableHead className="text-right w-[90px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-red-600"
                  >
                    Failed to load items.
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
                    <TableCell>{it.productSku}</TableCell>
                    <TableCell className="text-right">{it.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(it.unitPrice, locale, currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(it.lineTotal, locale, currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(it.id)}
                        disabled={saving}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-3 flex items-center justify-end text-sm">
            <span className="font-semibold mr-2">Total:</span>
            {formatCurrency(total, locale, currency)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
