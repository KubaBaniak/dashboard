"use client";

import { useState } from "react";
import Pagination from "../Pagination";
import CenteredSpinner from "../utils/CenteredSpinner";
import ProductsToolbar from "./ProductsToolbar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useProductsList } from "@/hooks/products/useProductsList";
import DeleteProductDialog from "./DeleteProductDialog";

export default function ProductsTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");

  const { data, isLoading, isError } = useProductsList({ page, pageSize, q });

  if (isLoading) return <CenteredSpinner />;
  if (isError) return <p className="text-red-500">Failed to load products.</p>;

  const rows = data?.data ?? [];

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4 rounded-md border border-muted p-4 shadow-sm bg-gradient-to-t from-primary/5">
      <ProductsToolbar
        pageSize={pageSize}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        query={q}
        onQueryChange={(s) => {
          setQ(s);
          setPage(1);
        }}
      />

      <div className="overflow-auto">
        <Table>
          <TableCaption className="text-left">All products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Actions</TableHead>
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
              rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>
                    {p.categories.map((c) => (
                      <Badge key={c.id} variant="secondary" className="mr-0.5">
                        {c.name}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell className="text-right">
                    {p.stockQuantity}
                  </TableCell>
                  <TableCell className="text-right">{p.price}</TableCell>
                  <TableCell>
                    <DeleteProductDialog productId={p.id} />
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
              <TableCell />
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
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
