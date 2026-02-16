import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, Eye, Edit, Trash2, MoreHorizontal, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Organizer {
    id: string;
    username: string;
    email: string;
    phone: string;
    accountStatus: 'Active' | 'Deactive';
    emailStatus: 'Verified' | 'Not Verified';
    avatar: string;
}

const MOCK_ORGANIZERS: Organizer[] = [
    { id: '1', username: 'event_pro', email: 'pro@events.com', phone: '+1234567890', accountStatus: 'Active', emailStatus: 'Verified', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', username: 'party_planner', email: 'planner@party.com', phone: '+0987654321', accountStatus: 'Deactive', emailStatus: 'Not Verified', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', username: 'music_fest', email: 'contact@musicfest.com', phone: '+1122334455', accountStatus: 'Active', emailStatus: 'Verified', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', username: 'tech_con', email: 'info@techcon.io', phone: '+5544332211', accountStatus: 'Active', emailStatus: 'Not Verified', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', username: 'wedding_exp', email: 'love@weddings.com', phone: '+6677889900', accountStatus: 'Deactive', emailStatus: 'Verified', avatar: 'https://i.pravatar.cc/150?u=5' },
];

const RegisteredOrganizers: React.FC = () => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [organizers, setOrganizers] = useState<Organizer[]>(MOCK_ORGANIZERS);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(organizers.map(o => o.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete selected organizers?')) {
            setOrganizers(organizers.filter(o => !selectedIds.includes(o.id)));
            setSelectedIds([]);
        }
    };

    const toggleStatus = (id: string, type: 'account' | 'email') => {
        setOrganizers(organizers.map(org => {
            if (org.id === id) {
                if (type === 'account') {
                    return { ...org, accountStatus: org.accountStatus === 'Active' ? 'Deactive' : 'Active' };
                } else {
                    return { ...org, emailStatus: org.emailStatus === 'Verified' ? 'Not Verified' : 'Verified' };
                }
            }
            return org;
        }));
    };

    const filteredOrganizers = organizers.filter(org =>
        org.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`p-6 md:p-10 min-h-screen ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Registered Organizers</h1>
                        <p className={`mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                            Manage all registered organizers on the platform.
                        </p>
                    </div>
                    <Link to="/admin/organizers/add" className="px-6 py-3 bg-[#3A86FF] hover:bg-[#2f6cdb] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95 text-center">
                        + Add Organizer
                    </Link>
                </div>

                <div className={`p-6 rounded-[2rem] border shadow-xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`} size={18} />
                            <input
                                type="text"
                                placeholder="Search by Username or Email..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className={`w-full py-3 pl-12 pr-4 rounded-xl border outline-none transition-all ${theme === 'dark'
                                        ? 'bg-[#0c1017] border-white/10 focus:border-[#3A86FF] text-white placeholder:text-white/20'
                                        : 'bg-slate-50 border-slate-200 focus:border-[#3A86FF] text-slate-900 placeholder:text-slate-400'
                                    }`}
                            />
                        </div>
                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleDelete}
                                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                    <th className="py-4 px-4 text-left w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === organizers.length && organizers.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300 text-[#3A86FF] focus:ring-[#3A86FF]"
                                        />
                                    </th>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Organizer</th>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Contact Info</th>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Account Status</th>
                                    <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Email Status</th>
                                    <th className={`py-4 px-4 text-right text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrganizers.map((org) => (
                                    <tr key={org.id} className={`border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                        <td className="py-4 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(org.id)}
                                                onChange={() => handleSelect(org.id)}
                                                className="rounded border-gray-300 text-[#3A86FF] focus:ring-[#3A86FF]"
                                            />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                                    <img src={org.avatar} alt={org.username} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold">{org.username}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs opacity-70">
                                                    <Mail size={12} /> {org.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs opacity-70">
                                                    <Phone size={12} /> {org.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => toggleStatus(org.id, 'account')}
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${org.accountStatus === 'Active'
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}
                                            >
                                                {org.accountStatus}
                                            </button>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => toggleStatus(org.id, 'email')}
                                                className={`px-3 py-1 rounded-full text-xs font-bold border ${org.emailStatus === 'Verified'
                                                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                    }`}
                                            >
                                                {org.emailStatus}
                                            </button>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-white/60' : 'text-slate-400'}`}>
                                                    <Eye size={16} />
                                                </button>
                                                <button className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-white/60' : 'text-slate-400'}`}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className={`p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors`}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrganizers.length === 0 && (
                        <div className="py-20 text-center opacity-50">
                            No organizers found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisteredOrganizers;
