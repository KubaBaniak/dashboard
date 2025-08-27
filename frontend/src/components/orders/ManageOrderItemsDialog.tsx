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
import {
  useAddOrderItem,
  useRemoveOrderItem,
} from "@/hooks/orders/useOrderMutations";
import { useProductOptions } from "@/hooks/products/useProductsOptions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

type Props = {
  orderId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currency?: string;
  locale?: string;
};

type AddForm = { productId: number | null; quantity: number };

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
  const addItem = useAddOrderItem();
  const removeItem = useRemoveOrderItem();
  const { data: products = [], isLoading: prodLoading } = useProductOptions();

  const { register, handleSubmit, setValue, reset, watch } = useForm<AddForm>({
    defaultValues: { productId: null, quantity: 1 },
    mode: "onChange",
  });

  const [saving, setSaving] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);

  const selectedProductId = watch("productId");
  const selectedProduct =
    products.find((p) => Number(p.id) === Number(selectedProductId ?? -1)) ??
    null;

  const total = items.reduce((s, i) => s + Number(i.lineTotal), 0);

  async function onAdd(values: AddForm) {
    if (!values.productId || values.quantity < 1) return;
    setSaving(true);
    try {
      await addItem.mutateAsync({
        orderId,
        productId: values.productId,
        quantity: values.quantity,
      });
      reset({ productId: null, quantity: 1 });
      await refetch();
    } finally {
      setSaving(false);
    }
  }

  async function onRemove(itemId: number) {
    setSaving(true);
    try {
      await removeItem.mutateAsync({ orderItemId: itemId, orderId });
      await refetch();
    } finally {
      setSaving(false);
    }
  }

  const canSubmit =
    !!selectedProductId && Number(watch("quantity")) >= 1 && !saving;

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
          <input
            type="hidden"
            {...register("productId", { valueAsNumber: true })}
          />

          <div className="sm:w-56">
            <label className="text-sm font-medium">Product</label>
            <Popover open={prodOpen} onOpenChange={setProdOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={prodLoading}
                  aria-expanded={prodOpen}
                >
                  {selectedProduct
                    ? (selectedProduct.title ?? `#${selectedProduct.id}`)
                    : "Select product"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-[360px]"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <Command loop>
                  <CommandInput
                    placeholder="Type to search products…"
                    autoFocus
                  />
                  <CommandList>
                    <CommandEmpty>No products.</CommandEmpty>
                    <CommandGroup>
                      {products.map((p) => {
                        const id = Number(p.id);
                        const productTitle = (p.title ?? `#${id}`).trim();
                        const checked = Number(selectedProductId) === id;

                        return (
                          <CommandItem
                            key={id}
                            value={productTitle.toLowerCase()}
                            keywords={[String(id)]}
                            onMouseDown={(e) => e.preventDefault()}
                            onSelect={() => {
                              setValue("productId", id, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setProdOpen(false);
                            }}
                            className="flex items-center justify-between"
                          >
                            <span className="truncate">{productTitle}</span>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                checked ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="sm:w-32">
            <label className="text-sm font-medium">Qty</label>
            <Input
              type="number"
              min={1}
              step={1}
              {...register("quantity", {
                valueAsNumber: true,
                min: 1,
                required: true,
              })}
            />
          </div>

          <Button type="submit" disabled={!canSubmit}>
            {saving ? "Adding…" : "Add item"}
          </Button>
        </form>

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
                      {formatCurrency(Number(it.unitPrice), locale, currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(it.lineTotal), locale, currency)}
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
            {formatCurrency(Number(total), locale, currency)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
