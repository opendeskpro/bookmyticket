import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    MoreHorizontal, ChevronDown, Filter, Info, ArrowLeft,
    DollarSign, Percent, Settings2
} from 'lucide-react';

interface PaymentMethod {
    id: string;
    name: string;
    minLimit: string;
    maxLimit: string;
    fixedCharge: string;
    percentCharge: string;
    status: 'Active' | 'Deactive';
}

const WithdrawMethods: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

    // Mock Data based on reference
    const [methods, setMethods] = useState<PaymentMethod[]>([
        { id: '1', name: 'Bitcoin', minLimit: '50.00 USD', maxLimit: '1000.00 USD', fixedCharge: '10.00 USD', percentCharge: '5%', status: 'Active' },
        { id: '2', name: 'Perfect Money', minLimit: '10.00 USD', maxLimit: '500.00 USD', fixedCharge: '2.00 USD', percentCharge: '2%', status: 'Active' },
        { id: '3', name: 'Bank Transfer', minLimit: '100.00 USD', maxLimit: '5000.00 USD', fixedCharge: '25.00 USD', percentCharge: '1%', status: 'Deactive' },
    ]);

    const handleToggleStatus = (id: string) => {
        setMethods(prev => prev.map(m =>
            m.id === id ? { ...m, status: m.status === 'Active' ? 'Deactive' : 'Active' } : m
        ));
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this payment method?')) {
            setMethods(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for adding/editing would go here
        setIsModalOpen(false);
        setEditingMethod(null);
    };

    return (
        <div className={`p-8 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Withdraw Payment Methods</h2>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                        Configure gateways for organiser fund extraction.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingMethod(null);
                        setIsModalOpen(true);
                    }}
                    className="px-6 py-3 bg-[#38bdf8] text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#38bdf8] transition-all shadow-xl shadow-[#38bdf8]/20 flex items-center gap-2 italic active:scale-95"
                >
                    <Plus size={16} /> Add New Method
                </button>
            </div>

            {/* Table Container */}
            <div className={`rounded-[2rem] border overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                {/* Search Bar */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH METHODS..."
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-[#1e2736] border-white/5 placeholder:text-white/10' : 'bg-slate-50 border-slate-200 placeholder:text-slate-400'
                                }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white/40' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`text-[10px] font-black uppercase tracking-widest border-b ${theme === 'dark' ? 'bg-white/5 text-white/40 border-white/5' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                <th className="px-8 py-5">#</th>
                                <th className="px-6 py-5">Method Name</th>
                                <th className="px-6 py-5">Min Limit</th>
                                <th className="px-6 py-5">Max Limit</th>
                                <th className="px-6 py-5">Manage Form</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions Hub</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {methods.map((method, idx) => (
                                <tr key={method.id} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                    <td className="px-8 py-6 text-[11px] font-black text-white/60 font-mono italic">{idx + 1}</td>
                                    <td className="px-6 py-6 font-black text-[11px] uppercase tracking-widest italic">{method.name}</td>
                                    <td className="px-6 py-6 font-black text-[11px] font-mono">{method.minLimit}</td>
                                    <td className="px-6 py-6 font-black text-[11px] font-mono">{method.maxLimit}</td>
                                    <td className="px-6 py-6">
                                        <button
                                            onClick={() => navigate(`/admin/withdraw/manage-form/${method.id}`)}
                                            className="px-4 py-1.5 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] text-[9px] font-black uppercase tracking-widest border border-[#38bdf8]/20 hover:bg-[#38bdf8] hover:text-white transition-all italic"
                                        >
                                            <Settings2 size={12} className="inline mr-1" /> Manage Form
                                        </button>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(method.id)}
                                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${method.status === 'Active'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white'
                                                : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white'
                                                }`}
                                        >
                                            {method.status}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingMethod(method);
                                                    setIsModalOpen(true);
                                                }}
                                                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-white/5 text-purple-400 hover:bg-purple-500 hover:text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white'}`}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(method.id)}
                                                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-white/5 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'}`}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className={`p-6 border-t flex items-center justify-between ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Showing 1 to {methods.length} of {methods.length} entries</p>
                    <div className="flex gap-1">
                        <button className={`px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white/20' : 'bg-white border-slate-200 text-slate-300'}`} disabled>Prev</button>
                        <button className="px-4 py-1.5 rounded-lg bg-[#38bdf8] text-white text-[9px] font-black uppercase shadow-lg shadow-[#38bdf8]/20">1</button>
                        <button className={`px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white/40 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}>Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className={`relative w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-[#131922] border-white/10' : 'bg-white border-slate-200'}`}>
                        <div className="p-10">
                            <h3 className="text-xl font-black italic tracking-tighter uppercase mb-2">
                                {editingMethod ? 'Update Payment Method' : 'Add New methodology'}
                            </h3>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-10">
                                Define quantum limits and charge protocols.
                            </p>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${theme === 'dark' ? 'text-white/20' : 'text-slate-500'}`}>Method Name</label>
                                    <input
                                        type="text"
                                        defaultValue={editingMethod?.name}
                                        className={`w-full px-6 py-4 rounded-2xl border text-[13px] font-black italic outline-none focus:border-[#38bdf8] transition-all uppercase ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                                            }`}
                                        placeholder="E.G. BANK TRANSFER"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${theme === 'dark' ? 'text-white/20' : 'text-slate-500'}`}>Min Limit</label>
                                        <div className="relative">
                                            <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`} size={14} />
                                            <input
                                                type="text"
                                                defaultValue={editingMethod?.minLimit.split(' ')[0]}
                                                className={`w-full pl-10 pr-6 py-4 rounded-2xl border text-[13px] font-black italic outline-none focus:border-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${theme === 'dark' ? 'text-white/20' : 'text-slate-500'}`}>Max Limit</label>
                                        <div className="relative">
                                            <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`} size={14} />
                                            <input
                                                type="text"
                                                defaultValue={editingMethod?.maxLimit.split(' ')[0]}
                                                className={`w-full pl-10 pr-6 py-4 rounded-2xl border text-[13px] font-black italic outline-none focus:border-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${theme === 'dark' ? 'text-white/20' : 'text-slate-500'}`}>Fixed Charge</label>
                                        <input
                                            type="text"
                                            defaultValue={editingMethod?.fixedCharge.split(' ')[0]}
                                            className={`w-full px-6 py-4 rounded-2xl border text-[13px] font-black italic outline-none focus:border-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                }`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${theme === 'dark' ? 'text-white/20' : 'text-slate-500'}`}>Percentage Charge</label>
                                        <div className="relative">
                                            <Percent className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`} size={14} />
                                            <input
                                                type="text"
                                                defaultValue={editingMethod?.percentCharge.replace('%', '')}
                                                className={`w-full px-6 py-4 rounded-2xl border text-[13px] font-black italic outline-none focus:border-[#38bdf8] transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#38bdf8] text-white font-black py-5 rounded-3xl text-[10px] uppercase tracking-widest italic shadow-2xl shadow-[#38bdf8]/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {editingMethod ? 'Save Changes' : 'Initialize Method'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className={`px-10 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest italic transition-all ${theme === 'dark' ? 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawMethods;
