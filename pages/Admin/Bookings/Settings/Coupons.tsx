import React, { useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Plus, Search, Edit2, Trash2, X, Calendar, Tag, Percent } from 'lucide-react';

const Coupons: React.FC = () => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data
    const [coupons, setCoupons] = useState([
        { id: 1, name: 'Summer Sale', code: 'SUMMER25', type: 'Percentage', value: '25%', created: '2024-05-01', status: 'Active' },
        { id: 2, name: 'Welcome Bonus', code: 'WELCOME10', type: 'Fixed', value: '$10.00', created: '2024-01-15', status: 'Active' },
        { id: 3, name: 'Flash Deal', code: 'FLASH50', type: 'Percentage', value: '50%', created: '2023-11-20', status: 'Expired' },
    ]);

    const getStatusColor = (status: string) => {
        return status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <div className={`p-6 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Manage discount coupons for your events.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                >
                    <Plus size={18} /> Add Coupon
                </button>
            </div>

            {/* Filter Bar */}
            <div className={`p-4 rounded-xl border mb-6 flex flex-col md:flex-row gap-4 items-center justify-between ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="relative w-full md:w-80">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} size={16} />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-[#131922] border-gray-700 placeholder:text-gray-600' : 'bg-slate-50 border-slate-200 placeholder:text-slate-400'}`}
                    />
                </div>
            </div>

            {/* Coupons Table */}
            <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'border-gray-700 bg-[#1e2736]' : 'border-slate-200 bg-white shadow-sm'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-xs uppercase font-semibold ${theme === 'dark' ? 'bg-[#131922] text-gray-400' : 'bg-slate-50 text-slate-500'}`}>
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-slate-100'}`}>
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-[#131922]/50' : 'hover:bg-slate-50'}`}>
                                    <td className={`px-6 py-4 font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{coupon.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs tracking-wider border border-slate-200 dark:border-slate-700">
                                            {coupon.code}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                        <div className="flex items-center gap-1.5">
                                            {coupon.type === 'Percentage' ? <Percent size={14} className="text-blue-500" /> : <span className="text-green-500 font-bold">$</span>}
                                            {coupon.value}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{coupon.created}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${getStatusColor(coupon.status)}`}>
                                            {coupon.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Coupon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#1e2736]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold">Add New Coupon</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Coupon Name</label>
                                    <input type="text" placeholder="e.g. Summer Sale" className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Coupon Code</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input type="text" placeholder="e.g. SUMMER25" className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Coupon Type</label>
                                    <select className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                                        <option>Percentage (%)</option>
                                        <option>Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Value</label>
                                    <input type="number" placeholder="0.00" className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input type="date" className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">End Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input type="date" className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Events</label>
                                <select className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-[#131922] border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <option>Select Events...</option>
                                    <option>All Events</option>
                                    <option>Specific Events (Multi-select)</option>
                                </select>
                                <p className="text-xs text-slate-500">Select which events this coupon applies to.</p>
                            </div>
                        </div>

                        <div className={`p-6 border-t flex justify-end gap-3 ${theme === 'dark' ? 'border-gray-700 bg-black/20' : 'border-gray-100 bg-gray-50'}`}>
                            <button onClick={() => setIsModalOpen(false)} className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>
                                Cancel
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all">
                                Create Coupon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
