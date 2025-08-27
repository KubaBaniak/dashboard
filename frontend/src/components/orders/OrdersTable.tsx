import { useState } from "react";
import OrdersToolbar from "./Toolbar";
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
import { formatCurrency } from "../utils/format-currency";
import { Button } from "../ui/button";
import Pagination from "../Pagination";
import { useOrders } from "@/hooks/orders/useOrders";
import UpdateStatusDropdown from "./UpdateStatusDropdown";
import OrderItemsDialog from "./OrderItemsDialog";

export default function OrdersTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [itemsOpenFor, setItemsOpenFor] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useOrders({
    page,
    pageSize,
    q,
    status,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4 rounded-md border border-muted p-4 shadow-sm bg-gradient-to-t from-primary/5">
      <OrdersToolbar
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
        status={status}
        onStatusChange={(s) => {
          setStatus(s);
          setPage(1);
        }}
      />

      <div className="overflow-auto">
        <Table>
          <TableCaption className="text-left">All orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[56px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-red-600"
                >
                  Failed to load orders.
                </TableCell>
              </TableRow>
            ) : data && data.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((o) => {
                const d = new Date(o.createdAt);
                const date = new Intl.DateTimeFormat("pl-PL", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                }).format(d);
                const totalNumber = Number(o.totalAmount);
                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{o.buyerName ?? o.buyerEmail}</TableCell>
                    <TableCell>
                      <UpdateStatusDropdown status={o.status} orderId={o.id} />
                    </TableCell>
                    <TableCell className="font-medium">
                      <button
                        className="underline underline-offset-4 hover:text-primary"
                        onClick={() => setItemsOpenFor(o.id)}
                      >
                        #{o.id}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totalNumber, "pl-PL", "PLN")}
                    </TableCell>
                    <TableCell className="text-center">ACTIONS</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="font-semibold">
                Page {page} of {totalPages}
              </TableCell>
              <TableCell colSpan={2} className="text-right">
                <Button variant="ghost" size="sm" onClick={() => refetch()}>
                  Refresh
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">
            {total === 0 ? 0 : (page - 1) * pageSize + 1}
          </span>
          –
          <span className="font-medium">
            {Math.min(page * pageSize, total)}
          </span>{" "}
          of <span className="font-medium">{total}</span>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {itemsOpenFor != null && (
        <OrderItemsDialog
          orderId={itemsOpenFor}
          open={itemsOpenFor != null}
          onOpenChange={(v) => !v && setItemsOpenFor(null)}
        />
      )}
    </div>
  );
}
