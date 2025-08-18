"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { createProductSchema } from "@/lib/validation-schemas/createProductSchema";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

type FormValues = z.infer<typeof createProductSchema>;

export default function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const { data: categories = [], isLoading: catLoading } = useCategories();
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      sku: "",
      stockQuantity: 0,
      price: 0,
      categoryIds: [],
    },
  });

  const selectedIds = watch("categoryIds");

  function toggleCategory(id: number) {
    const set = new Set(selectedIds);
    set.has(id) ? set.delete(id) : set.add(id);
    setValue("categoryIds", Array.from(set), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  async function onSubmit(values: FormValues) {
    await createProduct.mutateAsync(values);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create product</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input {...register("title")} placeholder="e.g. Wireless Mouse" />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Optional description..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">SKU</label>
            <Input {...register("sku")} placeholder="e.g. MOUSE-001" />
            {errors.sku && (
              <p className="text-sm text-red-600 mt-1">{errors.sku.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Stock</label>
              <Input
                type="number"
                step="1"
                min={0}
                {...register("stockQuantity", { valueAsNumber: true })}
              />
              {errors.stockQuantity && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                step="0.01"
                min={0.01}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categories</label>

            <Popover open={catOpen} onOpenChange={setCatOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={catLoading}
                  aria-expanded={catOpen}
                >
                  {selectedIds.length > 0
                    ? `${selectedIds.length} selected`
                    : "Select categories"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-[340px]"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <Command loop>
                  <CommandList>
                    <CommandEmpty>No categories.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((c) => {
                        const checked = selectedIds.includes(c.id);
                        return (
                          <CommandItem
                            key={c.id}
                            onSelect={() => {
                              toggleCategory(c.id);
                              setCatOpen(true);
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            className="flex items-center justify-between"
                          >
                            <span>{c.name}</span>
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

            {selectedIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedIds
                  .map((id) => categories.find((c) => c.id === id))
                  .filter(Boolean)
                  .map((c) => (
                    <Badge key={c!.id} variant="secondary">
                      {c!.name}
                    </Badge>
                  ))}
              </div>
            )}

            {errors.categoryIds && (
              <p className="text-sm text-red-600 mt-1">
                {errors.categoryIds.message}
              </p>
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
              disabled={!isValid || isSubmitting || catLoading}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
