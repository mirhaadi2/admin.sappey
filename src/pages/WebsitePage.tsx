import React, { useState, useEffect } from 'react';
import { Plus, Eye, Check, Upload, Image as ImageIcon, List } from '@phosphor-icons/react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { ErrorAlert } from '../components/ErrorAlert';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components';
import WebsiteEntityForm from '../components/Website/WebsiteEntityForm';
import { BannerList, HeroList, SectionList, TestimonialList, InstagramList } from '../components/Website/index';
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
    useWebsitePages,
    useWebsitePageMutations,
    useAboutUs,
    useAboutUsMutations,
    useShippingPolicy,
    useShippingPolicyMutations,
    useReturnsRefunds,
    useReturnsRefundsMutations,
    useFAQs,
    useFAQsMutations,
    Banner,
    Hero,
    Section,
    Testimonial,
    InstagramPost,
    CreateBannerRequest,
    UpdateBannerRequest,
    CreateHeroRequest,
    UpdateHeroRequest,
    CreateSectionRequest,
    UpdateSectionRequest,
    CreateTestimonialRequest,
    UpdateTestimonialRequest,
    CreateInstagramPostRequest,
    UpdateInstagramPostRequest,
    CreateWebsitePageRequest,
    UpdateWebsitePageRequest,
    WebsitePage as WebsitePageType,
} from '../api/admin/index';

type WebsiteContentTab = 'banners' | 'hero' | 'sections' | 'testimonials' | 'instagram' | 'about-us' | 'shipping-policy' | 'returns-refunds' | 'faqs';
type WebsiteTab = WebsiteContentTab;
type EntityTab = 'banners' | 'hero' | 'sections' | 'testimonials' | 'instagram';
type SupportPageKey = 'about-us' | 'shipping-policy' | 'returns-refunds' | 'faqs';

