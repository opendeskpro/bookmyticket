import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS } from '../../constants/mockData';

const AdminDashboard: React.FC = () => {
    const user = MOCK_USERS[2]; // Mock Admin

    return (
        <DashboardLayout user={user}>
            <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Users', value: '15,400', color: 'bg-blue-50 text-blue-600' },
                    { label: 'Active Organizers', value: '120', color: 'bg-purple-50 text-purple-600' },
                    { label: 'Live Events', value: '45', color: 'bg-green-50 text-green-600' },
                    { label: 'Commission Earned', value: '₹12,50,000', color: 'bg-yellow-50 text-yellow-600' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${stat.color}`}>
                            <span className="text-xl font-bold">#</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* KYC Approvals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Pending KYC Approvals</h2>
                    <button className="text-sm text-[#7c3aed] font-medium hover:underline">View All</button>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Organizer</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Business Type</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Documents</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map(i => (
                            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <span className="font-medium text-sm">Organizer {i}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">Private Ltd.</td>
                                <td className="p-4 text-sm text-blue-600 hover:underline cursor-pointer">View Docs</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">PENDING</span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-bold hover:bg-green-200">Approve</button>
                                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-bold hover:bg-red-200">Reject</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
