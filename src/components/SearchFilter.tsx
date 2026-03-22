import React from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { Button } from './Button';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterLabel?: string;
  searchPlaceholder?: string;
  onReset?: () => void;
  showResetButton?: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  filterOptions = [],
  filterValue = '',
  onFilterChange,
  filterLabel = 'Filter',
  searchPlaceholder = 'Search...',
  onReset,
  showResetButton = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {filterOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{filterLabel}</label>
            <select
              value={filterValue}
              onChange={(e) => onFilterChange?.(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={filterOptions.length > 0 ? 'flex items-end' : 'col-span-1 md:col-span-2'}>
          {showResetButton && (
            <Button
              variant="outline"
              size="md"
              onClick={onReset}
              fullWidth
              icon={<X size={16} />}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
