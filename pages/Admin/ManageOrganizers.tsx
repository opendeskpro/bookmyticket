import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { User, Organizer } from '../../types';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Search, Edit2, Trash2, Ban, CheckCircle, XCircle, Plus, Loader2, Key } from 'lucide-react';
import toast from 'react-hot-toast';

// Create a secondary client that doesn't overwrite the main auth session
const supabaseAdminBypass = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    }
);

interface ManageOrganizersProps {
    user: User | null;
}

const ManageOrganizers: React.FC<ManageOrganizersProps> = ({ user }) => {
    const [organizers, setOrganizers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Add Organizer Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newOrganizer, setNewOrganizer] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'ACTIVE',
        password: ''
    });

    const fetchOrganizers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('organisers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrganizers(data || []);
        } catch (error: any) {
            toast.error('Failed to fetch organizers');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizers();
    }, []);

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
        try {
            const { error } = await supabase
                .from('organisers')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Organizer ${newStatus === 'BANNED' ? 'banned' : 'activated'} successfully`);
            fetchOrganizers();
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this organizer? This action cannot be undone.')) return;
        try {
            const { error } = await supabase
                .from('organisers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Organizer deleted successfully');
            fetchOrganizers();
        } catch (error: any) {
            toast.error('Deletion failed');
        }
    };

    const handleResetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/#/auth?type=reset`,
            });
            if (error) throw error;
            toast.success(`Password reset email sent to ${email}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset email');
            console.error(error);
        }
    };

    const filteredOrganizers = organizers.filter(org => {
        const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (org.email && org.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'ALL' || org.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleAddOrganizer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newOrganizer.name || !newOrganizer.email || !newOrganizer.phone || !newOrganizer.password) {
            toast.error("Please fill in all required fields, including password.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Call the SQL RPC first (safest method)
            const { data: rpcData, error: rpcError } = await supabase.rpc('admin_add_organizer_user', {
                org_name: newOrganizer.name,
                org_email: newOrganizer.email,
                org_phone: newOrganizer.phone,
                org_status: newOrganizer.status,
                org_password: newOrganizer.password
            });

            if (rpcError) {
                // If RPC fails because it wasn't added to Supabase, fall back to frontend workaround
                console.warn("RPC admin_add_organizer_user not found. Falling back to frontend client bypass.", rpcError);

                // 1. Sign up user using secondary client (preventing admin logout)
                const { data: authData, error: authError } = await supabaseAdminBypass.auth.signUp({
                    email: newOrganizer.email,
                    password: newOrganizer.password,
                    options: {
                        data: { full_name: newOrganizer.name, role: "ORGANISER" }
                    }
                });

                if (authError) {
                    toast.error(`Auth Error: ${authError.message}`);
                    throw authError; // Stop execution
                }

                // Give database trigger a moment to process the new auth user and create the public profile
                await new Promise(r => setTimeout(r, 1000));

                // 2. We use the current admin session to force-update or insert the organizer public profile 
                // in case the Database trigger didn't handle the organisers table automatically.
                if (authData?.user?.id) {
                    const { error: insertError } = await supabase
                        .from('organisers')
                        .upsert([{
                            user_id: authData.user.id,
                            name: newOrganizer.name,
                            email: newOrganizer.email,
                            phone: newOrganizer.phone,
                            status: newOrganizer.status
                        }]);

                    if (insertError) {
                        console.error("Manual insert failed. Ensure RLS allows Admins to upsert.", insertError);
                    }
                }
            }

            toast.success("Organizer profile and login created successfully!");
            setIsAddModalOpen(false);
            setNewOrganizer({ name: '', email: '', phone: '', status: 'ACTIVE', password: '' });
            fetchOrganizers();
        } catch (error: any) {
            console.error("Error adding organizer:", error);
            toast.error("Failed to add organizer. Ensure your email is valid.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout user={user}>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Manage Organizers</h1>
                        <p className="text-gray-500 text-sm font-medium">View and control organizer accounts across the platform.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-[#7c3aed] text-white px-5 py-2.5 rounded-lg hover:bg-[#6d28d9] transition-colors font-bold shadow-sm"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Organizer</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BANNED">Banned</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Organizer</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Contact</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Joined</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">Loading organizers...</td>
                                    </tr>
                                ) : filteredOrganizers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">No organizers found.</td>
                                    </tr>
                                ) : (
                                    filteredOrganizers.map((org) => (
                                        <tr key={org.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed] font-bold">
                                                        {org.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{org.name}</p>
                                                        <p className="text-xs text-gray-500 font-medium">{org.id.split('-')[0]}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-700">{org.email || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{org.phone || 'No phone'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${org.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    org.status === 'BANNED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {org.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                {new Date(org.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusToggle(org.id, org.status)}
                                                        className={`p-2 rounded-lg transition-all ${org.status === 'BANNED' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'
                                                            }`}
                                                        title={org.status === 'BANNED' ? 'Activate' : 'Ban'}
                                                    >
                                                        {org.status === 'BANNED' ? <CheckCircle size={18} /> : <Ban size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(org.email)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Send Password Reset"
                                                        disabled={!org.email}
                                                    >
                                                        <Key size={18} className={!org.email ? 'opacity-50' : ''} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(org.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Organizer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsAddModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                Add New Organizer
                            </h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                disabled={isSubmitting}
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddOrganizer} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Organization Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Acme Events"
                                    value={newOrganizer.name}
                                    onChange={(e) => setNewOrganizer({ ...newOrganizer, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Direct Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    required
                                    placeholder="contact@acme.com"
                                    value={newOrganizer.email}
                                    onChange={(e) => setNewOrganizer({ ...newOrganizer, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+1 234 567 8900"
                                    value={newOrganizer.phone}
                                    onChange={(e) => setNewOrganizer({ ...newOrganizer, phone: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Initial Status</label>
                                <select
                                    value={newOrganizer.status}
                                    onChange={(e) => setNewOrganizer({ ...newOrganizer, status: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] outline-none transition-all font-medium"
                                >
                                    <option value="ACTIVE">Active (Can log in & create events)</option>
                                    <option value="PENDING">Pending (Requires review)</option>
                                    <option value="BANNED">Banned (Cannot access system)</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Auth Password <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Minimum 6 characters"
                                    minLength={6}
                                    value={newOrganizer.password}
                                    onChange={(e) => setNewOrganizer({ ...newOrganizer, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] outline-none transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">This password will allow the organizer to instantly log in.</p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-[#7c3aed] text-white font-bold rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                    ) : (
                                        'Create Organizer'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ManageOrganizers;
