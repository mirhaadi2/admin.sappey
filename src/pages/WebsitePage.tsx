import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash, Eye, Check, X, Upload, Image as ImageIcon } from '@phosphor-icons/react';
import { Card, CardHeader, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Toggle } from '../components/Toggle';
import { ErrorAlert } from '../components/ErrorAlert';
import { Toast } from '../components';

const WebsitePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('banners');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const tabs = [
        { id: 'banners', label: 'Banners', icon: <ImageIcon size={16} /> },
        { id: 'hero', label: 'Hero Section', icon: <Eye size={16} /> },
        { id: 'sections', label: 'Sections', icon: <Upload size={16} /> },
        { id: 'testimonials', label: 'Testimonials', icon: <Check size={16} /> },
        { id: 'instagram', label: 'Instagram', icon: <ImageIcon size={16} /> },
    ];

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

            {error && <ErrorAlert message={error} />}

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
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <ImageIcon size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {tabs.find(tab => tab.id === activeTab)?.label} Management
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Manage {activeTab} for your website. Content changes will be reflected immediately.
                        </p>
                        <Button variant="primary" icon={<Plus size={16} />}>
                            Add {tabs.find(tab => tab.id === activeTab)?.label.slice(0, -1)}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default WebsitePage;