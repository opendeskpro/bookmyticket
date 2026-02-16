import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Save, Ticket } from 'lucide-react';

const SupportSettings: React.FC = () => {
    const { theme } = useTheme();
    const [isSupportEnabled, setIsSupportEnabled] = useState(true);

    const handleSave = () => {
        // TODO: Implement save logic
        console.log('Settings saved', { isSupportEnabled });
        alert('Settings saved successfully!');
    };

    return (
        <div className={`p-6 md:p-10 min-h-screen ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Support Ticket Settings</h1>
                        <p className={`mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                            Configure the global availability of the support ticket system.
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-[#3A86FF] hover:bg-[#2f6cdb] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>

                <div className={`p-8 rounded-[2rem] border shadow-xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="space-y-8">
                        {/* Support Ticket System Toggle */}
                        <div className="flex items-center justify-between pb-8 border-b border-dashed border-gray-200 dark:border-white/10">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                    <Ticket size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Support Ticket System</h3>
                                    <p className={`text-sm mt-1 max-w-md ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>
                                        Enable or disable the support ticket module. If disabled, users will not be able to create new support requests.
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isSupportEnabled}
                                    onChange={(e) => setIsSupportEnabled(e.target.checked)}
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#3A86FF]"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportSettings;
