import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Button from '../../components/Shared/UI/Button';
import { User, Lock, Bell, Globe } from 'lucide-react';

interface OrganizerSettingsProps {
    user: User | null;
}

const OrganizerSettings: React.FC<OrganizerSettingsProps> = ({ user }) => {

    return (
        <DashboardLayout user={user}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">account Settings</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">

                    {/* Public Profile */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="text-[#FF006E]" />
                            <h2 className="text-lg font-bold">Public Profile</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                                <input type="text" defaultValue={user.organizationName} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                <input type="email" defaultValue={user.email} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                <textarea className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" rows={3} defaultValue="Leading event management company hosting premium tech and music events."></textarea>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button size="sm">Save Changes</Button>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="text-[#FF006E]" />
                            <h2 className="text-lg font-bold">Security</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button size="sm" variant="outline">Update Password</Button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="text-[#FF006E]" />
                            <h2 className="text-lg font-bold">Notifications</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-500">Receive emails about new bookings and payouts.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF006E]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default OrganizerSettings;
