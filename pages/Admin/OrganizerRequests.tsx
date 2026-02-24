import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    ExternalLink,
    Mail,
    Phone,
    Calendar,
    Search,
    Filter,
    MoreVertical,
    Loader2,
    ShieldCheck,
    UserPlus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OrganizerRequest {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    category: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at: string;
}

const OrganizerRequests: React.FC = () => {
    const [requests, setRequests] = useState<OrganizerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
    const [credentials, setCredentials] = useState({ password: '', username: '' });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('organizer_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (err) {
            console.error("Error fetching requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        setProcessingId(id);
        try {
            const { error } = await supabase
                .from('organizer_requests')
                .update({ status })
                .eq('id', id);

            if (error) throw error;

            setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
        } catch (err) {
            console.error(`Error updating status to ${status}:`, err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleApprove = async (id: string) => {
        const request = requests.find(r => r.id === id);
        if (!request) return;

        setProcessingId(id);
        try {
            // 1. Create Supabase Auth User
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: request.email,
                password: credentials.password,
                email_confirm: true,
                user_metadata: {
                    full_name: `${request.first_name} ${request.last_name}`,
                    role: 'ORGANISER'
                }
            });

            if (authError) throw authError;

            // 2. Update profile role and name
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    role: 'ORGANISER',
                    full_name: `${request.first_name} ${request.last_name}`
                })
                .eq('id', authData.user.id);

            if (profileError) throw profileError;

            // 3. Update request status
            await handleStatusChange(id, 'APPROVED');

            alert(`Organiser approved! Credentials sent to ${request.email}`);
            setShowApproveModal(null);
            setCredentials({ username: '', password: '' });
        } catch (err: any) {
            alert(err.message || "Failed to approve organiser");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        Organiser Requests <ShieldCheck className="text-indigo-600" />
                    </h1>
                    <p className="text-gray-500 font-medium">Review and manage onboarding applications.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-0 w-64"
                        />
                    </div>
                    <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Applicant</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Requested On</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-indigo-600" size={32} />
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                                        No requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                                    {request.first_name[0]}{request.last_name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{request.first_name} {request.last_name}</div>
                                                    <div className="text-xs text-gray-500">{request.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                                                    <Mail size={12} className="text-gray-400" /> {request.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                                                    <Phone size={12} className="text-gray-400" /> {request.contact_number}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {request.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${request.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                    request.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                                        'bg-red-50 text-red-600'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${request.status === 'PENDING' ? 'bg-amber-400' :
                                                        request.status === 'APPROVED' ? 'bg-emerald-400' :
                                                            'bg-red-400'
                                                    }`} />
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-medium text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} />
                                                {new Date(request.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {request.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => setShowApproveModal(request.id)}
                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(request.id, 'REJECTED')}
                                                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                                                    <MoreVertical size={18} />
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

            {/* Approval Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowApproveModal(null)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserPlus size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Approve Organiser</h3>
                            <p className="text-gray-500 text-sm">Create credentials for the new organiser.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Temporary Password</label>
                                <input
                                    type="text"
                                    value={credentials.password}
                                    onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                    placeholder="e.g. TempPass123!"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowApproveModal(null)}
                                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleApprove(showApproveModal)}
                                disabled={!credentials.password || processingId === showApproveModal}
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {processingId === showApproveModal ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Approval'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerRequests;
