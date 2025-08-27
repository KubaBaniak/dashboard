"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useUpdateOrder } from "@/hooks/orders/useOrderMutations";
import {
  BaseUpdateOrderInput,
  baseUpdateOrderSchema,
} from "@/lib/validation-schemas/updateOrderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderStatus } from "./types";

type Props = {
  order: {
    id: number;
    status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
    shippingAddress: string;
    billingAddress: string;
  };
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function EditOrderDialog({ order, open, onOpenChange }: Props) {
  const update = useUpdateOrder();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
    reset,
  } = useForm<BaseUpdateOrderInput>({
    resolver: zodResolver(baseUpdateOrderSchema),
    mode: "onChange",
    defaultValues: {
      id: order.id,
      status: order.status,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
    },
  });

  async function onSubmit(values: BaseUpdateOrderInput) {
    setSaving(true);
    try {
      await update.mutateAsync({ orderId: order.id, data: values });
      reset(values);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit order #{order.id}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("id", { valueAsNumber: true })} />

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              defaultValue={order.status}
              onValueChange={(v) =>
                setValue("status", v as OrderStatus, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.status && (
            <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
          )}

          <div>
            <label className="text-sm font-medium">Shipping address</label>
            <Input {...register("shippingAddress")} />
          </div>
          {errors.shippingAddress && (
            <p className="text-sm text-red-600 mt-1">
              {errors.shippingAddress.message}
            </p>
          )}

          <div>
            <label className="text-sm font-medium">Billing address</label>
            <Input {...register("billingAddress")} />
          </div>
          {errors.billingAddress && (
            <p className="text-sm text-red-600 mt-1">
              {errors.billingAddress.message}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
