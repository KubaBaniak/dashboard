"use client";

import { JSX, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Clock3, Truck, XCircle } from "lucide-react";
import type { OrderStatus } from "./types";
import { StatusBadgeButton } from "../utils/StatusBadgeButton";
import { useUpdateStatus } from "@/hooks/orders/useOrderMutations";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "CANCELLED"] as const;

const STATUS_ICONS: Record<OrderStatus, JSX.Element> = {
  PENDING: <Clock3 className="h-4 w-4" />,
  PAID: <CheckCircle2 className="h-4 w-4" />,
  SHIPPED: <Truck className="h-4 w-4" />,
  CANCELLED: <XCircle className="h-4 w-4" />,
};

type Props = {
  status: OrderStatus;
  orderId: number;
  disabled?: boolean;
};

export default function UpdateStatusDropdown({
  status,
  orderId,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<OrderStatus>(status);
  const [saving, setSaving] = useState(false);

  useEffect(() => setCurrent(status), [status]);
  const updateStatus = useUpdateStatus();

  async function handlePick(next: OrderStatus) {
    setOpen(false);
    if (next === current) return;

    setSaving(true);
    try {
      updateStatus.mutateAsync({ orderId, status: current });
      setCurrent(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled || saving}>
        <StatusBadgeButton
          status={current}
          icon={STATUS_ICONS[current]}
          disabled={disabled || saving}
          aria-label="Change status"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        {STATUSES.filter((s) => s !== current).map((s) => (
          <DropdownMenuItem
            key={s}
            onSelect={(e) => {
              e.preventDefault();
              void handlePick(s);
            }}
          >
            <div className="flex items-center gap-2">
              {STATUS_ICONS[s]}
              <span>
                Change to <span className="font-medium">{s}</span>
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
