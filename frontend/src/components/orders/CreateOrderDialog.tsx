"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { ChevronsUpDown, Plus, Check, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCreateOrder } from "@/hooks/orders/useOrderMutations";
import { useProductOptions } from "@/hooks/products/useProductsOptions";
import { useClientOptions } from "@/hooks/clients/useClientOptions";

import {
  CreateOrderInput,
  createOrderSchema,
} from "@/lib/validation-schemas/createOrderSchema";

export default function CreateOrderDialog() {
  const [open, setOpen] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);

  const create = useCreateOrder();
  const { data: products = [], isLoading: prodLoading } = useProductOptions();
  const { data: clients = [], isLoading: clientsLoading } = useClientOptions();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    mode: "onChange",
    defaultValues: {
      buyerId: undefined,
      shippingAddress: "",
      billingAddress: "",
      items: [{ productId: undefined as unknown as number, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedBuyerId = watch("buyerId");
  const selectedClient =
    clients.find((c) => Number(c.id) === Number(selectedBuyerId)) ?? null;

  async function onSubmit(values: CreateOrderInput) {
    await create.mutateAsync(values);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Buyer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Client</label>
            <Popover open={clientOpen} onOpenChange={setClientOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={clientsLoading}
                  aria-expanded={clientOpen}
                >
                  {selectedClient
                    ? (selectedClient.name ?? selectedClient.email)
                    : "Select client"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-[360px]"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <Command loop>
                  <CommandInput placeholder="Search clients…" autoFocus />
                  <CommandList>
                    <CommandEmpty>No clients.</CommandEmpty>
                    <CommandGroup>
                      {clients.map((c) => {
                        const id = Number(c.id);
                        const label = (c.name ?? c.email).trim();
                        const checked = Number(selectedBuyerId) === id;

                        return (
                          <CommandItem
                            key={id}
                            value={label.toLowerCase()}
                            keywords={[String(id), c.email ?? ""]}
                            onSelect={() => {
                              setValue("buyerId", id, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setClientOpen(false);
                            }}
                            className="flex items-center justify-between"
                          >
                            <span className="truncate">{label}</span>
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
            {errors.buyerId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.buyerId.message}
              </p>
            )}
          </div>

          {/* Addresses */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Shipping address</label>
              <Textarea
                placeholder="Street, city, ZIP, country…"
                {...register("shippingAddress")}
              />
              {errors.shippingAddress && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.shippingAddress.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Billing address</label>
              <Textarea
                placeholder="Street, city, ZIP, country…"
                {...register("billingAddress")}
              />
              {errors.billingAddress && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.billingAddress.message}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Items</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  append({
                    productId: undefined as unknown as number,
                    quantity: 1,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add item
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => {
                const prodId = watch(`items.${index}.productId`);
                const selectedProduct =
                  products.find((p) => Number(p.id) === Number(prodId)) ?? null;

                return (
                  <div
                    key={field.id}
                    className="grid gap-2 sm:grid-cols-[1fr_120px_40px]"
                  >
                    {/* Product combobox */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Product
                      </label>
                      <Popover open={prodOpen} onOpenChange={setProdOpen} modal>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                            disabled={prodLoading}
                            aria-expanded={prodOpen}
                            type="button"
                          >
                            {selectedProduct
                              ? (selectedProduct.title ??
                                `#${selectedProduct.id}`)
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
                              placeholder="Search products…"
                              autoFocus
                            />
                            <CommandList>
                              <CommandEmpty>No products.</CommandEmpty>
                              <CommandGroup>
                                {products.map((p) => {
                                  const id = Number(p.id);
                                  const label =
                                    (p.title ?? `#${id}`).trim() || `#${id}`;
                                  const checked = Number(prodId) === id;

                                  return (
                                    <CommandItem
                                      key={id}
                                      value={label.toLowerCase()}
                                      keywords={[String(id) ?? ""]}
                                      onSelect={() => {
                                        setValue(
                                          `items.${index}.productId`,
                                          id,
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          },
                                        );
                                        setProdOpen(false);
                                      }}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="truncate">{label}</span>
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
                      {errors.items?.[index]?.productId && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.items[index]?.productId?.message}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.items[index]?.quantity?.message}
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.items && typeof errors.items.message === "string" && (
              <p className="text-sm text-red-600">{errors.items.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
