import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  isDark?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isDark = false,
}) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) {
    if (totalItems === 0) return null;
  }

  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page number array with ellipsis if needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 border-t ${
      isDark ? 'border-[#D4A72C]/20 text-[#FFF7E8]' : 'border-[#D4A72C]/30 text-[#32070B]'
    }`}>
      {/* Items Count & Per Page Selector */}
      <div className="flex items-center gap-3 text-xs font-semibold">
        <span>
          Showing <strong className="font-bold text-[#E87516]">{startItem}</strong> to{' '}
          <strong className="font-bold text-[#E87516]">{endItem}</strong> of{' '}
          <strong className="font-bold">{totalItems}</strong> entries
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[11px] opacity-70">Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              className={`text-xs font-bold rounded-lg px-2 py-1 border transition-colors outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#170204] border-[#D4A72C]/40 text-[#F4B942]'
                  : 'bg-white border-[#D4A72C]/50 text-[#32070B] shadow-sm'
              }`}
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
            currentPage === 1
              ? 'opacity-40 cursor-not-allowed border-gray-300'
              : 'hover:bg-[#5A0F16] hover:text-[#F4B942] hover:border-[#F4B942] border-[#D4A72C]/40'
          } ${isDark ? 'bg-[#170204]' : 'bg-white shadow-sm'}`}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center border ${
                  currentPage === page
                    ? 'bg-[#5A0F16] text-[#F4B942] border-[#F4B942] shadow-md scale-105'
                    : isDark
                    ? 'bg-[#170204] border-[#D4A72C]/30 text-[#FFF7E8]/80 hover:border-[#F4B942] hover:text-[#F4B942]'
                    : 'bg-white border-[#D4A72C]/40 text-[#32070B] hover:border-[#5A0F16] hover:bg-amber-50 shadow-sm'
                }`}
              >
                {page}
              </button>
            ) : (
              <span className="px-1 text-xs opacity-50 font-bold">...</span>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
            currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed border-gray-300'
              : 'hover:bg-[#5A0F16] hover:text-[#F4B942] hover:border-[#F4B942] border-[#D4A72C]/40'
          } ${isDark ? 'bg-[#170204]' : 'bg-white shadow-sm'}`}
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
