import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash, Eye, Check, X, Upload, Image as ImageIcon, Star } from '@phosphor-icons/react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Toggle } from '../components/Toggle';
import { ErrorAlert } from '../components/ErrorAlert';
import { Toast } from '../components';
import {
    useWebsiteBanners,
    useWebsiteBannerMutations,
    useWebsiteHero,
    useWebsiteHeroMutations,
    useWebsiteSections,
    useWebsiteSectionMutations,
    useWebsiteTestimonials,
    useWebsiteTestimonialMutations,
    useWebsiteInstagramPosts,
    useWebsiteInstagramMutations,
    Banner,
    Hero,
    Section,
    Testimonial,
    InstagramPost,
} from '../api/admin/index';

const WebsitePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('banners');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    // API hooks based on active tab
    const { banners, isLoading: bannersLoading, error: bannersError } = useWebsiteBanners();
    const { hero, isLoading: heroLoading, error: heroError } = useWebsiteHero();
    const { sections, isLoading: sectionsLoading, error: sectionsError } = useWebsiteSections();
    const { testimonials, isLoading: testimonialsLoading, error: testimonialsError } = useWebsiteTestimonials();
    const { instagramPosts, isLoading: instagramLoading, error: instagramError } = useWebsiteInstagramPosts();

    // Mutation hooks
    const bannerMutations = useWebsiteBannerMutations();
    const heroMutations = useWebsiteHeroMutations();
    const sectionMutations = useWebsiteSectionMutations();
    const testimonialMutations = useWebsiteTestimonialMutations();
    const instagramMutations = useWebsiteInstagramMutations();

    const tabs = [
        { id: 'banners', label: 'Banners', icon: <ImageIcon size={16} />, count: banners?.length || 0 },
        { id: 'hero', label: 'Hero Section', icon: <Eye size={16} />, count: hero ? 1 : 0 },
        { id: 'sections', label: 'Sections', icon: <Upload size={16} />, count: sections?.length || 0 },
        { id: 'testimonials', label: 'Testimonials', icon: <Check size={16} />, count: testimonials?.length || 0 },
        { id: 'instagram', label: 'Instagram', icon: <ImageIcon size={16} />, count: instagramPosts?.length || 0 },
    ];

    const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const handleDelete = async (type: string, id: string, name?: string) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            switch (type) {
                case 'banner':
                    bannerMutations.deleteBanner(id);
                    break;
                case 'hero':
                    heroMutations.deleteHero(id);
                    break;
                case 'section':
                    sectionMutations.deleteSection(id);
                    break;
                case 'testimonial':
                    testimonialMutations.deleteTestimonial(id);
                    break;
                case 'instagram':
                    instagramMutations.deleteInstagramPost(id);
                    break;
            }
            showToastMessage(`${type} deleted successfully`);
        } catch (error) {
            showToastMessage(`Failed to delete ${type}`, 'error');
        }
    };

    const renderContent = () => {
        const isLoading = bannersLoading || heroLoading || sectionsLoading || testimonialsLoading || instagramLoading;
        const error = bannersError || heroError || sectionsError || testimonialsError || instagramError;

        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (error) {
            return <ErrorAlert message={`Failed to load ${activeTab}: ${error.message}`} />;
        }

        switch (activeTab) {
            case 'banners':
                return renderBanners();
            case 'hero':
                return renderHero();
            case 'sections':
                return renderSections();
            case 'testimonials':
                return renderTestimonials();
            case 'instagram':
                return renderInstagram();
            default:
                return renderBanners();
        }
    };

    const renderBanners = () => (
        <div className="space-y-4">
            {banners?.length === 0 ? (
                <div className="text-center py-12">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
                    <p className="text-gray-600 mb-6">Create your first banner to showcase on the website.</p>
                    <Button variant="primary" icon={<Plus size={16} />}>
                        Add Banner
                    </Button>
                </div>
            ) : (
                banners?.map((banner: Banner) => (
                    <Card key={banner.id}>
                        <CardBody>
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        {/* <div>
                                            <span className="font-medium text-gray-700">Title:</span>
                                            <p className="text-gray-600">{banner.title}</p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Subtitle:</span>
                                            <p className="text-gray-600">{banner.subtitle}</p>
                                        </div> */}

                                        <div>
                                            <span className="font-medium text-gray-700">Text:</span>
                                            <p className="text-gray-600">{banner.text}</p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Status:</span>
                                            <p className="text-gray-600">
                                                <Badge variant={banner.isActive ? 'success' : 'default'}>
                                                    {banner.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Created:</span>
                                            <p className="text-gray-600">
                                                {new Date(banner.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Updated:</span>
                                            <p className="text-gray-600">
                                                {new Date(banner.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" icon={<Pencil size={16} />}>
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Trash size={16} />}
                                        onClick={() => handleDelete('banner', banner.id, banner.title)}
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

    const renderHero = () => (
        <div className="space-y-4">
            {!hero ? (
                <div className="text-center py-12">
                    <Eye size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hero section</h3>
                    <p className="text-gray-600 mb-6">Create a hero section to welcome visitors to your website.</p>
                    <Button variant="primary" icon={<Plus size={16} />}>
                        Add Hero Section
                    </Button>
                </div>
            ) : (
                <Card>
                    <CardBody>
                        <div className="flex items-start gap-6">
                            {/* Media Preview */}
                            {(hero.videoUrl || hero.videoPosterUrl || hero.imageUrl) && (
                                <div className="flex-shrink-0">
                                    {hero.videoUrl ? (
                                        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                            <video
                                                src={hero.videoUrl}
                                                poster={hero.videoPosterUrl || undefined}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                            />
                                        </div>
                                    ) : hero.imageUrl ? (
                                        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={hero.imageUrl}
                                                alt="Hero image"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : hero.videoPosterUrl ? (
                                        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={hero.videoPosterUrl}
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
                                        <p className="text-gray-600">{hero.title}</p>
                                    </div>

                                    <div>
                                        <span className="font-medium text-gray-700">Subtitle:</span>
                                        <p className="text-gray-600">{hero.subtitle}</p>
                                    </div>

                                    {hero.ctaText && (
                                        <div>
                                            <span className="font-medium text-gray-700">CTA Text:</span>
                                            <p className="text-gray-600">{hero.ctaText}</p>
                                        </div>
                                    )}

                                    {(hero.buttonUrl || (hero as any).ctaLink) && (
                                        <div>
                                            <span className="font-medium text-gray-700">CTA Link:</span>
                                            <p className="text-gray-600 break-all">
                                                {(hero as any).ctaLink || hero.buttonUrl}
                                            </p>
                                        </div>
                                    )}

                                    {hero.videoUrl && (
                                        <div>
                                            <span className="font-medium text-gray-700">Video URL:</span>
                                            <p className="text-gray-600 break-all">{hero.videoUrl}</p>
                                        </div>
                                    )}

                                    {hero.videoPosterUrl && (
                                        <div>
                                            <span className="font-medium text-gray-700">Video Poster:</span>
                                            <p className="text-gray-600 break-all">{hero.videoPosterUrl}</p>
                                        </div>
                                    )}

                                    <div>
                                        <span className="font-medium text-gray-700">Created:</span>
                                        <p className="text-gray-600">
                                            {new Date(hero.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="font-medium text-gray-700">Updated:</span>
                                        <p className="text-gray-600">
                                            {new Date(hero.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <Badge variant={hero.isActive ? 'success' : 'default'}>
                                        {hero.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                    {hero.buttonText && (
                                        <span className="text-sm text-gray-500">
                                            Button: {hero.buttonText}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" icon={<Pencil size={16} />}>
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<Trash size={16} />}
                                    onClick={() => handleDelete('hero', hero.id, hero.title)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );

    const renderSections = () => (
        <div className="space-y-4">
            {sections?.length === 0 ? (
                <div className="text-center py-12">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
                    <p className="text-gray-600 mb-6">Create sections to organize your website content.</p>
                    <Button variant="primary" icon={<Plus size={16} />}>
                        Add Section
                    </Button>
                </div>
            ) : (
                sections?.map((section: Section) => (
                    <Card key={section.id}>
                        <CardBody>
                            <div className="flex items-start gap-6">
                                {/* Media Preview */}
                                {(section.imageUrl || section.videoUrl || section.videoPosterUrl || section.backgroundImageUrl) && (
                                    <div className="flex-shrink-0">
                                        {section.videoUrl ? (
                                            <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                <video
                                                    src={section.videoUrl}
                                                    poster={section.videoPosterUrl || section.imageUrl || undefined}
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
                                                <span className="font-medium text-gray-700">Subtitle:</span>
                                                <p className="text-gray-600">{section.subtitle}</p>
                                            </div>
                                        )}

                                        <div>
                                            <span className="font-medium text-gray-700">Section Type:</span>
                                            <p className="text-gray-600">
                                                <Badge variant="info">{section.sectionType}</Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Order:</span>
                                            <p className="text-gray-600">{section.order}</p>
                                        </div>

                                        {section.content && (
                                            <div className="md:col-span-2">
                                                <span className="font-medium text-gray-700">Content:</span>
                                                <p className="text-gray-600">{section.content}</p>
                                            </div>
                                        )}

                                        {section.imageUrl && (
                                            <div>
                                                <span className="font-medium text-gray-700">Image URL:</span>
                                                <p className="text-gray-600 break-all">{section.imageUrl}</p>
                                            </div>
                                        )}

                                        {section.videoUrl && (
                                            <div>
                                                <span className="font-medium text-gray-700">Video URL:</span>
                                                <p className="text-gray-600 break-all">{section.videoUrl}</p>
                                            </div>
                                        )}

                                        {section.videoPosterUrl && (
                                            <div>
                                                <span className="font-medium text-gray-700">Video Poster:</span>
                                                <p className="text-gray-600 break-all">{section.videoPosterUrl}</p>
                                            </div>
                                        )}

                                        {section.buttonText && (
                                            <div>
                                                <span className="font-medium text-gray-700">Button Text:</span>
                                                <p className="text-gray-600">{section.buttonText}</p>
                                            </div>
                                        )}

                                        {section.buttonLink && (
                                            <div>
                                                <span className="font-medium text-gray-700">Button Link:</span>
                                                <p className="text-gray-600 break-all">{section.buttonLink}</p>
                                            </div>
                                        )}

                                        {section.backgroundImageUrl && (
                                            <div>
                                                <span className="font-medium text-gray-700">Background Image:</span>
                                                <p className="text-gray-600 break-all">{section.backgroundImageUrl}</p>
                                            </div>
                                        )}

                                        <div>
                                            <span className="font-medium text-gray-700">Status:</span>
                                            <p className="text-gray-600">
                                                <Badge variant={section.isActive ? 'success' : 'default'}>
                                                    {section.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Created:</span>
                                            <p className="text-gray-600">
                                                {new Date(section.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Updated:</span>
                                            <p className="text-gray-600">
                                                {new Date(section.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" icon={<Pencil size={16} />}>
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Trash size={16} />}
                                        onClick={() => handleDelete('section', section.id, section.title)}
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

    const renderTestimonials = () => (
        <div className="space-y-4">
            {testimonials?.length === 0 ? (
                <div className="text-center py-12">
                    <Check size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
                    <p className="text-gray-600 mb-6">Add customer testimonials to build trust.</p>
                    <Button variant="primary" icon={<Plus size={16} />}>
                        Add Testimonial
                    </Button>
                </div>
            ) : (
                testimonials?.map((testimonial: Testimonial) => (
                    <Card key={testimonial.id}>
                        <CardBody>
                            <div className="flex items-start gap-4">
                                {/* Profile Image */}
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
                                        <h3 className="font-medium text-gray-900 mb-1">{testimonial.author}</h3>
                                        {testimonial.location && (
                                            <p className="text-sm text-gray-600">{testimonial.location}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Name:</span>
                                            <p className="text-gray-600">{testimonial.author}</p>
                                        </div>

                                        {testimonial.location && (
                                            <div>
                                                <span className="font-medium text-gray-700">Location:</span>
                                                <p className="text-gray-600">{testimonial.location}</p>
                                            </div>
                                        )}

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
                                                        weight={i < testimonial.rating ? "fill" : "regular"}
                                                        className="text-yellow-400"
                                                    />
                                                ))}
                                                <span className="text-gray-600">({testimonial.rating}/5)</span>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Status:</span>
                                            <p className="text-gray-600 mt-1">
                                                <Badge variant={testimonial.isActive ? 'success' : 'default'}>
                                                    {testimonial.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Created:</span>
                                            <p className="text-gray-600">
                                                {new Date(testimonial.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="font-medium text-gray-700">Updated:</span>
                                            <p className="text-gray-600">
                                                {new Date(testimonial.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" icon={<Pencil size={16} />}>
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Trash size={16} />}
                                        onClick={() => handleDelete('testimonial', testimonial.id, testimonial.author)}
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

    const renderInstagram = () => (
        <div className="space-y-4">
            {instagramPosts?.length === 0 ? (
                <div className="text-center py-12">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Instagram posts yet</h3>
                    <p className="text-gray-600 mb-6">Showcase your Instagram content on your website.</p>
                    <Button variant="primary" icon={<Plus size={16} />}>
                        Add Instagram Post
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {instagramPosts?.map((post: InstagramPost) => (
                        <Card key={post.id}>
                            <CardBody>
                                <div className="flex items-start gap-4">
                                    {/* Post Image */}
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

                                            <div>
                                                <span className="font-medium text-gray-700">Updated:</span>
                                                <p className="text-gray-600">
                                                    {new Date(post.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" icon={<Pencil size={16} />}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={<Trash size={16} />}
                                            onClick={() => handleDelete('instagram', post.id)}
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Website Management</h1>
                    <p className="text-gray-600">Manage your website content and appearance</p>
                </div>
                <Button variant="primary" icon={<Plus size={16} />}>
                    Add Content
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">
                        {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                </CardHeader>
                <CardBody>
                    {renderContent()}
                </CardBody>
            </Card>

            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default WebsitePage;