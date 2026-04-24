import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Package, TrendUp, TrendDown, Warning, ChartBar } from "@phosphor-icons/react";
import {
    useAdminInventoryList,
    useAdminInventoryStats,
    useAdminUpdateInventory,
    useAdminAddStock,
    useAdminRemoveStock,
    AdminInventoryItem,
    AdminInventoryStats,
} from "@/api/exports";
import { Button, Table, Pagination, ConfirmDialog, Badge, Card } from "@/components";

function InventoryPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<Record<string, any>>({
        lowStock: false,
    });
    const [selectedInventory, setSelectedInventory] = useState<AdminInventoryItem | null>(null);
    const [showAddStockDialog, setShowAddStockDialog] = useState(false);
    const [showRemoveStockDialog, setShowRemoveStockDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [stockQuantity, setStockQuantity] = useState("");
    const [stockNotes, setStockNotes] = useState("");
    const [removeReason, setRemoveReason] = useState("");
    const [updateData, setUpdateData] = useState({
        totalStock: "",
        reorderLevel: "",
        notes: "",
    });

    // Queries
    const {
        data: inventoryData,
        isLoading,
        error,
    } = useAdminInventoryList({
        page,
        limit,
        search: search || undefined,
        lowStock: filters.lowStock,
    });

    const { data: statsData } = useAdminInventoryStats();

    // Mutations
    const { mutate: updateInventory, isPending: isUpdating } = useAdminUpdateInventory();
    const { mutate: addStock, isPending: isAddingStock } = useAdminAddStock();
    const { mutate: removeStock, isPending: isRemovingStock } = useAdminRemoveStock();

    // Handlers
    const handleAddStock = () => {
        if (!selectedInventory || !stockQuantity) return;

        addStock({
            inventoryId: selectedInventory.id,
            data: {
                quantity: parseInt(stockQuantity),
                notes: stockNotes || undefined,
            }
        }, {
            onSuccess: () => {
                setShowAddStockDialog(false);
                setStockQuantity("");
                setStockNotes("");
                setSelectedInventory(null);
            }
        });
    };

    const handleRemoveStock = () => {
        if (!selectedInventory || !stockQuantity || !removeReason) return;

        removeStock({
            inventoryId: selectedInventory.id,
            data: {
                quantity: parseInt(stockQuantity),
                reason: removeReason,
                notes: stockNotes || undefined,
            }
        }, {
            onSuccess: () => {
                setShowRemoveStockDialog(false);
                setStockQuantity("");
                setRemoveReason("");
                setStockNotes("");
                setSelectedInventory(null);
            }
        });
    };

    const handleUpdateInventory = () => {
        if (!selectedInventory) return;

        const data: any = {
            notes: updateData.notes || undefined,
        };

        if (updateData.totalStock) {
            data.totalStock = parseInt(updateData.totalStock);
        }

        if (updateData.reorderLevel) {
            data.reorderLevel = parseInt(updateData.reorderLevel);
        }

        updateInventory({
            inventoryId: selectedInventory.id,
            data,
        }, {
            onSuccess: () => {
                setShowUpdateDialog(false);
                setUpdateData({ totalStock: "", reorderLevel: "", notes: "" });
                setSelectedInventory(null);
            }
        });
    };

    const getStockStatus = (item: AdminInventoryItem) => {
        if (item.availableStock <= item.reorderLevel) {
            return { status: "low", label: "Low Stock", color: "danger" as const };
        }
        if (item.availableStock === 0) {
            return { status: "out", label: "Out of Stock", color: "danger" as const };
        }
        return { status: "good", label: "In Stock", color: "success" as const };
    };

    const inventoryFilterConfig = {
        searchPlaceholder: "Search by product name, seller, or SKU...",
        filters: [
            {
                key: "lowStock",
                label: "Stock Status",
                type: "select" as const, // Changed from checkbox
                options: [
                    { label: "Show Low Stock Only", value: "true" },
                    { label: "Show All", value: "false" }
                ]
            },
        ],
    };

    const columns = [
        {
            key: "productName",
            header: "Product",
            width: "250px",
            column: true,
            render: (name: string, item: AdminInventoryItem) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{name}</span>
                    <span className="text-xs text-slate-500">SKU: {item.sku}</span>
                </div>
            ),
        },
        {
            key: "sellerName",
            header: "Seller",
            width: "180px",
            column: true,
            render: (name: string) => (
                <span className="text-slate-700">{name}</span>
            ),
        },
        {
            key: "totalStock",
            header: "Total Stock",
            align: "center" as const,
            column: true,
            render: (stock: number) => (
                <span className="font-semibold text-slate-700">{stock}</span>
            ),
        },
        {
            key: "availableStock",
            header: "Available",
            align: "center" as const,
            column: true,
            render: (stock: number, item: AdminInventoryItem) => {
                const status = getStockStatus(item);
                return (
                    <Badge variant={status.color} className="font-semibold">
                        {stock}
                    </Badge>
                );
            },
        },
        {
            key: "reservedStock",
            header: "Reserved",
            align: "center" as const,
            column: true,
            render: (stock: number) => (
                <span className="text-slate-600">{stock}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            align: "center" as const,
            column: true,
            render: (_: any, item: AdminInventoryItem) => {
                const status = getStockStatus(item);
                return (
                    <Badge variant={status.color}>
                        {status.label}
                    </Badge>
                );
            },
        },
        {
            key: "reorderLevel",
            header: "Reorder Level",
            align: "center" as const,
            column: true,
            render: (level: number) => (
                <span className="text-slate-600">{level}</span>
            ),
        },
    ];

    const stats = statsData;

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Inventory Management</h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Monitor and manage product inventory across all sellers
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        icon={<ChartBar weight="bold" />}
                        onClick={() => navigate('/inventory/history')}
                    >
                        View History
                    </Button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Package className="text-blue-600" size={20} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Total Items</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.totalItems.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <TrendUp className="text-green-600" size={20} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Available Stock</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.availableStock.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <TrendDown className="text-orange-600" size={20} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Sold Stock</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.soldStock.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                    <Warning className="text-red-600" size={20} weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.lowStockItems.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Inventory Table */}
                <Table<AdminInventoryItem>
                    data={inventoryData?.data || []}
                    columns={columns}
                    isLoading={isLoading}
                    error={error ? (error as any).message : null}
                    filterConfig={inventoryFilterConfig}
                    searchValue={search}
                    onSearchChange={(v) => {
                        setSearch(v);
                        setPage(1);
                    }}
                    filterValues={filters}
                    onFilterChange={(k, v) => {
                        setFilters({ ...filters, [k]: v });
                        setPage(1);
                    }}
                    rowActions={(item) => (
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<Eye />}
                                onClick={() => navigate(`/inventory/${item.id}`)}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<Plus />}
                                onClick={() => {
                                    setSelectedInventory(item);
                                    setShowAddStockDialog(true);
                                }}
                            >
                                Add Stock
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<TrendDown />}
                                onClick={() => {
                                    setSelectedInventory(item);
                                    setShowRemoveStockDialog(true);
                                }}
                            >
                                Remove Stock
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    setSelectedInventory(item);
                                    setUpdateData({
                                        totalStock: item.totalStock.toString(),
                                        reorderLevel: item.reorderLevel.toString(),
                                        notes: "",
                                    });
                                    setShowUpdateDialog(true);
                                }}
                            >
                                Update
                            </Button>
                        </div>
                    )}
                />

                <Pagination
                    page={page}
                    limit={limit}
                    total={inventoryData?.pagination?.total || 0}
                    onPageChange={(newPage) => setPage(newPage)}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                />
            </div>

            {/* Add Stock Dialog */}
            <ConfirmDialog
                isOpen={showAddStockDialog}
                title="Add Stock"
                description={`Add stock to ${selectedInventory?.productName} (${selectedInventory?.sku})`}
                confirmText="Add Stock"
                isLoading={isAddingStock}
                onConfirm={handleAddStock}
                onCancel={() => {
                    setShowAddStockDialog(false);
                    setStockQuantity("");
                    setStockNotes("");
                    setSelectedInventory(null);
                }}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Quantity to Add
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quantity"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={stockNotes}
                            onChange={(e) => setStockNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add notes about this stock addition"
                            rows={3}
                        />
                    </div>
                </div>
            </ConfirmDialog>

            {/* Remove Stock Dialog */}
            <ConfirmDialog
                isOpen={showRemoveStockDialog}
                title="Remove Stock"
                description={`Remove stock from ${selectedInventory?.productName} (${selectedInventory?.sku})`}
                confirmText="Remove Stock"
                isLoading={isRemovingStock}
                onConfirm={handleRemoveStock}
                onCancel={() => {
                    setShowRemoveStockDialog(false);
                    setStockQuantity("");
                    setRemoveReason("");
                    setStockNotes("");
                    setSelectedInventory(null);
                }}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Quantity to Remove
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={selectedInventory?.availableStock}
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quantity"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Reason for Removal
                        </label>
                        <select
                            value={removeReason}
                            onChange={(e) => setRemoveReason(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a reason</option>
                            <option value="damaged">Damaged Goods</option>
                            <option value="expired">Expired Products</option>
                            <option value="returned">Customer Returns</option>
                            <option value="theft">Theft/Loss</option>
                            <option value="adjustment">Inventory Adjustment</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={stockNotes}
                            onChange={(e) => setStockNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add notes about this stock removal"
                            rows={3}
                        />
                    </div>
                </div>
            </ConfirmDialog>

            {/* Update Inventory Dialog */}
            <ConfirmDialog
                isOpen={showUpdateDialog}
                title="Update Inventory"
                description={`Update inventory for ${selectedInventory?.productName} (${selectedInventory?.sku})`}
                confirmText="Update Inventory"
                isLoading={isUpdating}
                onConfirm={handleUpdateInventory}
                onCancel={() => {
                    setShowUpdateDialog(false);
                    setUpdateData({ totalStock: "", reorderLevel: "", notes: "" });
                    setSelectedInventory(null);
                }}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Total Stock
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={updateData.totalStock}
                            onChange={(e) => setUpdateData(prev => ({ ...prev, totalStock: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter total stock"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Reorder Level
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={updateData.reorderLevel}
                            onChange={(e) => setUpdateData(prev => ({ ...prev, reorderLevel: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter reorder level"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={updateData.notes}
                            onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add notes about this update"
                            rows={3}
                        />
                    </div>
                </div>
            </ConfirmDialog>
        </>
    );
}

export default InventoryPage;