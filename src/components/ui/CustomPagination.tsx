import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface PaginationDemoProps {
  totalPages: number;
  isLoader?:boolean;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  totalPages,
  isLoader,
  onPageChange
}: PaginationDemoProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState<number | null>(null);
  const visiblePages = 5;

  const goToPage = async (page: number) => {
    setCurrentPage(page);
    setLoadingPage(page);
    onPageChange(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button onClick={handlePrevious} disabled={currentPage === 1} >
            Previous
          </Button>
        </PaginationItem>

        {startPage > 1 && (
          <>
            <PaginationItem>
              <Button onClick={() => goToPage(1)} variant="outline" >
                1
              </Button>
            </PaginationItem>
            {startPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Pages dynamiques */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <Button
              onClick={() => goToPage(page)}
              variant={currentPage === page ? "default" : "outline"}
              isLoader={loadingPage === page ? isLoader : false}
            >
              {page}
            </Button>
          </PaginationItem>
        ))}

        {/* Dernier élément (page finale) */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <Button onClick={() => goToPage(totalPages)} variant="outline" >
                {totalPages}
              </Button>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <Button onClick={handleNext} disabled={currentPage === totalPages} >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
