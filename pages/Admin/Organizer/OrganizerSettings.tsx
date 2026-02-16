import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Save } from 'lucide-react';

const OrganizerSettings: React.FC = () => {
    const { theme } = useTheme();
    const [needsApproval, setNeedsApproval] = useState(true);
    const [emailVerification, setEmailVerification] = useState(false);
    const [phoneVerification, setPhoneVerification] = useState(false);
    const [approvalNotice, setApprovalNotice] = useState('Your account needs admin approval. Please wait for the confirmation.');

    const handleSave = () => {
        // TODO: Implement save logic
        console.log('Settings saved', { needsApproval, emailVerification, phoneVerification, approvalNotice });
        alert('Settings saved successfully!');
    };

    return (
        <div className={`p-6 md:p-10 min-h-screen ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Organizer Settings</h1>
                        <p className={`mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                            Manage global settings for organizer registration and approval.
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
                        {/* Needs Admin Approval */}
                        <div className="flex items-center justify-between pb-8 border-b border-dashed border-gray-200 dark:border-white/10">
                            <div>
                                <h3 className="text-lg font-bold">Needs Admin Approval</h3>
                                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>
                                    If enabled, new organizers will need manual approval from an admin before they can access their dashboard.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={needsApproval}
                                    onChange={(e) => setNeedsApproval(e.target.checked)}
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#3A86FF]"></div>
                            </label>
                        </div>

                        {/* Email Verification */}
                        <div className="flex items-center justify-between pb-8 border-b border-dashed border-gray-200 dark:border-white/10">
                            <div>
                                <h3 className="text-lg font-bold">Email Verification</h3>
                                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>
                                    Require organizers to verify their email address before activation.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={emailVerification}
                                    onChange={(e) => setEmailVerification(e.target.checked)}
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#3A86FF]"></div>
                            </label>
                        </div>

                        {/* Phone Verification */}
                        <div className="flex items-center justify-between pb-8 border-b border-dashed border-gray-200 dark:border-white/10">
                            <div>
                                <h3 className="text-lg font-bold">Phone Verification</h3>
                                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>
                                    Require organizers to verify their phone number via OTP.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={phoneVerification}
                                    onChange={(e) => setPhoneVerification(e.target.checked)}
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#3A86FF]"></div>
                            </label>
                        </div>

                        {/* Admin Approval Notice */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold">Admin Approval Notice</h3>
                                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>
                                    Message displayed to organizers while their account is pending approval.
                                </p>
                            </div>
                            <textarea
                                value={approvalNotice}
                                onChange={(e) => setApprovalNotice(e.target.value)}
                                rows={4}
                                className={`w-full p-4 rounded-xl border outline-none transition-all ${theme === 'dark'
                                        ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF] text-white'
                                        : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF] text-slate-900'
                                    }`}
                                placeholder="Enter notice message..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerSettings;
