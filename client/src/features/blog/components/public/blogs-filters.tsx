"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BlogsFiltersProps {
  initialSearch?: string;
}

export function BlogsFilters({ initialSearch = "" }: BlogsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearchParam = searchParams.get("search") ?? "";

      // শুধুমাত্র তখনই রাউট রিপ্লে করবে যদি সার্চ ভ্যালু ইউআরএল-এর বর্তমান ভ্যালু থেকে আলাদা হয়
      if (search.trim() !== currentSearchParam.trim()) {
        const params = new URLSearchParams(searchParams.toString());
        if (search.trim()) params.set("search", search.trim());
        else params.delete("search");
        params.delete("page");

        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, pathname, router, searchParams]);

  return (
    <div className="mb-10 flex justify-center">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs..."
          className="pl-9"
          aria-label="Search blogs"
        />
      </div>
    </div>
  );
}
