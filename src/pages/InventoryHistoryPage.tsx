import React, { useState } from "react";
import { Clock, Package, User, Tag } from "@phosphor-icons/react";
import {
    useAdminInventoryHistory,
    AdminInventoryHistoryItem,
} from "@/api/exports";
import { Table, Pagination, Badge, Card } from "@/components";

function InventoryHistoryPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [filters, setFilters] = useState<Record<string, any>>({});

    const {
        data: historyData,
        isLoading,
        error,
    } = useAdminInventoryHistory({
        page,
        limit,
        ...filters,
    });

    const getHistoryTypeColor = (type: string) => {
        switch (type) {
            case 'STOCK_ADDED':
                return 'success';
            case 'STOCK_REMOVED':
                return 'danger';
            case 'ADJUSTMENT':
                return 'warning';
            case 'SALE':
                return 'info';
            case 'RETURN':
                return 'default';
            default:
                return 'default';
        }
    };

    const getHistoryTypeLabel = (type: string) => {
        switch (type) {
            case 'STOCK_ADDED':
                return 'Stock Added';
            case 'STOCK_REMOVED':
                return 'Stock Removed';
            case 'ADJUSTMENT':
                return 'Adjustment';
            case 'SALE':
                return 'Sale';
            case 'RETURN':
                return 'Return';
            default:
                return type;
        }
    };

    const columns = [
        {
            key: "createdAt",
            header: "Date & Time",
            width: "180px",
            column: true,
            render: (date: string) => (
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">
                        {new Date(date).toLocaleString()}
                    </span>
                </div>
            ),
        },
        {
            key: "type",
            header: "Action",
            width: "140px",
            column: true,
            render: (type: string) => (
                <Badge variant={getHistoryTypeColor(type)}>
                    {getHistoryTypeLabel(type)}
                </Badge>
            ),
        },
        {
            key: "productName",
            header: "Product",
            width: "200px",
            column: true,
            render: (name: string, item: AdminInventoryHistoryItem) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{name}</span>
                    <span className="text-xs text-slate-500">SKU: {item.sellerSku}</span>
                </div>
            ),
        },
        {
            key: "sellerName",
            header: "Seller",
            width: "150px",
            column: true,
            render: (name: string) => (
                <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <span className="text-slate-700">{name}</span>
                </div>
            ),
        },
        {
            key: "quantity",
            header: "Quantity",
            align: "center" as const,
            column: true,
            render: (quantity: number, item: AdminInventoryHistoryItem) => {
                const isPositive = quantity > 0;
                return (
                    <div className={`flex items-center justify-center gap-1 font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {isPositive ? '+' : ''}{quantity}
                    </div>
                );
            },
        },
        {
            key: "previousStock",
            header: "Previous Stock",
            align: "center" as const,
            column: true,
            render: (stock: number) => (
                <span className="font-medium text-slate-600">{stock}</span>
            ),
        },
        {
            key: "newStock",
            header: "New Stock",
            align: "center" as const,
            column: true,
            render: (stock: number) => (
                <span className="font-semibold text-slate-900">{stock}</span>
            ),
        },
        {
            key: "reference",
            header: "Reference",
            width: "120px",
            column: true,
            render: (reference: string) => reference ? (
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    {reference}
                </span>
            ) : (
                <span className="text-slate-400">-</span>
            ),
        },
        {
            key: "notes",
            header: "Notes",
            column: true,
            render: (notes: string) => notes ? (
                <div className="max-w-xs truncate text-sm text-slate-600" title={notes}>
                    {notes}
                </div>
            ) : (
                <span className="text-slate-400">-</span>
            ),
        },
    ];

    const historyFilterConfig = {
        filters: [
            {
                key: "productId",
                label: "Product ID",
                type: "text" as const,
                placeholder: "Enter product ID",
            },
            {
                key: "sellerId",
                label: "Seller ID",
                type: "text" as const,
                placeholder: "Enter seller ID",
            },
            {
                key: "inventoryId",
                label: "Inventory ID",
                type: "text" as const,
                placeholder: "Enter inventory ID",
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Inventory History</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Complete audit trail of all inventory changes and transactions
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            {historyData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Package className="text-blue-600" size={20} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Records</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {historyData.pagination.total.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Tag className="text-green-600" size={20} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">Stock Additions</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {historyData.data.filter(h => h.type === 'STOCK_ADDED').length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <Clock className="text-red-600" size={20} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">Stock Removals</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {historyData.data.filter(h => h.type === 'STOCK_REMOVED').length}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* History Table */}
            <Table<AdminInventoryHistoryItem>
                data={historyData?.data || []}
                columns={columns}
                isLoading={isLoading}
                error={error ? (error as any).message : null}
                filterConfig={historyFilterConfig}
                filterValues={filters}
                onFilterChange={(k, v) => {
                    setFilters({ ...filters, [k]: v });
                    setPage(1);
                }}
                emptyMessage="No inventory history found"
            />

            <Pagination
                page={page}
                limit={limit}
                total={historyData?.pagination?.total || 0}
                onPageChange={(newPage) => setPage(newPage)}
                onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                }}
            />
        </div>
    );
}

export default InventoryHistoryPage;