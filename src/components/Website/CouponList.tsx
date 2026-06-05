import React from 'react';
import { Plus, Pencil, Trash, Ticket } from '@phosphor-icons/react';
import { Card, CardBody, Button, Badge, Toggle } from '../index';
import { Coupon } from '@/api/admin/website';
// import { Coupon } from '@/api/admin';


interface CouponListProps {
    coupons: Coupon[];
    isLoading?: boolean;
    onAdd: () => void;
    onEdit: (coupon: Coupon) => void;
    onDelete: (id: string, code: string) => void;
    onToggle: (coupon: Coupon) => void;
}

export const CouponList: React.FC<CouponListProps> = ({
    coupons,
    isLoading,
    onAdd,
    onEdit,
    onDelete,
    onToggle,
}) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const getCouponTypeLabel = (type: Coupon['type']) => {
        const typeMap: Record<Coupon['type'], string> = {
            fixed_discount: 'Fixed Discount',
            percentage_discount: 'Percentage Discount',
            free_shipping: 'Free Shipping',
            free_order: 'Free Order'
        };
        return typeMap[type] || type;
    };

    const getCouponValue = (coupon: Coupon) => {
        if (coupon.type === 'free_shipping') return 'Free Shipping';
        if (coupon.discountValue) {
            return coupon.type === 'percentage_discount'
                ? `${coupon.discountValue}%`
                : `₹${coupon.discountValue}`;
        }
        return '-';
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="primary" icon={<Plus size={16} />} onClick={onAdd}>
                    Add Coupon
                </Button>
            </div>

            {coupons.length === 0 ? (
                <div className="text-center py-12">
                    <Ticket size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
                    <p className="text-gray-600">Create your first coupon code to offer discounts to customers.</p>
                </div>
            ) : (
                coupons?.map((coupon) => {
                    const isExpired = new Date(coupon.validUntil) < new Date();
                    const isNotYetActive = new Date(coupon.validFrom) > new Date();

                    return (
                        <Card key={coupon.id}>
                            <CardBody>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{coupon.code}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{coupon.title}</p>
                                                {coupon.description && <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Type</span>
                                                <div className="mt-1">
                                                    <Badge variant="default">{getCouponTypeLabel(coupon.type)}</Badge>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Value</span>
                                                <p className="text-gray-600 mt-1">{getCouponValue(coupon)}</p>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Min Order Value</span>
                                                <p className="text-gray-600 mt-1">
                                                    {coupon.minOrderValue ? `₹${coupon.minOrderValue}` : '-'}
                                                </p>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Usage</span>
                                                <p className="text-gray-600 mt-1">
                                                    {coupon.currentUsage}/{coupon.usageLimit || '∞'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Valid Period</span>
                                                <p className="text-gray-600 mt-1">
                                                    {new Date(coupon.validFrom).toLocaleDateString()} -{' '}
                                                    {new Date(coupon.validUntil).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Status</span>
                                                <div className="mt-1">
                                                    {isExpired ? (
                                                        <Badge variant="danger">Expired</Badge>
                                                    ) : isNotYetActive ? (
                                                        <Badge variant="warning">Upcoming</Badge>
                                                    ) : (
                                                        <Badge variant="success">Active</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Per User Limit</span>
                                                <p className="text-gray-600 mt-1">{coupon.perUserLimit || 'Unlimited'}</p>
                                            </div>
                                        </div>

                                        {coupon.firstOrderOnly && (
                                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                                                <p className="text-xs font-medium text-blue-800">✓ First Order Only</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <Toggle
                                            isActive={coupon.isActive}
                                            onClick={() => onToggle(coupon)}
                                            activeLabel="On"
                                            inactiveLabel="Off"
                                            className="grow-0"
                                        />
                                        <button
                                            onClick={() => onEdit(coupon)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(coupon.id, coupon.code)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    );
                })
            )}
        </div>
    );
};

export default CouponList;
