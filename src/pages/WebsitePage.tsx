import React, { useState, useEffect } from 'react';
import { Plus, Eye, Check, Upload, Image as ImageIcon, List } from '@phosphor-icons/react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { ErrorAlert } from '../components/ErrorAlert';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components';
import WebsiteEntityForm from '../components/Website/WebsiteEntityForm';
import WebsitePageForm from '../components/Website/WebsitePageForm';
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

type WebsiteContentTab = 'banners' | 'hero' | 'sections' | 'testimonials' | 'instagram' | 'website-pages' | 'about-us' | 'shipping-policy' | 'returns-refunds' | 'faqs';
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

    const [pageModal, setPageModal] = useState<{
        open: boolean;
        mode: 'create' | 'edit';
        item: WebsitePageType | null;
    }>({ open: false, mode: 'create', item: null });

    const [supportPageForms, setSupportPageForms] = useState<Record<SupportPageKey, { title: string; content: string; metaTitle?: string; metaDescription?: string; isPublished: boolean; slug: string }>>({
        'about-us': { title: '', content: '', metaTitle: '', metaDescription: '', isPublished: false, slug: 'about-us' },
        'shipping-policy': { title: '', content: '', metaTitle: '', metaDescription: '', isPublished: false, slug: 'shipping-policy' },
        'returns-refunds': { title: '', content: '', metaTitle: '', metaDescription: '', isPublished: false, slug: 'returns-and-refunds' },
        'faqs': { title: '', content: '', metaTitle: '', metaDescription: '', isPublished: false, slug: 'frequently-asked-questions' },
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
                    slug: aboutUs.slug,
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
                    slug: shippingPolicy.slug,
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
                    slug: returnsRefunds.slug,
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
                    slug: faqs.slug,
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
        { id: 'website-pages' as WebsiteTab, label: 'Website Pages', icon: <List size={16} />, count: pages?.length || 0 },
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
                case 'website-pages':
                    await pageMutations.deleteWebsitePage(id);
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
                case 'website-pages':
                    await pageMutations.updateWebsitePage({ id: item.slug, data: { isPublished: !item.isPublished } });
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

    const openPageModal = (mode: 'create' | 'edit', item: WebsitePageType | null = null) => {
        setPageModal({ open: true, mode, item });
    };

    const closePageModal = () => {
        setPageModal((prev) => ({ ...prev, open: false, item: null }));
    };

    const handleSubmitPage = async (data: CreateWebsitePageRequest | UpdateWebsitePageRequest) => {
        try {
            if (pageModal.mode === 'create') {
                await pageMutations.createWebsitePage(data as CreateWebsitePageRequest);
                showToastMessage('Website page created successfully.');
            } else {
                const slug = pageModal.item?.slug;
                if (!slug) {
                    showToastMessage('Page slug is required for update.', 'error');
                    return;
                }
                await pageMutations.updateWebsitePage({ id: slug, data: data as UpdateWebsitePageRequest });
                showToastMessage('Website page updated successfully.');
            }

            closePageModal();
            refetchPages();
        } catch (error: any) {
            showToastMessage(`Failed to ${pageModal.mode} page: ${error?.message || String(error)}`, 'error');
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

  const renderSupportPageForm = (key: SupportPageKey, label: string) => {
    const formData = supportPageForms[key];

    // Helper to update specific fields in the state
    const updateField = (field: keyof typeof formData, value: any) => {
        setSupportPageForms(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    return (
        <div className="max-w-3xl">
            <div className="bg-white rounded-lg">
                <div className="space-y-6">
                    {/* Title and Slug Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder={`Enter ${label} title`}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                URL Slug (Required for SEO) *
                            </label>
                            <input
                                type="text"
                                value={formData.slug || ''}
                                onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                placeholder="e.g. shipping-policy"
                                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg outline-none transition font-mono text-xs"
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Content (HTML or Markdown) *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => updateField('content', e.target.value)}
                            placeholder={`Enter ${label} content`}
                            rows={12}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-mono text-sm"
                        />
                    </div>

                    {/* SEO Section */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search Engine Optimization (SEO)</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaTitle || ''}
                                    onChange={(e) => updateField('metaTitle', e.target.value)}
                                    placeholder="Page title for Google"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            <div className="flex items-end pb-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublished}
                                        onChange={(e) => updateField('isPublished', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    Publish Page (Visible to public)
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Meta Description
                            </label>
                            <textarea
                                value={formData.metaDescription || ''}
                                onChange={(e) => updateField('metaDescription', e.target.value)}
                                placeholder="Brief summary for search results..."
                                maxLength={160}
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-gray-400">Recommended: 150-160 characters</p>
                                <p className={`text-xs ${formData?.metaDescription && formData?.metaDescription?.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {formData.metaDescription?.length || 0}/160
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 !mt-0 border-t border-gray-100">
                        <Button 
                            variant="primary" 
                            onClick={() => handleSubmitSupportPage(key, formData)}
                            className="flex items-center gap-2 px-6 py-2.5 shadow-sm"
                            icon={<Check size={18} />}
                        >
                            Save {label} Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
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
            case 'website-pages':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Website Pages</h3>
                            <Button variant="primary" onClick={() => openPageModal('create')}>
                                Add Page
                            </Button>
                        </div>

                        {pagesLoading ? (
                            <p>Loading pages...</p>
                        ) : (
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-gray-600">Slug</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Title</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Published</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Order</th>
                                            <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {pages.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-3 text-center text-sm text-gray-500">
                                                    No website pages available.
                                                </td>
                                            </tr>
                                        ) : (
                                            pages.map((page) => (
                                                <tr key={page.id}>
                                                    <td className="px-4 py-2">{page.slug}</td>
                                                    <td className="px-4 py-2">{page.title}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            page.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {page.isPublished ? 'Published' : 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2">{page.order}</td>
                                                    <td className="px-4 py-2 flex gap-1 flex-wrap">
                                                        <Button size="sm" onClick={() => openPageModal('edit', page)}>
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => handleToggleActive('website-pages', page)}
                                                        >
                                                            {page.isPublished ? 'Unpublish' : 'Publish'}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => handleDeleteEntity('website-pages', page.slug, page.title)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'about-us':
                return renderSupportPageForm('about-us', 'About Us');
            case 'shipping-policy':
                return renderSupportPageForm('shipping-policy', 'Shipping Policy');
            case 'returns-refunds':
                return renderSupportPageForm('returns-refunds', 'Returns & Refunds');
            case 'faqs':
                return renderSupportPageForm('faqs', 'FAQs');
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

                {/* Tab Navigation - Scrollable Container */}
                <div className="mt-6 border-b border-gray-200 overflow-hidden">
                    {/* Content Tabs */}
                    <div className="overflow-x-auto">
                        <nav className="flex space-x-1 min-w-min px-1">
                            {tabs.filter(tab => ['banners', 'hero', 'sections', 'testimonials', 'instagram'].includes(tab.id)).map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    title={tab.label}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs font-semibold">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Support Pages Tabs */}
                    <div className="border-t border-gray-100 bg-gray-50 overflow-x-auto">
                        <nav className="flex space-x-1 min-w-min px-1">
                            {tabs.filter(tab => ['about-us', 'shipping-policy', 'returns-refunds', 'faqs'].includes(tab.id)).map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                    title={tab.label}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs font-semibold">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
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
