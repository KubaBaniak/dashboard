"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../orders/types";

type Props = {
  status: OrderStatus;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const styles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30",
  SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30",
};

export const StatusBadgeButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ status, icon, children, className, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          // badge-like styles
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          styles[status],
          disabled && "opacity-60 pointer-events-none",
          className,
        )}
        {...rest}
      >
        {icon ? <span className="inline-flex">{icon}</span> : null}
        <span className="whitespace-nowrap">{children ?? status}</span>
      </button>
    );
  },
);

StatusBadgeButton.displayName = "StatusBadgeButton";
