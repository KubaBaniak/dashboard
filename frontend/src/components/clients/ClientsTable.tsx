"use client";

import Pagination from "@/components/Pagination";
import CenteredSpinner from "@/components/utils/CenteredSpinner";
import { useUrlPagination } from "@/hooks/useUrlPagination";

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
import { formatDate } from "../utils/format-date";
import { useClientsBase } from "@/hooks/clients/useClientsBase";
import ClientsToolbar from "./ClientsToolbar";
import ClientActionsMenu from "./ClientActionsMenu";
import BulkActionsToolbar from "./BulkActionsToolbar";
import { useMemo, useState, useTransition } from "react";
import { Checkbox } from "../ui/checkbox";
import api from "@/lib/api";
import { useDeleteClientsBulk } from "@/hooks/clients/useDeleteClientsBulk";
import { toast } from "sonner";

export default function ClientsTable() {
  const { page, pageSize, q, set } = useUrlPagination();
  const { data, isLoading, isError, refetch } = useClientsBase({
    page,
    pageSize,
    q,
  });
  const [isPending, startTransition] = useTransition();
  const delBulk = useDeleteClientsBulk();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const isSelected = (id: number) => selectedIds.includes(id);

  const toggleOne = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const pageIds = useMemo(
    () => (data?.data ?? []).map((r) => r.id),
    [data?.data],
  );
  const allOnPageSelected =
    (data?.data ?? []).length > 0 &&
    pageIds.every((id) => selectedIds.includes(id));
  const someOnPageSelected =
    (data?.data ?? []).length > 0 &&
    !allOnPageSelected &&
    pageIds.some((id) => selectedIds.includes(id));

  const selectAllOnPage = () =>
    setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));

  const deselectAllOnPage = () =>
    setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));

  const clearSelection = () => setSelectedIds([]);

  const selectAllMatching = async () => {
    const { data } = await api.get<{ ids: number[]; total: number }>(
      "/clients/ids",
      {
        params: { q, limit: 10_000 },
      },
    );
    setSelectedIds(data.ids);
  };

  const deleteSelected = async (ids: number[]) => {
    try {
      const res = await delBulk.mutateAsync(ids);
      const { deleted, failed } = res;
      if (deleted)
        toast.success(`Deleted ${deleted} client${deleted > 1 ? "s" : ""}.`);
      if (failed.length) {
        const withOrders = failed.filter(
          (f) => f.reason === "has_orders",
        ).length;
        const notFound = failed.filter((f) => f.reason === "not_found").length;
        if (withOrders)
          toast.warning(`${withOrders} cannot be deleted (has orders).`);
        if (notFound) toast.warning(`${notFound} not found.`);
      }
      clearSelection();
      refetch();
    } catch {
      toast.error("Failed to delete clients.");
    }
  };

  const exportSelected = async (ids: number[]) => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const url = `${API}/clients/export/csv?q=${encodeURIComponent(q || "")}`;
    window.open(url, "_blank", "noopener");
  };

  if (isLoading) return <CenteredSpinner />;
  if (isError) return <p className="text-red-500">Failed to load Clients.</p>;

  return (
    <div className="space-y-4 rounded-md border border-muted p-4 shadow-sm bg-gradient-to-t from-primary/5">
      <BulkActionsToolbar
        selectedIds={selectedIds}
        totalMatching={total}
        onSelectAllPage={selectAllOnPage}
        onSelectAllMatching={selectAllMatching}
        onClearSelection={clearSelection}
        onDeleteSelected={deleteSelected}
        onExportSelected={exportSelected}
      />
      <ClientsToolbar
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
          <TableCaption className="text-left">All deliveries</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[36px]">
                <Checkbox
                  checked={
                    allOnPageSelected
                      ? true
                      : someOnPageSelected
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={(checked) => {
                    if (checked) selectAllOnPage();
                    else deselectAllOnPage();
                  }}
                  aria-label="Select all on page"
                />
              </TableHead>
              <TableHead className="w-[40px]">ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">CreatedAt</TableHead>
              <TableHead className="w-[56px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(data?.data ?? []).length === 0 && !isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              (data?.data ?? []).map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected(client.id)}
                      onCheckedChange={() => toggleOne(client.id)}
                      aria-label={`Select client ${client.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{client.id}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.name?.split("@")[0] || ""}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell className="text-right">
                    {formatDate(client.createdAt, {
                      dateStyle: "short",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <ClientActionsMenu client={client} />
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
                Showing{" "}
                {((data?.data ?? []).length && (page - 1) * pageSize + 1) || 0}–
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
