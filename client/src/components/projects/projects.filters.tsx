"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectsFiltersProps {
  initialSearch?: string;
  initialFilter?: "all" | "featured";
}

export function ProjectsFilters({
  initialSearch = "",
  initialFilter = "all",
}: ProjectsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  // ডিবাউন্সড সার্চ লজিক (লুপ রোধ করতে বর্তমান ইউআরএল প্যারাম চেক করা হয়েছে)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearchParam = searchParams.get("search") ?? "";

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

  const setFilter = (value: "all" | "featured") => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") params.set("featured", "true");
    else params.delete("featured");
    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="mb-10 flex w-full flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
      <Tabs
        value={initialFilter}
        onValueChange={(value) => setFilter(value as "all" | "featured")}
        className="w-full sm:w-auto"
      >
        <TabsList className="h-11 w-full sm:h-10 sm:w-auto">
          <TabsTrigger value="all" className="min-h-11 flex-1 px-2 sm:min-h-0 sm:flex-none sm:px-3">
            All projects
          </TabsTrigger>
          <TabsTrigger value="featured" className="min-h-11 flex-1 px-2 sm:min-h-0 sm:flex-none sm:px-3">
            Featured
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-full min-w-0 sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="pl-9"
          aria-label="Search projects"
        />
      </div>
    </div>
  );
}
