import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function range(from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Compact window like: 1 ... 4 5 [6] 7 8 ... 20
  const siblings = 1;
  const boundary = 1;

  const startPages = range(1, Math.min(boundary, totalPages));
  const endPages = range(
    Math.max(totalPages - boundary + 1, boundary + 1),
    totalPages,
  );
  const lower = Math.max(page - siblings, boundary + 1);
  const upper = Math.min(page + siblings, totalPages - boundary);
  const middle = lower <= upper ? range(lower, upper) : [];

  const pages: (number | "ellipsis")[] = [];
  pages.push(...startPages);
  if (lower > boundary + 1) pages.push("ellipsis");
  pages.push(...middle);
  if (upper < totalPages - boundary) pages.push("ellipsis");
  pages.push(...endPages);

  return (
    <UIPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.max(1, page - 1));
            }}
            className={
              page === 1 ? "pointer-events-none opacity-50" : undefined
            }
            aria-disabled={page === 1}
          />
        </PaginationItem>

        {pages.map((p, idx) => (
          <PaginationItem key={`${p}-${idx}`}>
            {p === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.min(totalPages, page + 1));
            }}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : undefined
            }
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}
