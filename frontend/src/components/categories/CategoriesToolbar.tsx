"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateCategoryDialog from "./CreateCategoryDialog";

interface ToolbarProps {
  pageSize: number;
  onPageSizeChange: (n: number) => void;
  query: string;
  onQueryChange: (s: string) => void;
}

export default function CategoriesToolbar({
  pageSize,
  onPageSizeChange,
  query,
  onQueryChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">Categories</h2>
        <p className="text-sm text-muted-foreground">
          Browse and manage your categories.
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
              {[10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          placeholder="Search by name or description…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full sm:w-[280px]"
        />

        <CreateCategoryDialog />
      </div>
    </div>
  );
}
