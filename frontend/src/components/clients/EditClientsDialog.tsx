"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUpdateClient } from "@/hooks/clients/useClientMutations";
import {
  UpdateClientInput,
  updateClientSchema,
} from "@/lib/validation-schemas/clientSchemas";

type Props = {
  client: {
    id: number;
    email: string;
    name?: string;
    phone?: string;
    address?: string;
    company?: string;
  };
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
};

export default function EditClientDialog({
  client,
  open: controlledOpen,
  onOpenChange,
}: Props) {
  const [innerOpen, setInnerOpen] = useState(false);
  const open = controlledOpen ?? innerOpen;
  const setOpen = onOpenChange ?? setInnerOpen;

  const update = useUpdateClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UpdateClientInput>({
    resolver: zodResolver(updateClientSchema),
    mode: "onChange",
    defaultValues: {
      id: client.id,
      email: client.email,
      name: client.name ?? "",
      phone: client.phone ?? "",
      address: client.address ?? "",
      company: client.company ?? "",
    },
  });

  async function onSubmit(values: UpdateClientInput) {
    await update.mutateAsync(values);
    reset(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("id", { valueAsNumber: true })} />

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Name</label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <Input {...register("address")} />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Company</label>
            <Input {...register("company")} />
            {errors.company && (
              <p className="text-sm text-red-600 mt-1">
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
