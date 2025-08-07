// components/tours/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
  <div className="flex justify-center mt-8 gap-4">
    <button
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 hover:bg-gray-50"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 hover:bg-gray-50"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  </div>
);