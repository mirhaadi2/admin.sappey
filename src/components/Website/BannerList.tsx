import React from 'react';
import { Plus, Pencil, Trash } from '@phosphor-icons/react';
import { Card, CardBody, Button, Badge, Toggle } from '../index';
import { Banner } from '../../api/admin';

interface BannerListProps {
    banners: Banner[];
    isLoading?: boolean;
    onAdd: () => void;
    onEdit: (banner: Banner) => void;
    onDelete: (id: string, title: string) => void;
    onToggle: (banner: Banner) => void;
}

export const BannerList: React.FC<BannerListProps> = ({
    banners,
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

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="primary" icon={<Plus size={16} />} onClick={onAdd}>
                    Add Banner
                </Button>
            </div>

            {banners.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
                    <p className="text-gray-600">Create your first banner to showcase on the website.</p>
                </div>
            ) : (
                banners.map((banner) => (
                    <Card key={banner.id}>
                        <CardBody>
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Text:</span>
                                            <p className="text-gray-600">{banner.text}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Created:</span>
                                            <p className="text-gray-600">
                                                {new Date(banner.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Toggle
                                        isActive={banner.isActive}
                                        onClick={() => onToggle(banner)}
                                        activeLabel="Active"
                                        inactiveLabel="Inactive"
                                        size="sm"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Pencil size={16} />}
                                        onClick={() => onEdit(banner)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Trash size={16} />}
                                        onClick={() => onDelete(banner.id, banner.title)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))
            )}
        </div>
    );
};

export default BannerList;