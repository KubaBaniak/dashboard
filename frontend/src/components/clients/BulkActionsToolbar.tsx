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
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-md border border-muted p-3">
      {/* Left side: selection info */}
      <div className="flex items-center gap-2">
        <Badge variant={hasSelection ? "default" : "secondary"}>
          {count} selected
        </Badge>

        {onSelectAllPage ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            disabled={busy}
            onClick={onSelectAllPage}
          >
            Select all on page
          </Button>
        ) : null}

        {canSelectAllMatching && onSelectAllMatching ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            disabled={busy}
            onClick={onSelectAllMatching}
          >
            Select all {totalMatching} results
          </Button>
        ) : null}

        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={onClearSelection}
          disabled={!hasSelection || busy}
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasSelection || busy || !onExportSelected}
          onClick={() => onExportSelected?.(selectedIds)}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={!hasSelection || busy || !onDeleteSelected}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
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
