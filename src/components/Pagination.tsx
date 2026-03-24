import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limits?: number[];
}

const getPageNumbers = (currentPage: number, totalPages: number): number[] => {
  const range = 2;
  const pages = [];

  for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
    pages.push(i);
  }

  if (pages[0] !== 1) pages.unshift(1);
  if (pages[0] !== 2 && pages[0] !== 1) pages.unshift(2);

  if (pages[pages.length - 1] !== totalPages) pages.push(totalPages);

  return pages;
};

export const Pagination: React.FC<PaginationProps> = ({ page, limit, total, onPageChange, onLimitChange, limits = [10, 20, 50, 100] }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <p className="text-sm text-slate-600">
        Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{total}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Rows:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
            className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {limits.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={handlePrevious} disabled={page === 1} icon={<CaretLeft size={16} />}>Prev</Button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`px-3 py-1 rounded-md text-sm ${pageNumber === page ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'} ${pageNumber === 1 || pageNumber === totalPages ? 'font-bold' : ''}`}
              onClick={() => onPageChange(pageNumber)}
              disabled={pageNumber === page}
            >
              {pageNumber}
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={handleNext} disabled={page >= totalPages} icon={<CaretRight size={16} />}>Next</Button>
        </div>
      </div>
    </div>
  );
};
