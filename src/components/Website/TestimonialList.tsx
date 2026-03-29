import React from 'react';
import { Plus, Pencil, Trash, Check, Star } from '@phosphor-icons/react';
import { Card, CardBody, Button, Badge, Toggle } from '../index';
import { Testimonial } from '../../api/admin';

interface TestimonialListProps {
    testimonials: Testimonial[];
    isLoading?: boolean;
    onAdd: () => void;
    onEdit: (testimonial: Testimonial) => void;
    onDelete: (id: string, author: string) => void;
    onToggle: (testimonial: Testimonial) => void;
}

export const TestimonialList: React.FC<TestimonialListProps> = ({
    testimonials,
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
                    Add Testimonial
                </Button>
            </div>

            {testimonials.length === 0 ? (
                <div className="text-center py-12">
                    <Check size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
                    <p className="text-gray-600">Add customer testimonials to build trust.</p>
                </div>
            ) : (
                testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                        <CardBody>
                            <div className="flex items-start gap-4">
                                {testimonial.imageUrl && (
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                                            <img
                                                src={testimonial.imageUrl}
                                                alt={testimonial.author}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{testimonial.author}</h3>
                                        {testimonial.location && (
                                            <p className="text-sm text-gray-600">{testimonial.location}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="md:col-span-2">
                                            <span className="font-medium text-gray-700">Comment:</span>
                                            <blockquote className="text-gray-900 mt-1">"{testimonial.comment}"</blockquote>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Rating:</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        weight={i < testimonial.rating ? 'fill' : 'regular'}
                                                        className="text-yellow-400"
                                                    />
                                                ))}
                                                <span className="text-gray-600">({testimonial.rating}/5)</span>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Created:</span>
                                            <p className="text-gray-600">
                                                {new Date(testimonial.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Toggle
                                        isActive={testimonial.isActive}
                                        onClick={() => onToggle(testimonial)}
                                        activeLabel="Active"
                                        inactiveLabel="Inactive"
                                        size="sm"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Pencil size={16} />}
                                        onClick={() => onEdit(testimonial)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Trash size={16} />}
                                        onClick={() => onDelete(testimonial.id, testimonial.author)}
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

export default TestimonialList;