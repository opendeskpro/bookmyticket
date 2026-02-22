import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { MOCK_USERS } from '../../constants/mockData';
import Badge from '../../components/Shared/UI/Badge';
import Button from '../../components/Shared/UI/Button';
import { Check, X, Clock } from 'lucide-react';
import { api } from '../../lib/api';

const AdminWithdrawals: React.FC = () => {
    // Admin user (mock for layout)
    const admin = MOCK_USERS[2];

    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWithdrawals = async () => {
        try {
            const data = await api.withdrawals.listPending();
            setWithdrawals(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm('Are you sure you want to approve this withdrawal?')) return;
        try {
            await api.withdrawals.approve(id);
            setWithdrawals(prev => prev.filter(w => w.id !== id));
            alert('Withdrawal Approved');
        } catch (error: any) {
            alert('Error: ' + error.message);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to REJECT this withdrawal? The amount will be refunded to the organizer.')) return;
        try {
            await api.withdrawals.reject(id);
            setWithdrawals(prev => prev.filter(w => w.id !== id));
            alert('Withdrawal Rejected and Refunded');
        } catch (error: any) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <DashboardLayout user={admin}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
                    <p className="text-gray-500">Review and manage organizer payout requests.</p>
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : withdrawals.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                    <p className="text-gray-500">There are no pending withdrawal requests.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Organizer</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Method</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {withdrawals.map((w) => (
                                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{w.profiles?.full_name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{w.profiles?.email}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        ₹{w.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {w.method}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(w.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(w.id)}>
                                            Approve
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => handleReject(w.id)}>
                                            Reject
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminWithdrawals;
