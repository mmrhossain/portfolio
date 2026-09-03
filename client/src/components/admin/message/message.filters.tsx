"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MessageFiltersProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function MessageFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: MessageFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      <div className="relative w-full min-w-0 sm:w-64">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          placeholder="Search messages..."
          className="pl-10 h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="h-11 w-full rounded-xl bg-background/50 border-border/80 focus:ring-1 focus:ring-primary sm:w-40">
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="rounded-xl">
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="NEW">New</SelectItem>
          <SelectItem value="READ">Read</SelectItem>
          <SelectItem value="REPLIED">Replied</SelectItem>
          <SelectItem value="ARCHIVED">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
