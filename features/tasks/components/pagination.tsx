"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({
  page,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(newPage: number) {
  if (newPage < 1 || newPage > totalPages) return;

  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(newPage));
  router.push(`${pathname}?${params.toString()}`);
}

  function getVisiblePages(): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      );
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages,
    ];
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
      >
        Previous
      </Button>

      {getVisiblePages().map((item, index) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-slate-500"
            >
              ...
            </span>
          );
        }

        return (
          <Button
            key={item}
            variant={item === page ? "default" : "outline"}
            onClick={() => goToPage(item)}
          >
            {item}
          </Button>
        );
      })}

      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}