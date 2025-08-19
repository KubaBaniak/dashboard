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
import { useCreateCategory } from "@/hooks/categories/useCategoryMutations";
import {
  CreateCategoryInput,
  createCategorySchema,
} from "@/lib/validation-schemas/createCategorySchema";
import { Plus } from "lucide-react";

type Props = {
  trigger?: React.ReactNode;
  onCreated?: () => void;
};

export default function CreateCategoryDialog({ trigger, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const create = useCreateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(values: CreateCategoryInput) {
    await create.mutateAsync(values);
    reset();
    setOpen(false);
    onCreated?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      {!trigger ? (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input {...register("name")} placeholder="e.g. Accessories" />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Optional short description..."
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
