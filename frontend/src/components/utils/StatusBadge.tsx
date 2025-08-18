import { OrderStatus } from "../orders/types";
import { Badge } from "../ui/badge";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
    PAID: "bg-green-100 text-green-800 dark:bg-green-900/30",
    SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30",
  };
  return <Badge className={map[status]}>{status}</Badge>;
}
