import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";

interface OrdersToolbarProps {
  pageSize: number;
  onPageSizeChange: (n: number) => void;
  query: string;
  onQueryChange: (s: string) => void;
  status: string;
  onStatusChange: (s: string) => void;
  pageSizeOptions?: number[];
}

export default function OrdersToolbar({
  pageSize,
  onPageSizeChange,
  query,
  onQueryChange,
  status,
  onStatusChange,
  pageSizeOptions = [10, 20, 50],
}: OrdersToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-sm text-muted-foreground">
          All customer orders with totals.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(parseInt(v))}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search by buyer, email, order id…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full sm:w-[280px]"
        />
      </div>
    </div>
  );
}
