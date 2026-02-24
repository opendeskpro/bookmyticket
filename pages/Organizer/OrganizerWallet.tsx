import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Badge from '../../components/Shared/UI/Badge';
import Button from '../../components/Shared/UI/Button';
import { TrendingUp, DollarSign, Clock, Download } from 'lucide-react';
import { User } from '../../types';
import { api } from '../../lib/api';
import { getOrganiserIdForUser, getTransactionsForOrganiser, getWithdrawalsForOrganiser, supabase } from '../../lib/supabase';

interface OrganizerWalletProps {
    user?: User | null;
}

const OrganizerWallet: React.FC<OrganizerWalletProps> = ({ user }) => {
    const displayUser = user || null;

    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('BANK_TRANSFER');
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [processingTotal, setProcessingTotal] = useState<number>(0);
    const [revenueTotal, setRevenueTotal] = useState<number>(0);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                if (!user?.id) return;

                // 1) Wallet balance from profiles
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('wallet_balance')
                    .eq('id', user.id)
                    .single();
                if (!cancelled && profile?.wallet_balance !== undefined) {
                    setBalance(Number(profile.wallet_balance) || 0);
                }

                // 2) Organiser-specific ledger
                const organiserId = await getOrganiserIdForUser(user.id);
                if (!organiserId || cancelled) return;

                const [txs, withdrawals] = await Promise.all([
                    getTransactionsForOrganiser(organiserId),
                    getWithdrawalsForOrganiser(organiserId)
                ]);

                if (cancelled) return;

                setTransactions(txs as any[]);

                const totalRevenue = (txs as any[])
                    .filter((t: any) => t.type === 'CREDIT')
                    .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
                setRevenueTotal(totalRevenue);

                const processing = (withdrawals as any[])
                    .filter((w: any) => w.status === 'PENDING')
                    .reduce((sum: number, w: any) => sum + Number(w.payable || w.amount || 0), 0);
                setProcessingTotal(processing);
            } catch (e) {
                // Leave default zeros on error
            }
        })();

        return () => { cancelled = true; };
    }, [user?.id]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.withdrawals.request(parseFloat(withdrawAmount), withdrawMethod);
            alert('Withdrawal request submitted successfully!');
            setShowWithdrawModal(false);
            setWithdrawAmount('');
            // Optimistically update balance or refetch
            setBalance(prev => prev - parseFloat(withdrawAmount));
        } catch (error: any) {
            alert('Failed to request withdrawal: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout user={displayUser || null}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">My Wallet</h1>
                    <p className="text-gray-500">Manage your earnings and withdrawals.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowWithdrawModal(true)}>
                        <DollarSign size={16} className="mr-2" /> Withdraw Funds
                    </Button>
                    <Button variant="outline">
                        <Download size={16} className="mr-2" /> Export Statement
                    </Button>
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#7209B7] to-[#4361EE] rounded-xl p-6 text-white shadow-lg shadow-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-medium opacity-90">Wallet Balance</p>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">₹ {balance.toLocaleString()}</p>
                    <p className="text-xs opacity-70 mt-1">Available for withdrawal</p>
                </div>
                {/* ... existing stats ... */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 font-medium">Total Revenue</p>
                        <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹ {revenueTotal.toLocaleString()}</p>
                    <p className="text-xs text-green-500 mt-1 font-bold">Total credited to wallet</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 font-medium">Processing</p>
                        <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹ {processingTotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">Pending withdrawals</p>
                </div>
            </div>

            {/* ... existing table ... */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="font-bold text-gray-800">Recent Transactions</div>
                    <Button size="sm" variant="ghost">View All</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Reference ID</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                        {tx.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {tx.type === 'CREDIT' ? 'Ticket Revenue' : 'Payout'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-green-600">
                                        {tx.type === 'CREDIT' ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={tx.status === 'SUCCESS' ? 'success' : 'warning'}>
                                            {tx.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Withdrawal Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Withdraw Funds</h2>
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        required
                                        max={balance}
                                        min={100}
                                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={withdrawAmount}
                                        onChange={e => setWithdrawAmount(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Available: ₹{balance.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={withdrawMethod}
                                    onChange={e => setWithdrawMethod(e.target.value)}
                                >
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="UPI">UPI</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowWithdrawModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) > balance}
                                >
                                    {loading ? 'Processing...' : 'Withdraw'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default OrganizerWallet;
