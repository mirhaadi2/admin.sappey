import React from 'react';
import { Plus, Pencil, Trash, Image as ImageIcon } from '@phosphor-icons/react';
import { Card, CardBody, Button, Badge, Toggle } from '../index';
import { InstagramPost } from '../../api/admin';

interface InstagramListProps {
    posts: InstagramPost[];
    isLoading?: boolean;
    onAdd: () => void;
    onEdit: (post: InstagramPost) => void;
    onDelete: (id: string) => void;
    onToggle: (post: InstagramPost) => void;
}

export const InstagramList: React.FC<InstagramListProps> = ({
    posts,
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
                    Add Instagram Post
                </Button>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Instagram posts yet</h3>
                    <p className="text-gray-600">Showcase your Instagram content on your website.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.map((post) => (
                        <Card key={post.id}>
                            <CardBody>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={post.imageUrl}
                                                alt="Instagram post"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="md:col-span-2">
                                                <span className="font-medium text-gray-700">Image URL:</span>
                                                <p className="text-gray-600 break-all">{post.imageUrl}</p>
                                            </div>

                                            {post.caption && (
                                                <div className="md:col-span-2">
                                                    <span className="font-medium text-gray-700">Caption:</span>
                                                    <p className="text-gray-600">{post.caption}</p>
                                                </div>
                                            )}

                                            {post.postUrl && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Post URL:</span>
                                                    <p className="text-gray-600 break-all">{post.postUrl}</p>
                                                </div>
                                            )}

                                            <div>
                                                <span className="font-medium text-gray-700">Status:</span>
                                                <p className="text-gray-600 mt-1">
                                                <Badge variant={post.isActive ? 'success' : 'default'}>
                                                    {post.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                                </p>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Created:</span>
                                                <p className="text-gray-600">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Toggle
                                            isActive={post.isActive}
                                            onClick={() => onToggle(post)}
                                            activeLabel="Active"
                                            inactiveLabel="Inactive"
                                            size="sm"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={<Pencil size={16} />}
                                            onClick={() => onEdit(post)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={<Trash size={16} />}
                                            onClick={() => onDelete(post.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstagramList;