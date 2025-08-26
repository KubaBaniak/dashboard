"use client";

import { useState } from "react";
import { MoreVertical, Info, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ClientDetailsDrawer from "@/components/clients/ClientDetailsDrawer";
import EditClientDialog from "@/components/clients/EditClientsDialog";
import DeleteClientDialog from "@/components/clients/DeleteClientDialog";

type Props = {
  client: {
    id: number;
    email: string;
    name?: string;
    phone?: string;
    address?: string;
    company?: string;
    createdAt: string;
  };
};

export default function ClientActionsMenu({ client }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Open actions"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // stop Radix default behavior if needed
              setMenuOpen(false); // close the menu
              setDetailsOpen(true); // open drawer
            }}
          >
            <Info className="mr-2 h-4 w-4" />
            Details
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setEditOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
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
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClientDetailsDrawer
        client={client}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <EditClientDialog
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteClientDialog
        clientId={client.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
