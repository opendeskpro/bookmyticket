import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Badge from '../../components/Shared/UI/Badge';
import Button from '../../components/Shared/UI/Button';
import { User } from '../../types';
import { getOrganiserIdForUser, getWithdrawalsForOrganiser } from '../../lib/supabase';
import { Banknote, Loader2, Plus, ArrowRight } from 'lucide-react';

interface OrganizerPayoutsProps {
  user: User | null;
}

interface WithdrawalRow {
  id: string;
  amount: number;
  status: string;
  method?: string;
  created_at?: string;
  payable?: number;
  charge?: number;
}

const OrganizerPayouts: React.FC<OrganizerPayoutsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setWithdrawals([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const organiserId = await getOrganiserIdForUser(user.id);
        if (cancelled) return;
        if (organiserId) {
          const data = await getWithdrawalsForOrganiser(organiserId);
          if (!cancelled) setWithdrawals(data as WithdrawalRow[]);
        } else {
          if (!cancelled) setWithdrawals([]);
        }
      } catch {
        if (!cancelled) setWithdrawals([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const pendingCount = withdrawals.filter((w) => w.status === 'PENDING').length;
  const totalPaid = withdrawals
    .filter((w) => w.status === 'APPROVED' || w.status === 'PAID')
    .reduce((sum, w) => sum + (w.amount || 0), 0);

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payouts</h1>
          <p className="text-slate-600 mt-1">Withdrawal requests and payout history.</p>
        </div>
        <Button onClick={() => navigate('/organizer/wallet')}>
          <Plus size={16} className="mr-2" /> Request Payout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm font-medium">Total Requests</p>
            <Banknote className="text-[#FF006E]" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{withdrawals.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-2">{pendingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Paid Out</p>
          <p className="text-2xl font-bold text-green-600 mt-2">₹ {totalPaid.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF006E]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Reference</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Method</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No payout requests yet. Request a withdrawal from your Wallet to see them here.
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-slate-800">#{String(w.id).slice(0, 8)}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">₹ {(w.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-600">{w.method || 'Bank Transfer'}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {w.created_at ? new Date(w.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            w.status === 'APPROVED' || w.status === 'PAID'
                              ? 'success'
                              : w.status === 'REJECTED'
                              ? 'danger'
                              : 'neutral'
                          }
                        >
                          {w.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Need to request a payout? Go to Wallet to withdraw funds to your bank account.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/organizer/wallet')}>
          Go to Wallet <ArrowRight size={14} className="ml-1 inline" />
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerPayouts;
