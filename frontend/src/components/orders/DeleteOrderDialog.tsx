"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteOrder } from "@/hooks/orders/useOrderMutations";

type Props = {
  orderId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function DeleteOrderDialog({
  orderId,
  open,
  onOpenChange,
}: Props) {
  const del = useDeleteOrder();
  const [loading, setLoading] = useState(false);

  async function onConfirm() {
    setLoading(true);
    try {
      await del.mutateAsync(orderId);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete order #{orderId}?</AlertDialogTitle>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
