import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Button from '../../components/Shared/UI/Button';
import { Save, Server, CreditCard, Mail } from 'lucide-react';
import { User } from '../../types';

interface SystemSettingsProps {
    user: User | null;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ user }) => {

    return (
        <DashboardLayout user={user}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">System Configuration</h1>
                    <p className="text-gray-500">Manage global platform settings and fees.</p>
                </div>
                <Button>
                    <Save size={16} className="mr-2" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Config */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="text-[#FF006E]" />
                            <h2 className="text-lg font-bold">Fees & Commission</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label>
                                <input type="number" defaultValue={5} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                                <p className="text-xs text-gray-400 mt-1">Charged on every ticket sale</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tax / GST (%)</label>
                                <input type="number" defaultValue={18} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Server className="text-[#FF006E]" />
                            <h2 className="text-lg font-bold">System Status</h2>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
                            <div>
                                <p className="font-bold text-green-800">Operational</p>
                                <p className="text-xs text-green-600">All systems functioning normally</p>
                            </div>
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 accent-[#FF006E]" />
                            <span className="font-medium text-gray-700">Enable Maintenance Mode</span>
                        </label>
                    </div>
                </div>

                {/* Side Config */}
                <div className="space-y-8">
                    {/* Payment Gateway Config */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="text-[#FF006E]" />
                            <h2 className="text-lg font-bold">Payment Gateway</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                                <select className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E] bg-white">
                                    <option value="razorpay">Razorpay</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="payu">PayU</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">API Key / Publishable Key</label>
                                <input type="password" placeholder="pk_test_..." className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key / Salt</label>
                                <input type="password" placeholder="sk_test_..." className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>

                            <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-sm text-gray-600 font-medium">Test Mode (Sandbox)</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF006E]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Mail className="text-[#FF006E]" />
                            <h2 className="text-lg font-bold">SMTP Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                                <input type="text" defaultValue="smtp.sendgrid.net" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                                <input type="text" defaultValue="587" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </DashboardLayout >
    );
};

export default SystemSettings;
