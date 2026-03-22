import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, limit, total, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
      <p className="text-sm text-slate-600">
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{total}</span> results
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={page === 1}
          icon={<CaretLeft size={16} />}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50">
          <span className="text-sm font-medium text-slate-700">
            Page {page} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page >= totalPages}
          icon={<CaretRight size={16} />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
