import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Badge from '../../components/Shared/UI/Badge';
import { Search, MoreVertical, Ban, Trash2 } from 'lucide-react';
import { User, UserRole } from '../../types';
import { supabase } from '../../lib/supabase';

interface ManageUsersProps {
    user: User | null;
}

interface AdminUserRow {
    id: string;
    full_name?: string;
    email?: string;
    role?: string;
    wallet_balance?: number;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ user }) => {
    const admin = user;
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState<AdminUserRow[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, role, wallet_balance')
                    .order('created_at', { ascending: false });
                if (error || cancelled) return;
                setAllUsers(data || []);
            } catch {
                if (!cancelled) setAllUsers([]);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <DashboardLayout user={admin}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Manage Users</h1>
                    <p className="text-gray-500">View and manage all registered users and organizers.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#7c3aed]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Contact</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allUsers
                                .filter(u =>
                                    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {user.full_name?.[0] || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{user.full_name || 'User'}</p>
                                                {/* organisationName could come from organisers table if needed */}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.role === UserRole.ADMIN ? 'danger' : user.role === UserRole.ORGANISER ? 'info' : 'neutral'}>
                                            {user.role || 'PUBLIC'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <p>{user.email}</p>
                                        <p className="text-gray-500">{user.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="success">Active</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Ban User">
                                            <Ban size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageUsers;
