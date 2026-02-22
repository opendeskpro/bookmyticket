import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS } from '../../constants/mockData';
import Button from '../../components/Shared/UI/Button';
import TagInput from '../../components/Shared/UI/TagInput';
import { Save, Home } from 'lucide-react';
import toast from 'react-hot-toast';

interface SEOData {
    keywords: string[];
    description: string;
}

interface PageSEO {
    [key: string]: SEOData;
}

const SEOInformation: React.FC = () => {
    const admin = MOCK_USERS[2];
    const [language, setLanguage] = useState('English');

    // Initial State mocking existing data
    const [seoData, setSeoData] = useState<PageSEO>({
        home: { keywords: ['home'], description: 'Home Description' },
        events: { keywords: ['Events'], description: 'Event Description' },
        organizer: { keywords: ['Organizer'], description: 'Organizer Description' },
        shop: { keywords: ['Shop'], description: 'Shop Description' },
        blog: { keywords: ['blog'], description: 'Blog Description' },
        faq: { keywords: ['faq'], description: 'FAQ Description' }
    });

    const handleUpdate = (page: string, field: keyof SEOData, value: string | string[]) => {
        setSeoData(prev => ({
            ...prev,
            [page]: {
                ...prev[page],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        toast.success('SEO Information Updated Successfully!');
        // API call would go here
    };

    const sections = [
        { id: 'home', title: 'Home Page' },
        { id: 'events', title: 'Events Page' },
        { id: 'organizer', title: 'Organizer Page' },
        { id: 'shop', title: 'Shop Page' },
        { id: 'blog', title: 'Blog Page' },
        { id: 'faq', title: 'FAQ Page' },
    ];

    return (
        <DashboardLayout user={admin}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">SEO Informations</h1>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <Home size={14} />
                            <span>/</span>
                            <span>Basic Settings</span>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">SEO Informations</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-20">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Update SEO Informations</h2>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 min-w-[120px]"
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {sections.map(section => (
                            <div key={section.id} className="space-y-4">
                                <div>
                                    <TagInput
                                        label={`Meta Keywords For ${section.title}`}
                                        tags={seoData[section.id].keywords}
                                        onTagsChange={(newTags) => handleUpdate(section.id, 'keywords', newTags)}
                                        placeholder="Enter Meta Keywords"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Description For {section.title}
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={seoData[section.id].description}
                                        onChange={(e) => handleUpdate(section.id, 'description', e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-sm"
                                        placeholder={`Enter ${section.title} Description`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-8">
                            <Save size={18} className="mr-2" /> Update SEO Informations
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SEOInformation;
