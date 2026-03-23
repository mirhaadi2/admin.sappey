import React from 'react';
import { CircleNotch, Package, Warning } from '@phosphor-icons/react';

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
  striped = false,
}: TableProps<T>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${alignStyles[column.align || 'left']}`}
                >
                  {column.header}
                </th>
              ))}
              {rowActions && (
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-20">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <CircleNotch size={32} className="text-blue-600 animate-spin" weight="bold" />
                    <span className="text-slate-500 font-medium">Syncing data...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="p-0">
                  <div className="m-4 p-4 rounded-lg flex items-center gap-3 text-red-600 bg-red-50 border border-red-100">
                    <Warning size={20} weight="fill" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package size={40} className="text-slate-300" />
                    <p className="text-slate-500 font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`group transition-colors hover:bg-blue-50/30 ${
                    striped && rowIndex % 2 !== 0 ? 'bg-slate-50/30' : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-4 text-sm text-slate-600 whitespace-nowrap ${alignStyles[column.align || 'left']}`}
                    >
                      {column.render 
                        ? column.render((row as any)[column.key], row) 
                        : (row as any)[column.key] || '-'}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {rowActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}