const WebsitePage = () => {
    const [activeTab, setActiveTab] = useState<WebsiteTab>('banners');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: WebsiteTab; id: string; label?: string }>({
        isOpen: false,
        type: 'banners',
        id: '',
        label: '',
    });
    const [entityModal, setEntityModal] = useState<{
        open: boolean;
        mode: 'create' | 'edit';
        type: EntityTab;
        item: Banner | Hero | Section | Testimonial | InstagramPost | WebsitePageType | null;
    }>({ open: false, mode: 'create', type: 'banners', item: null });

    const [supportPageForms, setSupportPageForms] = useState<Record<SupportPageKey, { title: string; content: string; metaTitle?: string; metaDescription?: string; isPublished: boolean }>>({
        'about-us': { title: '', content: '', metaTitle: '', metaDescription: '', isPublished: false },
        'shipping-policy': { title: '', content: '', metaTitle: '', metaDescription: '', isPublished: false },
        'returns-refunds': { title: '', content: '', metaTitle: '', metaDescription: '', isPublished: false },
        'faqs': { title: '', content: '', metaTitle: '', metaDescription: '', isPublished: false },
    });

    // API hooks
    const { banners, isLoading: bannersLoading, error: bannersError } = useWebsiteBanners();
    const { heroes, isLoading: heroLoading, error: heroError } = useWebsiteHero();
    const { sections, isLoading: sectionsLoading, error: sectionsError } = useWebsiteSections();
    const { testimonials, isLoading: testimonialsLoading, error: testimonialsError } = useWebsiteTestimonials();
    const { instagramPosts, isLoading: instagramLoading, error: instagramError } = useWebsiteInstagramPosts();
    const { pages, isLoading: pagesLoading, error: pagesError, refetch: refetchPages } = useWebsitePages();
    const { aboutUs, isLoading: aboutUsLoading, error: aboutUsError, refetch: refetchAboutUs } = useAboutUs();
    const { shippingPolicy, isLoading: shippingPolicyLoading, error: shippingPolicyError, refetch: refetchShippingPolicy } = useShippingPolicy();
    const { returnsRefunds, isLoading: returnsRefundsLoading, error: returnsRefundsError, refetch: refetchReturnsRefunds } = useReturnsRefunds();
    const { faqs, isLoading: faqsLoading, error: faqsError, refetch: refetchFAQs } = useFAQs();

    // Mutation hooks
    const bannerMutations = useWebsiteBannerMutations();
    const heroMutations = useWebsiteHeroMutations();
    const sectionMutations = useWebsiteSectionMutations();
    const testimonialMutations = useWebsiteTestimonialMutations();
    const instagramMutations = useWebsiteInstagramMutations();
    const pageMutations = useWebsitePageMutations();
    const aboutUsMutations = useAboutUsMutations();
    const shippingPolicyMutations = useShippingPolicyMutations();
    const returnsRefundsMutations = useReturnsRefundsMutations();
    const faqsMutations = useFAQsMutations();

    // Sync support page forms with data
    useEffect(() => {
        if (aboutUs) {
            setSupportPageForms(prev => ({
                ...prev,
                'about-us': {
                    title: aboutUs.title,
                    content: aboutUs.content,
                    metaTitle: aboutUs.metaTitle || '',
                    metaDescription: aboutUs.metaDescription || '',
                    isPublished: aboutUs.isPublished,
                }
            }));
        }
    }, [aboutUs]);

    useEffect(() => {
        if (shippingPolicy) {
            setSupportPageForms(prev => ({
                ...prev,
                'shipping-policy': {
                    title: shippingPolicy.title,
                    content: shippingPolicy.content,
                    metaTitle: shippingPolicy.metaTitle || '',
                    metaDescription: shippingPolicy.metaDescription || '',
                    isPublished: shippingPolicy.isPublished,
                }
            }));
        }
    }, [shippingPolicy]);

    useEffect(() => {
        if (returnsRefunds) {
            setSupportPageForms(prev => ({
                ...prev,
                'returns-refunds': {
                    title: returnsRefunds.title,
                    content: returnsRefunds.content,
                    metaTitle: returnsRefunds.metaTitle || '',
                    metaDescription: returnsRefunds.metaDescription || '',
                    isPublished: returnsRefunds.isPublished,
                }
            }));
        }
    }, [returnsRefunds]);

    useEffect(() => {
        if (faqs) {
            setSupportPageForms(prev => ({
                ...prev,
                'faqs': {
                    title: faqs.title,
                    content: faqs.content,
                    metaTitle: faqs.metaTitle || '',
                    metaDescription: faqs.metaDescription || '',
                    isPublished: faqs.isPublished,
                }
            }));
        }
    }, [faqs]);

    // Form handlers
    const handleTitleChange = (key: SupportPageKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setSupportPageForms(prev => ({
            ...prev,
            [key]: { ...prev[key], title: e.target.value }
        }));
    };

    const handleContentChange = (key: SupportPageKey) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSupportPageForms(prev => ({
            ...prev,
            [key]: { ...prev[key], content: e.target.value }
        }));
    };

    const tabs = [
        { id: 'banners' as WebsiteTab, label: 'Banners', icon: <ImageIcon size={16} />, count: banners?.length || 0 },
        { id: 'hero' as WebsiteTab, label: 'Hero Section', icon: <Eye size={16} />, count: heroes ? 1 : 0 },
        { id: 'sections' as WebsiteTab, label: 'Sections', icon: <Upload size={16} />, count: sections?.length || 0 },
        { id: 'testimonials' as WebsiteTab, label: 'Testimonials', icon: <Check size={16} />, count: testimonials?.length || 0 },
        { id: 'instagram' as WebsiteTab, label: 'Instagram', icon: <ImageIcon size={16} />, count: instagramPosts?.length || 0 },
        { id: 'about-us' as WebsiteTab, label: 'About Us', icon: <List size={16} />, count: aboutUs ? 1 : 0 },
        { id: 'shipping-policy' as WebsiteTab, label: 'Shipping Policy', icon: <List size={16} />, count: shippingPolicy ? 1 : 0 },
        { id: 'returns-refunds' as WebsiteTab, label: 'Returns & Refunds', icon: <List size={16} />, count: returnsRefunds ? 1 : 0 },
        { id: 'faqs' as WebsiteTab, label: 'FAQs', icon: <List size={16} />, count: faqs ? 1 : 0 },
    ];

    const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
        setShowToast(false);
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const openEntityModal = (type: EntityTab, mode: 'create' | 'edit', item: any = null) => {
        setEntityModal({ open: true, mode, type, item });
    };

    const closeEntityModal = () => {
        setEntityModal((prev) => ({ ...prev, open: false, item: null }));
    };

    const handleDeleteEntity = async (type: WebsiteTab, id: string, label?: string) => {
        setDeleteConfirm({ isOpen: true, type, id, label });
    };

    const handleConfirmDelete = async () => {
        const { type, id, label } = deleteConfirm;
        setDeleteConfirm({ isOpen: false, type: 'banners', id: '', label: '' });

        try {
            switch (type) {
                case 'banners':
                    await bannerMutations.deleteBanner(id);
                    break;
                case 'hero':
                    await heroMutations.deleteHero(id);
                    break;
                case 'sections':
                    await sectionMutations.deleteSection(id);
                    break;
                case 'testimonials':
                    await testimonialMutations.deleteTestimonial(id);
                    break;
                case 'instagram':
                    await instagramMutations.deleteInstagramPost(id);
                    break;
            }
            showToastMessage(`${label ?? type} deleted successfully.`);
        } catch (error: any) {
            showToastMessage(`Failed to delete ${label ?? type}: ${error?.message || String(error)}`, 'error');
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirm({ isOpen: false, type: 'banners', id: '', label: '' });
    };

    const handleToggleActive = async (type: WebsiteTab, item: any) => {
        try {
            const payload = { isActive: !item.isActive };
            switch (type) {
                case 'banners':
                    await bannerMutations.updateBanner({ id: item.id, data: payload });
                    break;
                case 'hero':
                    await heroMutations.updateHero({ id: item.id, data: payload });
                    break;
                case 'sections':
                    await sectionMutations.updateSection({ id: item?.id, data: payload });
                    break;
                case 'testimonials':
                    await testimonialMutations.updateTestimonial({ id: item.id, data: payload });
                    break;
                case 'instagram':
                    await instagramMutations.updateInstagramPost({ id: item.id, data: payload });
                    break;
            }
            showToastMessage(`${item.title ?? item.name ?? item.author ?? 'Item'} ${payload.isActive ? 'activated' : 'deactivated'}`);
        } catch (error: any) {
            showToastMessage(`Failed to update status: ${error?.message || String(error)}`, 'error');
        }
    };

    const handleSubmitEntity = async (data: Record<string, any>) => {
        const type = entityModal.type;
        const id = entityModal.item?.id;

        if (entityModal.mode === 'edit' && !id) {
            showToastMessage('Entity ID is missing for update operation', 'error');
            return;
        }

        try {
            if (entityModal.mode === 'create') {
                switch (type) {
                    case 'banners':
                        await bannerMutations.createBanner(data as CreateBannerRequest);
                        break;
                    case 'hero':
                        await heroMutations.createHero(data as CreateHeroRequest);
                        break;
                    case 'sections':
                        await sectionMutations.createSection(data as CreateSectionRequest);
                        break;
                    case 'testimonials':
                        await testimonialMutations.createTestimonial(data as CreateTestimonialRequest);
                        break;
                    case 'instagram':
                        await instagramMutations.createInstagramPost(data as CreateInstagramPostRequest);
                        break;
                }
                showToastMessage(`${type} created successfully.`);
            } else {
                switch (type) {
                    case 'banners':
                        await bannerMutations.updateBanner({ id: id!, data });
                        break;
                    case 'hero':
                        await heroMutations.updateHero({ id: id!, data });
                        break;
                    case 'sections':
                        await sectionMutations.updateSection({ id: id!, data });
                        break;
                    case 'testimonials':
                        await testimonialMutations.updateTestimonial({ id: id!, data });
                        break;
                    case 'instagram':
                        await instagramMutations.updateInstagramPost({ id: id!, data });
                        break;
                }
                showToastMessage(`${type} updated successfully.`);
            }

            closeEntityModal();
        } catch (error: any) {
            showToastMessage(`Failed to ${entityModal.mode} ${type}: ${error?.message || String(error)}`, 'error');
        }
    };

    const handleSubmitSupportPage = async (type: 'about-us' | 'shipping-policy' | 'returns-refunds' | 'faqs', data: any) => {
        try {
            switch (type) {
                case 'about-us':
                    await aboutUsMutations.updateAboutUs(data);
                    showToastMessage('About Us updated successfully.');
                    refetchAboutUs();
                    break;
                case 'shipping-policy':
                    await shippingPolicyMutations.updateShippingPolicy(data);
                    showToastMessage('Shipping Policy updated successfully.');
                    refetchShippingPolicy();
                    break;
                case 'returns-refunds':
                    await returnsRefundsMutations.updateReturnsRefunds(data);
                    showToastMessage('Returns & Refunds updated successfully.');
                    refetchReturnsRefunds();
                    break;
                case 'faqs':
                    await faqsMutations.updateFAQs(data);
                    showToastMessage('FAQs updated successfully.');
                    refetchFAQs();
                    break;
            }
        } catch (error: any) {
            showToastMessage(`Failed to update ${type}: ${error?.message || String(error)}`, 'error');
        }
    };

    const renderContent = () => {
        const error = bannersError || heroError || sectionsError || testimonialsError || instagramError || pagesError || aboutUsError || shippingPolicyError || returnsRefundsError || faqsError;

        if (error) {
            return <ErrorAlert message={`Failed to load ${activeTab}: ${error.message}`} />;
        }

        switch (activeTab) {
            case 'banners':
                return (
                    <BannerList
                        banners={banners || []}
                        isLoading={bannersLoading}
                        onAdd={() => openEntityModal('banners', 'create')}
                        onEdit={(banner) => openEntityModal('banners', 'edit', banner)}
                        onDelete={(id, title) => handleDeleteEntity('banners', id, title)}
                        onToggle={(banner) => handleToggleActive('banners', banner)}
                    />
                );
            case 'hero':
                return (
                    <HeroList
                        heroes={heroes}
                        isLoading={heroLoading}
                        onAdd={() => openEntityModal('hero', 'create')}
                        onEdit={(hero) => openEntityModal('hero', 'edit', hero)}
                        onDelete={(id, title) => handleDeleteEntity('hero', id, title)}
                        onToggle={(hero) => handleToggleActive('hero', hero)}
                    />
                );
            case 'sections':
                return (
                    <SectionList
                        sections={sections || []}
                        isLoading={sectionsLoading}
                        onAdd={() => openEntityModal('sections', 'create')}
                        onEdit={(section) => openEntityModal('sections', 'edit', section)}
                        onDelete={(id, title) => handleDeleteEntity('sections', id, title)}
                        onToggle={(section) => handleToggleActive('sections', section)}
                    />
                );
            case 'testimonials':
                return (
                    <TestimonialList
                        testimonials={testimonials || []}
                        isLoading={testimonialsLoading}
                        onAdd={() => openEntityModal('testimonials', 'create')}
                        onEdit={(testimonial) => openEntityModal('testimonials', 'edit', testimonial)}
                        onDelete={(id, author) => handleDeleteEntity('testimonials', id, author)}
                        onToggle={(testimonial) => handleToggleActive('testimonials', testimonial)}
                    />
                );
            case 'instagram':
                return (
                    <InstagramList
                        posts={instagramPosts || []}
                        isLoading={instagramLoading}
                        onAdd={() => openEntityModal('instagram', 'create')}
                        onEdit={(post) => openEntityModal('instagram', 'edit', post)}
                        onDelete={(id) => handleDeleteEntity('instagram', id)}
                        onToggle={(post) => handleToggleActive('instagram', post)}
                    />
                );
            case 'about-us':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">About Us</h3>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Title
                                <input
                                    type="text"
                                    value={supportPageForms['about-us'].title}
                                    onChange={handleTitleChange('about-us')}
                                    className="w-full rounded border border-slate-300 p-2 mt-1"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Content
                                <textarea
                                    value={supportPageForms['about-us'].content}
                                    onChange={handleContentChange('about-us')}
                                    rows={10}
                                    className="w-full rounded border border-slate-300 p-2 mt-1"
                                />
                            </label>
                            <Button variant="primary" onClick={() => handleSubmitSupportPage('about-us', supportPageForms['about-us'])}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                );
            case 'shipping-policy':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Shipping Policy</h3>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Title
                                <input
                                    type="text"
                                    value={supportPageForms['shipping-policy'].title}
                                    onChange={handleTitleChange('shipping-policy')}
                                    className="w-full rounded border border-slate-300 p-2 mt-1"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Content
                                <textarea
                                    value={supportPageForms['shipping-policy'].content}
                                    onChange={handleContentChange('shipping-policy')}
                                    rows={10}
                                    className="w-full rounded border border-slate-300 p-2 mt-1"
                                />
                            </label>
                            <Button variant="primary" onClick={() => handleSubmitSupportPage('shipping-policy', supportPageForms['shipping-policy'])}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                );
            case 'returns-refunds':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Returns & Refunds</h3>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Title
                                <input
                                    type="text"
                                    value={supportPageForms['returns-refunds'].title}
                                    onChange={handleTitleChange('returns-refunds')}
                                    className="w-full rounded border border-slate-300 p-2 mt-1"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Content
                                <textarea
                                    value={supportPageForms['returns-refunds'].content}
                                    onChange={handleContentChange('returns-refunds')}
                                    rows={10}
                                    className="w-full rounded border border-slate-300 p-2 mt-1"
                                />
                            </label>
                            <Button variant="primary" onClick={() => handleSubmitSupportPage('returns-refunds', supportPageForms['returns-refunds'])}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                );
            case 'faqs':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">FAQs</h3>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Title
                                <input
                                    type="text"
                                    value={supportPageForms['faqs'].title}
                                    onChange={handleTitleChange('faqs')}
                                    className="w-full rounded border border-slate-300 p-2 mt-1"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Content
                                <textarea
                                    value={supportPageForms['faqs'].content}
                                    onChange={handleContentChange('faqs')}
                                    rows={10}
                                    className="w-full rounded border border-slate-300 p-2 mt-1"
                                />
                            </label>
                            <Button variant="primary" onClick={() => handleSubmitSupportPage('faqs', supportPageForms['faqs'])}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Website Management</h1>
                        <p className="text-gray-600">Manage your website content and appearance</p>
                    </div>
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
            </div>

            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Item"
                description={`Delete ${deleteConfirm.label ?? deleteConfirm.type} permanently? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                isDangerous={true}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {entityModal.open && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                {entityModal.mode === 'create' ? 'Create' : 'Edit'} {entityModal.type}
                            </h2>
                            <button onClick={closeEntityModal} className="text-slate-400 hover:text-slate-600 text-2xl">
                                ×
                            </button>
                        </div>

                        <WebsiteEntityForm
                            type={entityModal.type}
                            mode={entityModal.mode}
                            initialValues={entityModal.mode === 'edit' && entityModal.item ? entityModal.item : undefined}
                            isSubmitting={false}
                            onSubmit={handleSubmitEntity}
                            onCancel={closeEntityModal}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default WebsitePage;
