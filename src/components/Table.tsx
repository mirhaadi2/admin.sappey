import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  CircleNotch, 
  Package, 
  Warning, 
  MagnifyingGlass, 
  Funnel 
} from '@phosphor-icons/react';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: FilterOption[];
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  column?: boolean; // legacy support for `column: true|false` default visibility
  visible?: boolean; // explicit visibility default
}

interface TableProps<T extends { id: string | number }> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  rowActions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  filterConfig?: {
    searchPlaceholder?: string;
    filters?: FilterConfig[];
  };
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterValues?: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  showColumnSelector?: boolean;
  onVisibleColumnsChange?: (visibleColumns: (keyof T | string)[]) => void;
}

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Table<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  error = null,
  emptyMessage = 'No data found',
  rowActions,
  onRowClick,
  striped = false,
  filterConfig,
  searchValue = '',
  onSearchChange,
  filterValues = {},
  onFilterChange,
  showColumnSelector = true,
  onVisibleColumnsChange,
}: TableProps<T>) {
  const deriveInitialVisible = () =>
    columns
      .filter((c) => (c.visible ?? c.column ?? true) === true)
      .map((c) => c.key);

  const [visibleColumns, setVisibleColumns] = useState<(keyof T | string)[]>(() => deriveInitialVisible());
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const columnMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setVisibleColumns(deriveInitialVisible());
  }, [columns]);

  const displayedColumns = useMemo(
    () => columns.filter((c) => visibleColumns.includes(c.key)),
    [columns, visibleColumns]
  );

  useEffect(() => {
    onVisibleColumnsChange?.(visibleColumns);
  }, [visibleColumns, onVisibleColumnsChange]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!columnsMenuOpen) return;
      const target = event.target as Node;
      if (
        columnMenuRef.current &&
        !columnMenuRef.current.contains(target) &&
        columnMenuButtonRef.current &&
        !columnMenuButtonRef.current.contains(target)
      ) {
        setColumnsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [columnsMenuOpen]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible flex flex-col">
      {(filterConfig || onSearchChange || showColumnSelector) && (
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 min-w-[300px]">
            {showColumnSelector && (
              <div className="relative" ref={columnMenuRef}>
                <button
                  type="button"
                  ref={columnMenuButtonRef}
                  onClick={() => setColumnsMenuOpen((v) => !v)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
                >
                  Columns
                </button>
                {columnsMenuOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <div className="p-2 border-b border-slate-100">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={visibleColumns.length === columns.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setVisibleColumns(columns.map((c) => c.key));
                            } else {
                              setVisibleColumns([]);
                            }
                          }}
                        />
                        Select all
                      </label>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2">
                      {columns.map((col) => (
                        <label key={String(col.key)} className="flex items-center gap-2 text-sm py-1">
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(col.key)}
                            onChange={(e) => {
                              setVisibleColumns((current) => {
                                if (e.target.checked) {
                                  const next = [...current, col.key];
                                  return Array.from(new Set(next));
                                }
                                return current.filter((k) => k !== col.key);
                              });
                            }}
                          />
                          {col.header}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {onSearchChange && (
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder={filterConfig?.searchPlaceholder || "Search..."}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            )}
            {filterConfig?.filters?.map((filter) => (
              <div key={filter.key} className="flex items-center gap-2">
                {filter.type === 'select' && (
                  <select
                    className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    value={filterValues[filter.key] || 'all'}
                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  >
                    <option value="all">{filter.label}</option>
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
            <Funnel size={14} weight="bold" />
            <span>{data.length} Records</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              {displayedColumns.map((col) => (
                <th key={String(col.key)} style={{ width: col.width }} className={`px-6 py-4 text-xs font-bold uppercase text-slate-500 ${alignStyles[col.align || 'left']}`}>
                  {col.header}
                </th>
              ))}
              {rowActions && <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={10} className="py-20 text-center"><CircleNotch size={32} className="mx-auto text-blue-600 animate-spin" /></td></tr>
            ) : error ? (
              <tr><td colSpan={10} className="p-6"><div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div></td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={10} className="py-20 text-center text-slate-400">{emptyMessage}</td></tr>
            ) : displayedColumns.length === 0 ? (
              <tr><td colSpan={10} className="py-20 text-center text-slate-400">No columns selected. Use the Columns button to-show fields.</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id} className={`group hover:bg-blue-50/20 ${striped && idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                  {displayedColumns.map((col) => (
                    <td key={String(col.key)} className={`px-6 py-4 text-sm text-slate-600 ${alignStyles[col.align || 'left']}`}>
                      {col.render ? col.render((row as any)[col.key], row) : (row as any)[col.key] || '-'}
                    </td>
                  ))}
                  {rowActions && <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">{rowActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}