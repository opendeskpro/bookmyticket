import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { User, UserRole } from '../../types';
import { Save, Loader2, Mail, Server, Key, ShieldCheck } from 'lucide-react';
import { getSiteConfig, updateSiteConfig } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface EmailIntegrationProps {
    user: User | null;
}

const EmailIntegration: React.FC<EmailIntegrationProps> = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'smtp' | 'imap' | 'oauth2'>('smtp');

    const [config, setConfig] = useState({
        smtp: {
            host: '',
            port: 587,
            username: '',
            password: '',
            secure: true,
            fromEmail: '',
            fromName: '',
            enabled: false,
        },
        imap: {
            host: '',
            port: 993,
            username: '',
            password: '',
            secure: true,
            enabled: false,
        },
        oauth2: {
            provider: 'google', // google, microsoft
            clientId: '',
            clientSecret: '',
            refreshToken: '',
            userEmail: '',
            enabled: false,
        }
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const savedConfig = await getSiteConfig('email_integration');
                if (savedConfig) {
                    setConfig(prev => ({
                        ...prev,
                        ...savedConfig
                    }));
                }
            } catch (error) {
                console.error("Error fetching email setup:", error);
                toast.error("Failed to load email configurations.");
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSiteConfig('email_integration', config);
            toast.success('Email configurations saved successfully!');
        } catch (error) {
            console.error("Error saving email setup:", error);
            toast.error('Failed to save configurations.');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (protocol: 'smtp' | 'imap' | 'oauth2', field: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [protocol]: {
                ...prev[protocol],
                [field]: value
            }
        }));
    };

    if (!user || user.role !== UserRole.ADMIN) {
        return (
            <DashboardLayout user={user}>
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500">Access denied. Admin privileges required.</p>
                </div>
            </DashboardLayout>
        );
    }

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Email Integration
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Configure SMTP for sending, IMAP for reading, or OAuth2 for secure API connections.
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#F84464] text-white px-6 py-2.5 rounded-lg hover:bg-[#E03C5A] transition-colors font-medium shadow-sm disabled:opacity-70"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'smtp' ? 'border-[#F84464] text-[#F84464]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('smtp')}
                    >
                        <Server size={16} /> SMTP (Sending)
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'imap' ? 'border-[#F84464] text-[#F84464]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('imap')}
                    >
                        <Mail size={16} /> IMAP (Reading)
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'oauth2' ? 'border-[#F84464] text-[#F84464]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('oauth2')}
                    >
                        <ShieldCheck size={16} /> OAuth2 (Modern)
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

                    {/* SMTP Protocol */}
                    {activeTab === 'smtp' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Outgoing Mail (SMTP)</h3>
                                    <p className="text-sm text-gray-500">Used for sending transactional emails (tickets, welcomes, OTPs).</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={config.smtp.enabled}
                                            onChange={(e) => handleInputChange('smtp', 'enabled', e.target.checked)}
                                        />
                                        <div className={`block w-12 h-7 rounded-full transition-colors ${config.smtp.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${config.smtp.enabled ? 'transform translate-x-5' : ''}`}></div>
                                    </div>
                                    <span className="ml-3 text-sm font-bold text-gray-700">{config.smtp.enabled ? 'Enabled' : 'Disabled'}</span>
                                </label>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${config.smtp.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">SMTP Host</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. smtp.gmail.com"
                                        value={config.smtp.host}
                                        onChange={(e) => handleInputChange('smtp', 'host', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">SMTP Port</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 587 or 465"
                                        value={config.smtp.port}
                                        onChange={(e) => handleInputChange('smtp', 'port', parseInt(e.target.value) || 587)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Username / Email</label>
                                    <input
                                        type="text"
                                        placeholder="you@yourdomain.com"
                                        value={config.smtp.username}
                                        onChange={(e) => handleInputChange('smtp', 'username', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">App Password</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="password"
                                            placeholder="••••••••••••"
                                            value={config.smtp.password}
                                            onChange={(e) => handleInputChange('smtp', 'password', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">From Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. BookMyTicket Support"
                                        value={config.smtp.fromName}
                                        onChange={(e) => handleInputChange('smtp', 'fromName', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">From Email</label>
                                    <input
                                        type="email"
                                        placeholder="noreply@yourdomain.com"
                                        value={config.smtp.fromEmail}
                                        onChange={(e) => handleInputChange('smtp', 'fromEmail', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="smtp-secure"
                                        checked={config.smtp.secure}
                                        onChange={(e) => handleInputChange('smtp', 'secure', e.target.checked)}
                                        className="w-4 h-4 text-[#F84464] border-gray-300 rounded focus:ring-[#F84464]"
                                    />
                                    <label htmlFor="smtp-secure" className="text-sm font-medium text-gray-700">Use Secure Connection (TLS/SSL)</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* IMAP Protocol */}
                    {activeTab === 'imap' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Incoming Mail (IMAP)</h3>
                                    <p className="text-sm text-gray-500">Used for processing inbound emails (like support replies or bounce handling).</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={config.imap.enabled}
                                            onChange={(e) => handleInputChange('imap', 'enabled', e.target.checked)}
                                        />
                                        <div className={`block w-12 h-7 rounded-full transition-colors ${config.imap.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${config.imap.enabled ? 'transform translate-x-5' : ''}`}></div>
                                    </div>
                                    <span className="ml-3 text-sm font-bold text-gray-700">{config.imap.enabled ? 'Enabled' : 'Disabled'}</span>
                                </label>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${config.imap.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">IMAP Host</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. imap.gmail.com"
                                        value={config.imap.host}
                                        onChange={(e) => handleInputChange('imap', 'host', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">IMAP Port</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 993"
                                        value={config.imap.port}
                                        onChange={(e) => handleInputChange('imap', 'port', parseInt(e.target.value) || 993)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        placeholder="you@yourdomain.com"
                                        value={config.imap.username}
                                        onChange={(e) => handleInputChange('imap', 'username', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Password</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="password"
                                            placeholder="••••••••••••"
                                            value={config.imap.password}
                                            onChange={(e) => handleInputChange('imap', 'password', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="imap-secure"
                                        checked={config.imap.secure}
                                        onChange={(e) => handleInputChange('imap', 'secure', e.target.checked)}
                                        className="w-4 h-4 text-[#F84464] border-gray-300 rounded focus:ring-[#F84464]"
                                    />
                                    <label htmlFor="imap-secure" className="text-sm font-medium text-gray-700">Use Secure Connection (SSL/TLS)</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OAuth2 Protocol */}
                    {activeTab === 'oauth2' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">OAuth2 Integration</h3>
                                    <p className="text-sm text-gray-500">Secure API-based email sending (Recommended for Google Workspace / Office 365).</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={config.oauth2.enabled}
                                            onChange={(e) => handleInputChange('oauth2', 'enabled', e.target.checked)}
                                        />
                                        <div className={`block w-12 h-7 rounded-full transition-colors ${config.oauth2.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${config.oauth2.enabled ? 'transform translate-x-5' : ''}`}></div>
                                    </div>
                                    <span className="ml-3 text-sm font-bold text-gray-700">{config.oauth2.enabled ? 'Enabled' : 'Disabled'}</span>
                                </label>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${config.oauth2.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Provider</label>
                                    <select
                                        value={config.oauth2.provider}
                                        onChange={(e) => handleInputChange('oauth2', 'provider', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none bg-white"
                                    >
                                        <option value="google">Google Workspace (Gmail)</option>
                                        <option value="microsoft">Microsoft Office 365</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Authorized Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="app@yourdomain.com"
                                        value={config.oauth2.userEmail}
                                        onChange={(e) => handleInputChange('oauth2', 'userEmail', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Client ID</label>
                                    <input
                                        type="text"
                                        placeholder="Client ID from Google Cloud Console / Azure"
                                        value={config.oauth2.clientId}
                                        onChange={(e) => handleInputChange('oauth2', 'clientId', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none font-mono text-sm"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Client Secret</label>
                                    <input
                                        type="password"
                                        placeholder="Client Secret"
                                        value={config.oauth2.clientSecret}
                                        onChange={(e) => handleInputChange('oauth2', 'clientSecret', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none font-mono text-sm"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Refresh Token</label>
                                    <textarea
                                        placeholder="Generated Refresh Token"
                                        value={config.oauth2.refreshToken}
                                        onChange={(e) => handleInputChange('oauth2', 'refreshToken', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none h-24 resize-none font-mono text-sm"
                                    />
                                    <p className="text-xs text-gray-500">You must use your provider's OAuth playground to generate the initial refresh token for this email application.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
};

export default EmailIntegration;
