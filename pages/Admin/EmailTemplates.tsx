import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { User, UserRole } from '../../types';
import { Edit, Search, Plus, Loader2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSiteConfig } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface EmailTemplatesProps {
    user: User | null;
}

export interface EmailTemplate {
    id: string; // Keep string based for predefined keys
    name: string;
    subject: string;
    description: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
    { id: 'booking_confirmation', name: 'Booking Confirmation', subject: 'Your tickets for {{event_name}} are confirmed!', description: 'Sent to users immediately after a successful ticket booking.' },
    { id: 'event_reminder', name: 'Event Reminder', subject: 'Reminder: {{event_name}} is happening soon!', description: 'Sent 24 hours before the event starts.' },
    { id: 'ticket_cancellation', name: 'Ticket Cancellation', subject: 'Your booking for {{event_name}} has been cancelled', description: 'Sent when an admin or organizer cancels a ticket.' },
    { id: 'organizer_welcome', name: 'Organizer Welcome', subject: 'Welcome to BookMyTicket! Start hosting events', description: 'Sent when an organizer application is approved.' },
    { id: 'withdrawal_approved', name: 'Withdrawal Approved', subject: 'Your withdrawal request has been processed', description: 'Sent to organizers when their payout is completed.' }
];

const EmailTemplates: React.FC<EmailTemplatesProps> = ({ user }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                // We'll merge backend templates with default ones to ensure all system emails exist
                const savedTemplatesData = await getSiteConfig('email_templates');

                const savedTemplates = savedTemplatesData && Array.isArray(savedTemplatesData) ? savedTemplatesData : [];

                // Merge logic: If a saved template exists, use its subject, otherwise use default
                const mergedTemplates = DEFAULT_TEMPLATES.map(defaultTpl => {
                    const saved = savedTemplates.find((t: any) => t.id === defaultTpl.id);
                    return saved ? { ...defaultTpl, subject: saved.subject } : defaultTpl;
                });

                setTemplates(mergedTemplates);
            } catch (error) {
                console.error("Error fetching templates:", error);
                toast.error("Failed to load templates.");
                setTemplates(DEFAULT_TEMPLATES); // Fallback
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user || user.role !== UserRole.ADMIN) {
        return (
            <DashboardLayout user={user}>
                <div className="flex h-64 items-center justify-center text-gray-500">Access denied.</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Email Templates
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage automated email notifications sent for event bookings and system alerts.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Actions & Filters */}
                <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-gray-400" size={32} />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Template Name</th>
                                    <th className="px-6 py-4">Subject Line</th>
                                    <th className="px-6 py-4">Trigger Event</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTemplates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="font-bold text-gray-900">{template.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">{template.subject}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs leading-relaxed max-w-xs">{template.description}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/edit-email-template/${template.id}`)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-[#F84464] hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Edit size={14} /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTemplates.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No templates found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmailTemplates;
