import React, { useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Save, AlertCircle, Copy, Check } from 'lucide-react';

const Preference: React.FC = () => {
    const { theme } = useTheme();
    const [guestCheckout, setGuestCheckout] = useState('Active');
    const [ticketSending, setTicketSending] = useState('In Background');
    const [emailNotification, setEmailNotification] = useState('Active');
    const [smsNotification, setSmsNotification] = useState('Deactive');
    const [copied, setCopied] = useState(false);

    const cronCommand = "curl -s https://www.bookmyticket.io/cron/ticket-send > /dev/null 2>&1";

    const handleCopy = () => {
        navigator.clipboard.writeText(cronCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`p-6 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Booking Preference</h2>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Configure general settings for event bookings.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#1e2736] border-gray-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        General Settings
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Guest Checkout Status</label>
                            <select
                                value={guestCheckout}
                                onChange={(e) => setGuestCheckout(e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            >
                                <option value="Active">Active</option>
                                <option value="Deactive">Deactive</option>
                            </select>
                            <p className="text-xs text-slate-500">Allow users to book events without creating an account.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">How will the ticket be sent?</label>
                            <select
                                value={ticketSending}
                                onChange={(e) => setTicketSending(e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            >
                                <option value="Instant">Instant</option>
                                <option value="In Background">In Background (Recommended)</option>
                            </select>
                            <p className="text-xs text-slate-500">
                                "In Background" handles high traffic better but requires Cron Job setup.
                            </p>
                        </div>

                        <div className="pt-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                                <Save size={18} /> Update Preference
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cron Job Settings */}
                <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#1e2736] border-gray-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        Cron Job Setup
                    </h3>

                    <div className={`p-4 rounded-lg border mb-6 ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                        <div className="flex gap-3">
                            <AlertCircle className="shrink-0 mt-0.5" size={18} />
                            <div className="text-sm">
                                <p className="font-bold mb-1">Important</p>
                                <p className="opacity-90">If you selected "In Background" for ticket sending, you MUST configure this Cron Job on your server to run every minute.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cron Command</label>
                        <div className="relative group">
                            <input
                                type="text"
                                readOnly
                                value={cronCommand}
                                className={`w-full pl-4 pr-12 py-3 rounded-lg border font-mono text-xs outline-none ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                title="Copy command"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-400" />}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Schedule: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">* * * * *</span> (Every Minute)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preference;
