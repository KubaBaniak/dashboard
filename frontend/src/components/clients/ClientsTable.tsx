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

export default function ClientsTable() {
  const { page, pageSize, q, set } = useUrlPagination();

  const { data, isLoading, isError } = useClientsBase({ page, pageSize, q });

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (isLoading) return <CenteredSpinner />;
  if (isError) return <p className="text-red-500">Failed to load Clients.</p>;

  return (
    <div className="space-y-4 rounded-md border border-muted p-4 shadow-sm bg-gradient-to-t from-primary/5">
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
            {rows.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((client) => (
                <TableRow key={client.id}>
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
