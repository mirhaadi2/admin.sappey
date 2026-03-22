import React from 'react';
import { CircleNotch, Warning } from '@phosphor-icons/react';

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
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
  striped = true,
}: TableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <CircleNotch size={32} className="text-amber-600 animate-spin" />
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-8 flex items-center gap-4 text-red-600 bg-red-50 border-t border-red-200">
          <Warning size={24} className="flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center text-slate-600">
          <p className="text-lg font-semibold">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    style={{ width: column.width }}
                    className={`px-6 py-3 text-sm font-semibold text-slate-900 ${alignStyles[column.align || 'left']}`}
                  >
                    {column.header}
                  </th>
                ))}
                {rowActions && (
                  <th className="px-6 py-3 text-sm font-semibold text-slate-900 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    striped && rowIndex % 2 === 0 ? 'bg-slate-50' : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-4 text-sm text-slate-900 ${alignStyles[column.align || 'left']}`}
                    >
                      {column.render ? column.render((row as any)[column.key], row) : (row as any)[column.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">{rowActions(row)}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
