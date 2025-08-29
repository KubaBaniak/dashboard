"use client";

import { useState, useMemo } from "react";
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
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

import { useUpdateProduct } from "@/hooks/products/useMutationsProduct";
import { useCategoryOptions } from "@/hooks/categories/useCategoryOptions";
import {
  UpdateProductInput,
  updateProductSchema,
} from "@/lib/validation-schemas/updateProductSchema";

type ProductForEdit = {
  id: number;
  title: string;
  description?: string | null;
  sku: string;
  stockQuantity: number;
  price: string;
  categories: { id: number; name: string }[];
};

type Props = {
  product: ProductForEdit;
  onUpdated?: () => void;
};

export default function EditProductDialog({ product, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const update = useUpdateProduct();
  const { data: categoryOptions = [], isLoading: catsLoading } =
    useCategoryOptions();

  const defaultCategoryIds = useMemo(
    () => product.categories.map((c) => c.id),
    [product.categories],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    mode: "onChange",
    defaultValues: {
      title: product.title,
      description: product.description ?? "",
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      price: Number(product.price),
      categoryIds: defaultCategoryIds,
    },
  });

  const selectedIds = watch("categoryIds") ?? [];

  const toggleCategory = (id: number) => {
    const current = new Set(selectedIds);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    setValue("categoryIds", Array.from(current), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  async function onSubmit(values: UpdateProductInput) {
    await update.mutateAsync({ id: product.id, data: values });
    reset(values);
    setOpen(false);
    onUpdated?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input {...register("title")} placeholder="e.g. iPhone 15" />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">SKU</label>
              <Input {...register("sku")} placeholder="e.g. IP15-BLK-128" />
              {errors.sku && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.sku.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Stock</label>
              <Input
                type="number"
                min={0}
                step={1}
                {...register("stockQuantity", { valueAsNumber: true })}
              />
              {errors.stockQuantity && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              min={0}
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="e.g. 999.99"
            />
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categories</label>

            <Popover open={catOpen} onOpenChange={setCatOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={catsLoading}
                  aria-expanded={catOpen}
                >
                  {selectedIds.length > 0
                    ? `${selectedIds.length} selected`
                    : "Select categories"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-[360px]"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <Command loop>
                  <CommandInput placeholder="Type to filter…" autoFocus />
                  <CommandList>
                    <CommandEmpty>No categories.</CommandEmpty>
                    <CommandGroup>
                      {categoryOptions.map((c) => {
                        const checked = selectedIds.includes(c.id);
                        return (
                          <CommandItem
                            key={c.id}
                            value={(c.name ?? `#${c.id}`).toLowerCase()}
                            onSelect={() => {
                              toggleCategory(c.id);
                            }}
                            className="flex items-center justify-between"
                          >
                            <span className="truncate">{c.name}</span>
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
                  .map((id) => categoryOptions.find((c) => c.id === id))
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
                {errors.categoryIds.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Short product description…"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
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
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
