import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Save, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Type, Layers, LayoutGrid } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCMS: React.FC = () => {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hero_banners');

    useEffect(() => {
        fetchCMSData();
    }, []);

    const fetchCMSData = async () => {
        try {
            const data = await api.cms.getHomepage();
            setSections(data);
        } catch (error) {
            toast.error('Failed to load CMS data');
        } finally {
            setLoading(false);
        }
    };

    const currentSection = sections.find(s => s.section_key === activeTab);

    const handleUpdateSection = async () => {
        if (!currentSection) return;
        try {
            await api.cms.updateSection(currentSection.section_key, currentSection.content, currentSection.title);
            toast.success(`${currentSection.title} updated successfully`);
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleInitialize = async () => {
        setLoading(true);
        try {
            await api.cms.updateSection('hero_banners', [
                {
                    title: "Experience the Magic of Cinema",
                    subtitle: "Book tickets for the latest Hollywood and Bollywood blockbusters. Experience the big screen like never before.",
                    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670",
                    cta: "Book Movies",
                    link: "/movies"
                }
            ], 'Hero Banners');
            await api.cms.updateSection('category_pins', [
                { name: "Movies", icon: "Film", route: "/events?category=Movies", color: "#F84464" },
                { name: "Events", icon: "Calendar", route: "/events?category=Events", color: "#4ADE80" }
            ], 'Categories');
            await fetchCMSData();
            toast.success('Database initialized with defaults');
        } catch (error) {
            toast.error('Initialization failed');
        } finally {
            setLoading(false);
        }
    };

    const updateContent = (newContent: any) => {
        setSections(prev => prev.map(s =>
            s.section_key === activeTab ? { ...s, content: newContent } : s
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F84464]"></div>
            </div>
        );
    }

    if (sections.length === 0) {
        return (
            <div className="p-6 max-w-2xl mx-auto text-center space-y-6 mt-20">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Layers className="text-gray-300" size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900">CMS Not Initialized</h2>
                    <p className="text-gray-500 font-medium mt-2">The homepage sections haven't been created in the database yet.</p>
                </div>
                <button
                    onClick={handleInitialize}
                    className="bg-[#F84464] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#D93654] transition-all"
                >
                    Initialize with Defaults
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <Layers className="text-[#F84464]" /> Home Page CMS
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage banners, categories, and homepage sections.</p>
                </div>
                <button
                    onClick={handleUpdateSection}
                    className="bg-[#F84464] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#D93654] transition-all shadow-lg shadow-[#F84464]/20"
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="flex gap-2 p-1 bg-gray-50 rounded-xl w-fit">
                {['hero_banners', 'category_pins'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === tab
                            ? 'bg-white text-[#F84464] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'hero_banners' && currentSection && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900">Hero Banners</h2>
                            <button
                                onClick={() => updateContent([...currentSection.content, { title: '', subtitle: '', image: '', cta: '', link: '' }])}
                                className="text-[#F84464] font-bold text-sm flex items-center gap-1 hover:underline"
                            >
                                <Plus size={16} /> Add Slide
                            </button>
                        </div>

                        <div className="grid gap-6">
                            {currentSection.content.map((slide: any, idx: number) => (
                                <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                                    <button
                                        onClick={() => updateContent(currentSection.content.filter((_: any, i: number) => i !== idx))}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Title</label>
                                                <div className="relative">
                                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={slide.title}
                                                        onChange={(e) => {
                                                            const newContent = [...currentSection.content];
                                                            newContent[idx].title = e.target.value;
                                                            updateContent(newContent);
                                                        }}
                                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#F84464] transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Subtitle</label>
                                                <textarea
                                                    value={slide.subtitle}
                                                    onChange={(e) => {
                                                        const newContent = [...currentSection.content];
                                                        newContent[idx].subtitle = e.target.value;
                                                        updateContent(newContent);
                                                    }}
                                                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#F84464] transition-all font-medium h-24"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Image URL</label>
                                                <div className="relative">
                                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={slide.image}
                                                        onChange={(e) => {
                                                            const newContent = [...currentSection.content];
                                                            newContent[idx].image = e.target.value;
                                                            updateContent(newContent);
                                                        }}
                                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#F84464] transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">CTA Text</label>
                                                    <input
                                                        type="text"
                                                        value={slide.cta}
                                                        onChange={(e) => {
                                                            const newContent = [...currentSection.content];
                                                            newContent[idx].cta = e.target.value;
                                                            updateContent(newContent);
                                                        }}
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#F84464] transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Target Link</label>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input
                                                            type="text"
                                                            value={slide.link}
                                                            onChange={(e) => {
                                                                const newContent = [...currentSection.content];
                                                                newContent[idx].link = e.target.value;
                                                                updateContent(newContent);
                                                            }}
                                                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#F84464] transition-all font-medium"
                                                            placeholder="/events"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {slide.image && (
                                                <div className="mt-2 relative aspect-[16/6] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                                                    <img src={slide.image} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-black text-[10px] uppercase tracking-widest">Image Preview</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'category_pins' && currentSection && (
                    <div className="p-6 space-y-6">
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <LayoutGrid size={20} className="text-[#F84464]" /> Category Pins
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentSection.content.map((cat: any, idx: number) => (
                                <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Name</label>
                                        <input
                                            type="text"
                                            value={cat.name}
                                            onChange={(e) => {
                                                const newContent = [...currentSection.content];
                                                newContent[idx].name = e.target.value;
                                                updateContent(newContent);
                                            }}
                                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#F84464] transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Color (HEX)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={cat.color}
                                                onChange={(e) => {
                                                    const newContent = [...currentSection.content];
                                                    newContent[idx].color = e.target.value;
                                                    updateContent(newContent);
                                                }}
                                                className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={cat.color}
                                                onChange={(e) => {
                                                    const newContent = [...currentSection.content];
                                                    newContent[idx].color = e.target.value;
                                                    updateContent(newContent);
                                                }}
                                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#F84464] transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCMS;
