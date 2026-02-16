import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTheme } from '../../../contexts/ThemeContext';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const EventSettings: React.FC = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        enable_country: true,
        enable_state: true,
        enable_city: true
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('general_settings')
                .select('value')
                .eq('key', 'event_specifications')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setSettings(data.value);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const { error } = await supabase
                .from('general_settings')
                .upsert({
                    key: 'event_specifications',
                    value: settings,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Settings updated successfully!' });

            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Failed to save settings.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`p-6 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Event Settings</h2>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Configure global settings for event creation and display.
                </p>
            </div>

            <div className={`max-w-2xl rounded-2xl border p-8 ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>

                {loading ? (
                    <div className="text-center py-12">Loading settings...</div>
                ) : (
                    <div className="space-y-8">

                        {/* Country Toggle */}
                        <div className={`p-4 rounded-xl border flex items-center justify-between ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <div>
                                <h3 className="font-bold text-sm">Enable Country Field</h3>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    If disabled, the country selection will be hidden in event forms.
                                </p>
                            </div>
                            <button
                                onClick={() => handleToggle('enable_country')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.enable_country ? 'bg-[#2563eb]' : 'bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.enable_country ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* State Toggle */}
                        <div className={`p-4 rounded-xl border flex items-center justify-between ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <div>
                                <h3 className="font-bold text-sm">Enable State Field</h3>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    If disabled, the state selection will be hidden in event forms.
                                </p>
                            </div>
                            <button
                                onClick={() => handleToggle('enable_state')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.enable_state ? 'bg-[#2563eb]' : 'bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.enable_state ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* City Toggle */}
                        <div className={`p-4 rounded-xl border flex items-center justify-between ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <div>
                                <h3 className="font-bold text-sm">Enable City Field</h3>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    If disabled, the city selection will be hidden in event forms.
                                </p>
                            </div>
                            <button
                                onClick={() => handleToggle('enable_city')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.enable_city ? 'bg-[#2563eb]' : 'bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.enable_city ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex items-center justify-between border-t border-gray-700/20 mt-6">
                            <div className="h-6">
                                {message && (
                                    <div className={`flex items-center gap-2 text-xs font-bold ${message.type === 'success' ? 'text-green-500' : 'text-red-500'} animate-in fade-in slide-in-from-left-2`}>
                                        {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                        {message.text}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#2563eb] hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>Saving...</>
                                ) : (
                                    <><Save size={18} /> Save Settings</>
                                )}
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default EventSettings;
