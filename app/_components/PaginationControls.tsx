"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReactPaginate from "react-paginate";

type PaginationControlsProps = Readonly<{
  currentPage: number;
  pageCount: number;
}>;

export default function PaginationControls({
  currentPage,
  pageCount,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) {
    return null;
  }

  function handlePageChange({ selected }: { selected: number }) {
    const next = new URLSearchParams(searchParams.toString());
    const nextPage = selected + 1;

    if (nextPage <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(nextPage));
    }

    const href = next.toString() ? `${pathname}?${next.toString()}` : pathname;
    router.push(href, { scroll: false });
  }

  return (
    <nav aria-label="Product pagination" className="mt-10 flex justify-center">
      <ReactPaginate
        breakLabel="…"
        nextLabel={
          <span className="cursor-pointer flex items-center gap-1">
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        }
        previousLabel={
          <span className="cursor-pointer flex items-center gap-1">
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </span>
        }
        onPageChange={handlePageChange}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        forcePage={Math.max(0, currentPage - 1)}
        renderOnZeroPageCount={null}
        containerClassName="flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm"
        pageClassName="min-h-10"
        pageLinkClassName="flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        activeClassName=""
        activeLinkClassName="bg-slate-900 text-white"
        previousClassName=""
        previousLinkClassName="flex h-10 items-center gap-1 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        nextClassName=""
        nextLinkClassName="flex h-10 items-center gap-1 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        breakClassName=""
        breakLinkClassName="flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium text-slate-500"
      />
    </nav>
  );
}
