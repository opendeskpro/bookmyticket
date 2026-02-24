import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Button from '../../components/Shared/UI/Button';
import { Save, Upload, Plus, Trash, Globe, Layout, Image as ImageIcon, Smartphone, ArrowLeft, Zap, Clapperboard } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { User } from '../../types';

interface AdminSiteSettingsProps {
    user: User | null;
}

const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({ user }) => {
    const navigate = useNavigate();
    const { updateConfig } = useSiteConfig();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Brand Assets
    const [brandAssets, setBrandAssets] = useState({
        logo_url: '',
        site_name: ''
    });

    const [settings, setSettings] = useState({
        enable_movies_page: true
    });

    // Footer Links
    const [footerConfig, setFooterConfig] = useState<{
        top_links: { label: string; url: string }[];
        columns: { title: string; links: { label: string; url: string }[] }[];
        social_links: { platform: string; url: string }[];
    }>({
        top_links: [],
        columns: [],
        social_links: []
    });
    const [mobileMenu, setMobileMenu] = useState<{ label: string; icon: string; url: string }[]>([]);
    const [movieApi, setMovieApi] = useState({
        client: '',
        apiKey: '',
        authorization: '',
        territory: '',
        apiVersion: ''
    });

    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') || 'general';
    const [activeTab, setActiveTab] = useState<'general' | 'footer' | 'mobile' | 'movie_api'>('general');

    // Sync state with URL params
    useEffect(() => {
        if (tabParam && ['general', 'footer', 'mobile', 'movie_api'].includes(tabParam)) {
            setActiveTab(tabParam as any);
        }
    }, [tabParam]);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const brandData = await api.siteConfig.get('brand_assets');
            if (brandData) setBrandAssets(brandData);

            const settingsConfig = await api.siteConfig.get('settings');
            if (settingsConfig) setSettings(prev => ({ ...prev, ...settingsConfig }));

            const mobileData = await api.siteConfig.get('mobile_menu');
            if (mobileData) setMobileMenu(mobileData);

            const movieApiData = await api.siteConfig.get('movie_api');
            if (movieApiData) setMovieApi(movieApiData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            toast.loading("Uploading...", { id: 'upload' });

            // Upload to Supabase Storage
            const url = await api.siteConfig.uploadLogo(file);

            // Update state
            setBrandAssets(prev => ({ ...prev, logo_url: url }));

            toast.dismiss('upload');
            toast.success("Logo uploaded successfully!");
        } catch (error) {
            console.error(error);
            toast.dismiss('upload');
            toast.error("Upload failed. Ensure 'public-assets' bucket exists.");
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            if (activeTab === 'general') {
                await Promise.all([
                    updateConfig('brand', brandAssets),
                    updateConfig('enable_movies_page', settings.enable_movies_page)
                ]);
            } else if (activeTab === 'footer') {
                await updateConfig('footer', footerConfig);
            } else if (activeTab === 'mobile') {
                await updateConfig('mobile_menu', mobileMenu);
            } else if (activeTab === 'movie_api') {
                await updateConfig('movieApi', movieApi);
            }
            toast.success("Settings saved successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    // Helper functions for Footer Editor
    const addColumn = () => {
        setFooterConfig(prev => ({
            ...prev,
            columns: [...prev.columns, { title: 'New Column', links: [] }]
        }));
    };

    const updateColumnTitle = (index: number, title: string) => {
        const newCols = [...footerConfig.columns];
        newCols[index].title = title;
        setFooterConfig({ ...footerConfig, columns: newCols });
    };

    const addLinkToColumn = (colIndex: number) => {
        const newCols = [...footerConfig.columns];
        newCols[colIndex].links.push({ label: 'New Link', url: '#' });
        setFooterConfig({ ...footerConfig, columns: newCols });
    };

    const updateLinkInColumn = (colIndex: number, linkIndex: number, field: 'label' | 'url', value: string) => {
        const newCols = [...footerConfig.columns];
        newCols[colIndex].links[linkIndex][field] = value;
        setFooterConfig({ ...footerConfig, columns: newCols });
    };

    const removeLinkFromColumn = (colIndex: number, linkIndex: number) => {
        const newCols = [...footerConfig.columns];
        newCols[colIndex].links.splice(linkIndex, 1);
        setFooterConfig({ ...footerConfig, columns: newCols });
    };

    const removeColumn = (index: number) => {
        const newCols = [...footerConfig.columns];
        newCols.splice(index, 1);
        setFooterConfig({ ...footerConfig, columns: newCols });
    };

    if (loading) return (
        <DashboardLayout user={user}>
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-red-100 border-t-[#FF006E] rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Loading settings...</p>
                </div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout user={user}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
                        <p className="text-sm text-gray-500">Manage global branding and footer content</p>
                    </div>
                </div>
                <Button onClick={saveSettings} disabled={saving} className="flex items-center gap-2">
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="w-full">
                {/* Main Content Area */}
                <div className="w-full max-w-5xl mx-auto">
                    {activeTab === 'general' && (
                        <div className="max-w-2xl bg-white rounded-3xl p-8 border border-black/[0.05] shadow-sm space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="bg-violet-50 p-2 rounded-xl"><ImageIcon size={20} className="text-[#7c3aed]" /></div>
                                    Logo Configuration
                                </h3>
                                <div className="flex flex-col sm:flex-row items-start gap-8">
                                    <div className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex items-center justify-center overflow-hidden relative group cursor-pointer shrink-0">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={handleLogoUpload}
                                        />
                                        {brandAssets.logo_url ? (
                                            <>
                                                <img src={brandAssets.logo_url} alt="Logo" className="w-full h-full object-contain p-4" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="text-white" size={24} />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <Upload size={32} />
                                                <span className="text-xs font-bold uppercase tracking-widest">Upload</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full space-y-6">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Logo URL</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-gray-50/50 border border-black/[0.05] rounded-2xl text-sm font-medium focus:bg-white focus:border-[#FF006E] focus:ring-4 focus:ring-[#FF006E]/10 outline-none transition-all"
                                                placeholder="https://..."
                                                value={brandAssets.logo_url}
                                                onChange={(e) => setBrandAssets({ ...brandAssets, logo_url: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Site Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-gray-50/50 border border-black/[0.05] rounded-2xl text-sm font-medium focus:bg-white focus:border-[#FF006E] focus:ring-4 focus:ring-[#FF006E]/10 outline-none transition-all"
                                                placeholder="BookMyTicket"
                                                value={brandAssets.site_name}
                                                onChange={(e) => setBrandAssets({ ...brandAssets, site_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="bg-yellow-50 p-2 rounded-xl"><Zap size={20} className="text-yellow-500" /></div>
                                    Feature Toggles
                                </h3>
                                <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-900">Movies Feature</h4>
                                            <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">Enable or disable the movies discovery page across the platform</p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                const newValue = !settings.enable_movies_page;
                                                setSettings({ ...settings, enable_movies_page: newValue });
                                            }}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${settings.enable_movies_page ? 'bg-[#7c3aed]' : 'bg-gray-300'}`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${settings.enable_movies_page ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'footer' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-black/[0.05] shadow-sm">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3"><Layout size={24} className="text-[#7c3aed]" /> Footer Columns</h3>
                                    <p className="text-sm text-gray-500 font-medium ml-9">Structure your website global footer</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={addColumn} className="flex items-center gap-2 rounded-xl px-5 py-3 h-auto">
                                    <Plus size={18} /> Add New Column
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {footerConfig.columns.map((col, colIndex) => (
                                    <div key={colIndex} className="bg-white rounded-[2.5rem] border border-black/[0.05] p-6 shadow-sm group hover:shadow-xl hover:shadow-black/[0.02] transition-all">
                                        <div className="flex items-center justify-between mb-6">
                                            <input
                                                type="text"
                                                className="font-black text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full text-lg tracking-tight uppercase"
                                                value={col.title}
                                                onChange={(e) => updateColumnTitle(colIndex, e.target.value)}
                                            />
                                            <button onClick={() => removeColumn(colIndex)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {col.links.map((link, linkIndex) => (
                                                <div key={linkIndex} className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-2xl border border-black/[0.03]">
                                                    <div className="flex-1 space-y-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Label</label>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white p-2.5 rounded-xl border border-black/[0.05] text-xs font-bold"
                                                                placeholder="Home"
                                                                value={link.label}
                                                                onChange={(e) => updateLinkInColumn(colIndex, linkIndex, 'label', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Target URL</label>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white p-2.5 rounded-xl border border-black/[0.05] text-xs font-medium text-gray-500"
                                                                placeholder="/"
                                                                value={link.url}
                                                                onChange={(e) => updateLinkInColumn(colIndex, linkIndex, 'url', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeLinkFromColumn(colIndex, linkIndex)} className="text-gray-300 hover:text-red-500 mt-6">
                                                        <Trash size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addLinkToColumn(colIndex)}
                                                className="w-full py-4 border-2 border-dashed border-black/[0.05] rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#FF006E] hover:border-[#FF006E]/30 hover:bg-red-50/30 transition-all"
                                            >
                                                + Add Link to Column
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'mobile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-black/[0.05] shadow-sm">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3"><Smartphone size={24} className="text-[#7c3aed]" /> Mobile Menu</h3>
                                    <p className="text-sm text-gray-500 font-medium ml-9">Configure bottom navigation items</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMobileMenu([...mobileMenu, { label: 'New Item', icon: 'Home', url: '/' }])}
                                    className="flex items-center gap-2 rounded-xl px-5 py-3 h-auto"
                                >
                                    <Plus size={18} /> Add Menu Item
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {mobileMenu.map((item, index) => (
                                    <div key={index} className="bg-white rounded-[2.5rem] border border-black/[0.05] p-8 shadow-sm group hover:shadow-xl hover:shadow-black/[0.02] transition-all">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-red-50 rounded-[1.25rem] flex items-center justify-center text-[#FF006E] shadow-sm">
                                                    <Smartphone size={24} />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="font-black text-gray-900 bg-transparent border-none focus:ring-0 p-0 text-lg uppercase tracking-tight"
                                                    value={item.label}
                                                    onChange={(e) => {
                                                        const newMenu = [...mobileMenu];
                                                        newMenu[index].label = e.target.value;
                                                        setMobileMenu(newMenu);
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newMenu = [...mobileMenu];
                                                    newMenu.splice(index, 1);
                                                    setMobileMenu(newMenu);
                                                }}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Icon Name (Lucide)</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-4 bg-gray-50/50 border border-black/[0.05] rounded-2xl text-xs font-bold focus:bg-white focus:border-[#FF006E] outline-none transition-all"
                                                    placeholder="Home, Search, User..."
                                                    value={item.icon}
                                                    onChange={(e) => {
                                                        const newMenu = [...mobileMenu];
                                                        newMenu[index].icon = e.target.value;
                                                        setMobileMenu(newMenu);
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Terminal Route</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-4 bg-gray-50/50 border border-black/[0.05] rounded-2xl text-xs font-medium text-gray-500 focus:bg-white focus:border-[#FF006E] outline-none transition-all"
                                                    placeholder="/dashboard..."
                                                    value={item.url}
                                                    onChange={(e) => {
                                                        const newMenu = [...mobileMenu];
                                                        newMenu[index].url = e.target.value;
                                                        setMobileMenu(newMenu);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'movie_api' && (
                        <div className="bg-white p-10 rounded-[3rem] border border-black/[0.05] shadow-sm space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-violet-50 p-4 rounded-[1.5rem] shadow-sm">
                                        <Clapperboard className="w-8 h-8 text-[#7c3aed]" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Movie API <span className="text-[#7c3aed]">Safe</span></h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Global Discovery Credentials</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Client Identifier</label>
                                    <input
                                        type="text"
                                        value={movieApi.client}
                                        onChange={(e) => setMovieApi({ ...movieApi, client: e.target.value })}
                                        className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50/50 border border-black/[0.05] focus:bg-white focus:border-[#FF006E] focus:ring-4 focus:ring-[#FF006E]/10 outline-none transition-all duration-300 text-sm font-bold"
                                        placeholder="NEXV"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Token (X-API-KEY)</label>
                                    <input
                                        type="password"
                                        value={movieApi.apiKey}
                                        onChange={(e) => setMovieApi({ ...movieApi, apiKey: e.target.value })}
                                        className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50/50 border border-black/[0.05] focus:bg-white focus:border-[#FF006E] focus:ring-4 focus:ring-[#FF006E]/10 outline-none transition-all duration-300 text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Authorization Signature</label>
                                    <input
                                        type="password"
                                        value={movieApi.authorization}
                                        onChange={(e) => setMovieApi({ ...movieApi, authorization: e.target.value })}
                                        className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50/50 border border-black/[0.05] focus:bg-white focus:border-[#FF006E] focus:ring-4 focus:ring-[#FF006E]/10 outline-none transition-all duration-300 text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Territory</label>
                                    <input
                                        type="text"
                                        value={movieApi.territory}
                                        onChange={(e) => setMovieApi({ ...movieApi, territory: e.target.value })}
                                        className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50/50 border border-black/[0.05] focus:bg-white focus:border-[#FF006E] focus:ring-4 focus:ring-[#FF006E]/10 outline-none transition-all duration-300 text-sm font-bold"
                                        placeholder="IN"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Version</label>
                                    <input
                                        type="text"
                                        value={movieApi.apiVersion}
                                        onChange={(e) => setMovieApi({ ...movieApi, apiVersion: e.target.value })}
                                        className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50/50 border border-black/[0.05] focus:bg-white focus:border-[#FF006E] focus:ring-4 focus:ring-[#FF006E]/10 outline-none transition-all duration-300 text-sm font-bold"
                                        placeholder="v201"
                                    />
                                </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#FF006E]/[0.02] to-orange-50/30 border border-[#FF006E]/10">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                                        <Zap className="w-6 h-6 text-[#FF006E]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-base font-black text-gray-900 tracking-tight uppercase">Platform Synchronization</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                            These credentials enable live synchronization with global movie databases.
                                            Changes take effect immediately across all movie discovery pages.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default AdminSiteSettings;
