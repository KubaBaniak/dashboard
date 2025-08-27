// src/components/orders/OrderActionsMenu.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, ListPlus, Trash2 } from "lucide-react";
import EditOrderDialog from "./EditOrderDialog";
import ManageOrderItemsDialog from "./ManageOrderItemsDialog";
import DeleteOrderDialog from "./DeleteOrderDialog";

export type OrderActionsMenuProps = {
  order: {
    id: number;
    buyerId: number;
    status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
    shippingAddress: string;
    billingAddress: string;
  };
};

export default function OrderActionsMenu({ order }: OrderActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Order actions"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setEditOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit order…
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setItemsOpen(true);
            }}
          >
            <ListPlus className="mr-2 h-4 w-4" />
            Manage items…
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditOrderDialog
        order={order}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ManageOrderItemsDialog
        orderId={order.id}
        open={itemsOpen}
        onOpenChange={setItemsOpen}
      />
      <DeleteOrderDialog
        orderId={order.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
