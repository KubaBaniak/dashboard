"use client";

import { useState } from "react";
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
import { useUpdateCategory } from "@/hooks/categories/useCategoryMutations";
import {
  UpdateCategoryInput,
  updateCategorySchema,
} from "@/lib/validation-schemas/createCategorySchema";

type Props = {
  category: { id: number; name: string; description?: string | null };
  trigger: React.ReactNode;
};

export default function EditCategoryDialog({ category, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const update = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    mode: "onChange",
    defaultValues: {
      id: category.id,
      name: category.name,
      description: category.description ?? "",
    },
  });

  async function onSubmit(values: UpdateCategoryInput) {
    await update.mutateAsync(values);
    reset(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("id", { valueAsNumber: true })} />

          <div>
            <label className="text-sm font-medium">Name</label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea {...register("description")} />
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
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
