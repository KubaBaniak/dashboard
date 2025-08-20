"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { ChevronsUpDown, Plus, Check } from "lucide-react";

import { useCreateDelivery } from "@/hooks/deliveries/useDeliveryMutations";
import { useProductOptions } from "@/hooks/products/useProductsOptions";
import {
  CreateDeliveryInput,
  createDeliverySchema,
} from "@/lib/validation-schemas/deliverySchemas";
import { cn } from "@/lib/utils";

type Props = {
  trigger?: React.ReactNode;
  onCreated?: () => void;
};

export default function CreateDeliveryDialog({ trigger, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);

  const create = useCreateDelivery();
  const { data: products = [], isLoading: prodLoading } = useProductOptions();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateDeliveryInput>({
    resolver: zodResolver(createDeliverySchema),
    mode: "onChange",
    defaultValues: { productId: undefined, quantity: 1, note: "" },
  });

  const selectedProductId = watch("productId");
  const selectedProduct =
    products.find((p) => Number(p.id) === Number(selectedProductId)) ?? null;

  async function onSubmit(values: CreateDeliveryInput) {
    await create.mutateAsync(values);
    reset();
    setOpen(false);
    onCreated?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Delivery
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create delivery</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
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

            {errors.productId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.productId.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min={1}
              step={1}
              {...register("quantity", { valueAsNumber: true })}
              placeholder="e.g. 10"
            />
            {errors.quantity && (
              <p className="text-sm text-red-600 mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Note</label>
            <Textarea
              {...register("note")}
              placeholder="Optional short description..."
            />
            {errors.note && (
              <p className="text-sm text-red-600 mt-1">{errors.note.message}</p>
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
            <Button
              type="submit"
              disabled={!isValid || isSubmitting || prodLoading}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
