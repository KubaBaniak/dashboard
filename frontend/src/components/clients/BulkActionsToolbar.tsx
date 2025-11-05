"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Download, Trash2, X } from "lucide-react";

type Props = {
  selectedIds: number[];
  totalMatching?: number;
  onSelectAllPage?: () => void;
  onSelectAllMatching?: () => void;
  onClearSelection: () => void;
  onDeleteSelected?: (ids: number[]) => Promise<void> | void;
  onExportSelected?: (ids: number[]) => Promise<void> | void;
  busy?: boolean;
  children?: React.ReactNode;
};

export default function BulkActionsToolbar({
  selectedIds,
  totalMatching,
  onSelectAllPage,
  onSelectAllMatching,
  onClearSelection,
  onDeleteSelected,
  onExportSelected,
  busy = false,
  children,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const count = selectedIds.length;
  const hasSelection = count > 0;
  const canSelectAllMatching =
    typeof totalMatching === "number" && totalMatching > count;

  return (
    <div
      className={[
        // container
        "rounded-lg border border-muted bg-card/50",
        // padding responsive
        "p-2 sm:p-3",
        // layout: stack on mobile, align on larger screens
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
      ].join(" ")}
    >
      {/* Left side: selection info + select helpers */}
      <div
        className={[
          "flex min-w-0 items-center gap-1.5 sm:gap-2",
          // allow wrapping and horizontal scroll on tiny screens
          "flex-wrap",
        ].join(" ")}
      >
        <Badge
          variant={hasSelection ? "default" : "secondary"}
          className="text-xs sm:text-sm"
        >
          {count} selected
        </Badge>

        {onSelectAllPage ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 sm:px-3"
            disabled={busy}
            onClick={onSelectAllPage}
          >
            <span className="truncate text-xs sm:text-sm">
              Select all on page
            </span>
          </Button>
        ) : null}

        {canSelectAllMatching && onSelectAllMatching ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 sm:px-3"
            disabled={busy}
            onClick={onSelectAllMatching}
          >
            <span className="truncate text-xs sm:text-sm">
              Select all {totalMatching} results
            </span>
          </Button>
        ) : null}

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 sm:px-3"
          onClick={onClearSelection}
          disabled={!hasSelection || busy}
          aria-label="Clear selection"
        >
          <X className="mr-1 sm:mr-2 h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      {/* Right side: primary actions */}
      <div
        className={[
          "flex items-center gap-1.5 sm:gap-2",
          // make buttons stretch on very small screens if needed
          "flex-wrap justify-end",
        ].join(" ")}
      >
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 sm:px-3"
          disabled={!hasSelection || busy || !onExportSelected}
          onClick={() => onExportSelected?.(selectedIds)}
          aria-label="Export selected"
        >
          <Download className="mr-1 sm:mr-2 h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-2 sm:px-3"
              disabled={!hasSelection || busy || !onDeleteSelected}
              aria-label="Delete selected"
            >
              <Trash2 className="mr-1 sm:mr-2 h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {count} item{count === 1 ? "" : "s"}?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={busy}
                onClick={async () => {
                  await onDeleteSelected?.(selectedIds);
                  setConfirmOpen(false);
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {children}
      </div>
    </div>
  );
}
