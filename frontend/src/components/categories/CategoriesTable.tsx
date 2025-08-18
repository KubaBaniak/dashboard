"use client";

import { useState } from "react";
import Pagination from "@/components/Pagination";
import CenteredSpinner from "@/components/utils/CenteredSpinner";
import CategoriesToolbar from "@/components/categories/CategoriesToolbar";
import { useUrlPagination } from "@/hooks/useUrlPagination";
import { useCategoryList } from "@/hooks/useCategoryList";
import { useDeleteCategory } from "@/hooks/useCategoryMutations";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import EditCategoryDialog from "@/components/categories/EditCategoryDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CategoriesTable() {
  const { page, pageSize, q, set } = useUrlPagination();

  const { data, isLoading, isError } = useCategoryList({ page, pageSize, q });
  const del = useDeleteCategory();

  const [toDelete, setToDelete] = useState<number | null>(null);

  if (isLoading) return <CenteredSpinner />;
  if (isError)
    return <p className="text-red-500">Failed to load categories.</p>;

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4 rounded-md border border-muted p-4 shadow-sm bg-gradient-to-t from-primary/5">
      <CategoriesToolbar
        pageSize={pageSize}
        onPageSizeChange={(n) => {
          set({ pageSize: n, page: 1 });
        }}
        query={q}
        onQueryChange={(s) => {
          set({ q: s, page: 1 });
        }}
      />

      <div className="overflow-auto">
        <Table>
          <TableCaption className="text-left">All categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell
                    className="max-w-[420px] truncate"
                    title={c.description ?? ""}
                  >
                    {c.description}
                  </TableCell>
                  <TableCell className="text-right">{c.productCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EditCategoryDialog
                        category={c}
                        trigger={
                          <Button size="sm" variant="secondary">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        }
                      />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setToDelete(c.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this category?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <p className="text-sm text-muted-foreground">
                            This action cannot be undone.
                          </p>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                if (toDelete != null) {
                                  await del.mutateAsync(toDelete);
                                  setToDelete(null);
                                }
                              }}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="font-semibold">
                Page {page} of {totalPages}
              </TableCell>
              <TableCell
                colSpan={2}
                className="text-right text-sm text-muted-foreground"
              >
                Showing {(rows.length && (page - 1) * pageSize + 1) || 0}–
                {Math.min(page * pageSize, total)} of {total}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex items-center justify-end">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => set({ page: p })}
        />
      </div>
    </div>
  );
}
