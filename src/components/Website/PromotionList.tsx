import React from 'react';
import { Plus, Pencil, Trash, Gift } from '@phosphor-icons/react';
import { Card, CardBody, Button, Badge, Toggle } from '../index';
import { Promotion } from '@/api/admin';


interface PromotionListProps {
    promotions: Promotion[];
    isLoading?: boolean;
    onAdd: () => void;
    onEdit: (promotion: Promotion) => void;
    onDelete: (id: string, title: string) => void;
    onToggle: (promotion: Promotion) => void;
}

export const PromotionList: React.FC<PromotionListProps> = ({
    promotions,
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

    const getPromotionTypeLabel = (type: Promotion['type']) => {
        const typeMap: Record<Promotion['type'], string> = {
            fixed_discount: 'Fixed Discount',
            percentage_discount: 'Percentage Discount',
            free_gift: 'Free Gift',
            free_shipping: 'Free Shipping',
            bundle: 'Bundle Deal',
            tiered: 'Tiered Pricing',
        };
        return typeMap[type] || type;
    };

    const getPromotionValue = (promo: Promotion) => {
        if (promo.type === 'free_gift') return promo.freeText;
        if (promo.discountValue) {
            return promo.type === 'percentage_discount'
                ? `${promo.discountValue}%`
                : `₹${promo.discountValue}`;
        }
        return '-';
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="primary" icon={<Plus size={16} />} onClick={onAdd}>
                    Add Promotion
                </Button>
            </div>

            {promotions.length === 0 ? (
                <div className="text-center py-12">
                    <Gift size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions yet</h3>
                    <p className="text-gray-600">Create your first promotional offer to attract customers.</p>
                </div>
            ) : (
                promotions?.map((promotion) => {
                    const isExpired = new Date(promotion.validUntil) < new Date();
                    const isNotYetActive = new Date(promotion.validFrom) > new Date();

                    return (
                        <Card key={promotion.id}>
                            <CardBody>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{promotion.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{promotion.bannerText}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Type</span>
                                                <div className="mt-1">
                                                    <Badge variant="default">{getPromotionTypeLabel(promotion.type)}</Badge>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Value</span>
                                                <p className="text-gray-600 mt-1">{getPromotionValue(promotion)}</p>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Min Order Value</span>
                                                <p className="text-gray-600 mt-1">
                                                    {promotion.minOrderValue ? `₹${promotion.minOrderValue}` : '-'}
                                                </p>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Priority</span>
                                                <p className="text-gray-600 mt-1">{promotion.priority}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Valid Period</span>
                                                <p className="text-gray-600 mt-1">
                                                    {new Date(promotion.validFrom).toLocaleDateString()} -{' '}
                                                    {new Date(promotion.validUntil).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Usage</span>
                                                <p className="text-gray-600 mt-1">
                                                    {promotion.currentUsage} {promotion.usageLimit ? `/ ${promotion.usageLimit}` : ''}
                                                </p>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Display On</span>
                                                <p className="text-gray-600 mt-1">
                                                    {[
                                                        promotion.displayOnHomepage && 'Homepage',
                                                        promotion.displayOnCheckout && 'Checkout',
                                                        promotion.displayOnProductPages && 'Products',
                                                    ]
                                                        .filter(Boolean)
                                                        .join(', ') || 'Nowhere'}
                                                </p>
                                            </div>
                                        </div>

                                        {isExpired && (
                                            <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                                ⚠️ This promotion has expired
                                            </div>
                                        )}

                                        {isNotYetActive && (
                                            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                                ℹ️ This promotion starts on {new Date(promotion.validFrom).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 ml-4">
                                        <Toggle
                                            isActive={promotion.isActive}
                                            onClick={() => onToggle(promotion)}
                                            activeLabel="Active"
                                            inactiveLabel="Inactive"
                                            size="sm"
                                        />
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            icon={<Pencil size={16} />}
                                            onClick={() => onEdit(promotion)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            icon={<Trash size={16} />}
                                            onClick={() => onDelete(promotion.id, promotion.title)}
                                        >
                                            Delete
                                        </Button>
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

export default PromotionList;
