import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Badge from '../../components/Shared/UI/Badge';
import Button from '../../components/Shared/UI/Button';
import { User } from '../../types';
import { Check, X, FileText, ExternalLink } from 'lucide-react';
import { getOrganizersForAdmin } from '../../lib/supabase';

interface AdminApprovalsProps {
    user: User | null;
}

const AdminApprovals: React.FC<AdminApprovalsProps> = ({ user }) => {
    const admin = user;
    const [pendingOrganizers, setPendingOrganizers] = useState<any[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const organisers = await getOrganizersForAdmin();
                if (!cancelled) {
                    setPendingOrganizers((organisers as any[]).filter(o => o.status === 'PENDING'));
                }
            } catch {
                if (!cancelled) setPendingOrganizers([]);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <DashboardLayout user={admin}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">KYC Approvals</h1>
                    <p className="text-gray-500">Review and approve organizer verification requests.</p>
                </div>
            </div>

            {pendingOrganizers.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                    <p className="text-gray-500">There are no pending KYC requests at the moment.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingOrganizers.map(org => (
                        <div key={org.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <img src={org.avatar} alt={org.name} className="w-16 h-16 rounded-lg object-cover" />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{org.organizationName}</h3>
                                        <p className="text-sm text-gray-500">Rep: {org.name} • {org.email}</p>
                                    </div>
                                    <Badge variant="warning">Pending Review</Badge>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-gray-400" size={20} />
                                            <div>
                                                <p className="font-medium text-sm">Business Registration</p>
                                                <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                                            </div>
                                        </div>
                                        <ExternalLink size={16} className="text-blue-600 cursor-pointer" />
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-gray-400" size={20} />
                                            <div>
                                                <p className="font-medium text-sm">PAN Card</p>
                                                <p className="text-xs text-gray-500">JPG • 1.1 MB</p>
                                            </div>
                                        </div>
                                        <ExternalLink size={16} className="text-blue-600 cursor-pointer" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 justify-center min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    <Check size={18} className="mr-2" /> Approve
                                </Button>
                                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                                    <X size={18} className="mr-2" /> Reject
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminApprovals;
