import React from "react";
import { Plus, Pencil, Trash, Upload } from "@phosphor-icons/react";
import { Card, CardBody, Button, Badge, Toggle } from "../index";
import { Section } from "../../api/admin";

interface SectionListProps {
    sections: Section[];
    isLoading?: boolean;
    onAdd: () => void;
    onEdit: (section: Section) => void;
    onDelete: (id: string, title: string) => void;
    onToggle: (section: Section) => void;
}

export const SectionList: React.FC<SectionListProps> = ({
    sections,
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
                    Add Section
                </Button>
            </div>

            {sections.length === 0 ? (
                <div className="text-center py-12">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No sections yet
                    </h3>
                    <p className="text-gray-600">
                        Create sections to organize your website content.
                    </p>
                </div>
            ) : (
                sections.map((section) => (
                    <Card key={section.id}>
                        <CardBody>
                            <div className="flex items-start gap-6">
                                {(section.imageUrl ||
                                section.videoUrl ||
                                section.videoPosterUrl ||
                                section.backgroundImageUrl) && (
                                    <div className="flex-shrink-0">
                                        {section.videoUrl ? (
                                            <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                <video
                                                    src={section.videoUrl}
                                                    poster={
                                                        section.videoPosterUrl ||
                                                        section.imageUrl ||
                                                        undefined
                                                    }
                                                    className="w-full h-full object-cover"
                                                    muted
                                                    loop
                                                    autoPlay
                                                    playsInline
                                                />
                                            </div>
                                        ) : section.imageUrl ? (
                                            <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={section.imageUrl}
                                                    alt="Section image"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : section.backgroundImageUrl ? (
                                            <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={section.backgroundImageUrl}
                                                    alt="Background image"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : section.videoPosterUrl ? (
                                            <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={section.videoPosterUrl}
                                                    alt="Video poster"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                )}

                                <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Title:</span>
                                            <p className="text-gray-600">{section.title}</p>
                                        </div>

                                        {section.subtitle && (
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Subtitle:
                                                </span>
                                                <p className="text-gray-600">{section.subtitle}</p>
                                            </div>
                                        )}

                                        {section.content && (
                                            <div className="md:col-span-2">
                                                <span className="font-medium text-gray-700">
                                                    Content:
                                                </span>
                                                <p className="text-gray-600">{section.content}</p>
                                            </div>
                                        )}

                                        {section.imageUrl && (
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Image URL:
                                                </span>
                                                <p className="text-gray-600 break-all">
                                                    {section.imageUrl}
                                                </p>
                                            </div>
                                        )}

                                        {section.videoUrl && (
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Video URL:
                                                </span>
                                                <p className="text-gray-600 break-all">
                                                    {section.videoUrl}
                                                </p>
                                            </div>
                                        )}

                                        {section.videoPosterUrl && (
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Video Poster:
                                                </span>
                                                <p className="text-gray-600 break-all">
                                                    {section.videoPosterUrl}
                                                </p>
                                            </div>
                                        )}

                                        {section.buttonText && (
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Button Text:
                                                </span>
                                                <p className="text-gray-600">{section.buttonText}</p>
                                            </div>
                                        )}

                                        {section.buttonLink && (
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Button Link:
                                                </span>
                                                <p className="text-gray-600 break-all">
                                                    {section.buttonLink}
                                                </p>
                                            </div>
                                        )}

                                        {section.backgroundImageUrl && (
                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Background Image:
                                                </span>
                                                <p className="text-gray-600 break-all">
                                                    {section.backgroundImageUrl}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <span className="font-medium text-gray-700">Type:</span>
                                            <p className="text-gray-600">
                                                <Badge variant="info">{section.sectionType}</Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Order:</span>
                                            <p className="text-gray-600">{section.order}</p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">
                                                Created:
                                            </span>
                                            <p className="text-gray-600">
                                                {new Date(section.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Toggle
                                        isActive={section.isActive}
                                        onClick={() => onToggle(section)}
                                        activeLabel="Active"
                                        inactiveLabel="Inactive"
                                        size="sm"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Pencil size={16} />}
                                        onClick={() => onEdit(section)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Trash size={16} />}
                                        onClick={() => onDelete(section.id, section.title)}
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

export default SectionList;