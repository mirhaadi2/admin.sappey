import React from "react";
import { Plus, Pencil, Trash, Eye } from "@phosphor-icons/react";
import { Card, CardBody, Button, Badge, Toggle } from "../index";
import { Hero } from "../../api/admin";

interface HeroListProps {
    heroes: Hero[];
    isLoading?: boolean;
    onAdd: () => void;
    onEdit: (hero: Hero) => void;
    onDelete: (id: string, title: string) => void;
    onToggle: (hero: Hero) => void;
}

export const HeroList: React.FC<HeroListProps> = ({
    heroes,
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

    if (!heroes || heroes.length === 0) {
        return (
            <div className="text-center py-12">
                <Eye size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hero sections
                </h3>
                <p className="text-gray-600 mb-6">
                    Create hero sections to welcome visitors to your website.
                </p>
                <Button variant="primary" icon={<Plus size={16} />} onClick={onAdd}>
                    Add Hero Section
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="primary" icon={<Plus size={16} />} onClick={onAdd}>
                    Add Hero Section
                </Button>
            </div>
            {heroes.map((hero) => (
                <Card key={hero.id}>
                    <CardBody>
                        <div className="flex items-start gap-6">
                            {/* Media Preview */}
                            {(hero.videoUrl || hero.imageUrl || hero.backgroundImageUrl) && (
                                <div className="flex-shrink-0">
                                    {hero.videoUrl ? (
                                        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                            <video
                                                src={hero.videoUrl}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                            />
                                        </div>
                                    ) : hero.imageUrl || hero.backgroundImageUrl ? (
                                        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={hero.imageUrl || hero.backgroundImageUrl}
                                                alt="Hero image"
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
                                        <p className="text-gray-600">{hero.title}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Subtitle:</span>
                                        <p className="text-gray-600">{hero.subtitle}</p>
                                    </div>
                                    {hero.buttonText && (
                                        <div>
                                            <span className="font-medium text-gray-700">Button Text:</span>
                                            <p className="text-gray-600">{hero.buttonText}</p>
                                        </div>
                                    )}

                                    {(hero.buttonUrl || (hero as any).buttonLink) && (
                                        <div>
                                            <span className="font-medium text-gray-700">Button Link:</span>
                                            <p className="text-gray-600 break-all">
                                                {(hero as any).buttonLink || hero.buttonUrl}
                                            </p>
                                        </div>
                                    )}

                                    {hero.videoUrl && (
                                        <div>
                                            <span className="font-medium text-gray-700">
                                                Video URL:
                                            </span>
                                            <p className="text-gray-600 break-all">{hero.videoUrl}</p>
                                        </div>
                                    )}

                                    {/* {hero.videoPosterUrl && (
                                        <div>
                                            <span className="font-medium text-gray-700">
                                                Video Poster:
                                            </span>
                                            <p className="text-gray-600 break-all">
                                                {hero.videoPosterUrl}
                                            </p>
                                        </div>
                                    )} */}
                                    <div>
                                        <span className="font-medium text-gray-700">Created:</span>
                                        <p className="text-gray-600">
                                            {new Date(hero.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <Badge variant={hero.isActive ? "success" : "default"}>
                                        {hero.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    {/* {hero.buttonText && (
                                        <span className="text-sm text-gray-500">
                                            Button: {hero.buttonText}
                                        </span>
                                    )} */}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Toggle
                                    isActive={hero.isActive}
                                    onClick={() => onToggle(hero)}
                                    activeLabel="Active"
                                    inactiveLabel="Inactive"
                                    size="sm"
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<Pencil size={16} />}
                                    onClick={() => onEdit(hero)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<Trash size={16} />}
                                    onClick={() => onDelete(hero.id, hero.title)}
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
    );
};

export default HeroList;
