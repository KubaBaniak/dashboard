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
// import { useUpdateOrder } from "@/hooks/orders/useOrderMutations";

type Props = {
  order: {
    id: number;
    buyerId: number;
    status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
    shippingAddress: string;
    billingAddress: string;
  };
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

type FormValues = {
  status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
  shippingAddress: string;
  billingAddress: string;
};

export default function EditOrderDialog({ order, open, onOpenChange }: Props) {
  // const update = useUpdateOrder();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, formState, reset } =
    useForm<FormValues>({
      defaultValues: {
        status: order.status,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
      },
      mode: "onChange",
    });

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      // await update.mutateAsync({ orderId: order.id, ...values });
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              defaultValue={order.status}
              onValueChange={(v) =>
                setValue("status", v as FormValues["status"], {
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

          <div>
            <label className="text-sm font-medium">Shipping address</label>
            <Input {...register("shippingAddress")} />
          </div>

          <div>
            <label className="text-sm font-medium">Billing address</label>
            <Input {...register("billingAddress")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!formState.isValid || saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
