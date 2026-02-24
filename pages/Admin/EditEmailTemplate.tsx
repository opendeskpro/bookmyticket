import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { User, UserRole } from '../../types';
import { Save, ArrowLeft, Loader2, Info } from 'lucide-react';
import { getSiteConfig, updateSiteConfig } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface EditEmailTemplateProps {
    user: User | null;
}

const TEMPLATE_VARIABLES: Record<string, { label: string, code: string }[]> = {
    'booking_confirmation': [
        { label: 'Customer Name', code: '{{customer_name}}' },
        { label: 'Event Name', code: '{{event_name}}' },
        { label: 'Event Date', code: '{{event_date}}' },
        { label: 'Event Time', code: '{{event_time}}' },
        { label: 'Venue', code: '{{venue}}' },
        { label: 'Ticket Quantity', code: '{{qty}}' },
        { label: 'Total Amount', code: '{{total_amount}}' },
        { label: 'Booking ID', code: '{{booking_id}}' },
    ],
    'event_reminder': [
        { label: 'Customer Name', code: '{{customer_name}}' },
        { label: 'Event Name', code: '{{event_name}}' },
        { label: 'Time Until Event', code: '{{time_left}}' },
        { label: 'Venue Layout link', code: '{{venue_link}}' },
    ],
    // Fallback variables for unspecified templates
    'default': [
        { label: 'User Name', code: '{{name}}' },
        { label: 'User Email', code: '{{email}}' },
        { label: 'Platform Name', code: '{{platform_name}}' },
    ]
};

const DEFAULT_BODIES: Record<string, string> = {
    'booking_confirmation': `<h1>Booking Confirmed!</h1>\n<p>Hi {{customer_name}},</p>\n<p>Your booking for <strong>{{event_name}}</strong> is confirmed.</p>\n<ul>\n<li>Date: {{event_date}}</li>\n<li>Time: {{event_time}}</li>\n<li>Venue: {{venue}}</li>\n<li>Tickets: {{qty}}</li>\n</ul>\n<p>Showing your Booking ID at the entrance: <strong>{{booking_id}}</strong></p>`,
    'default': `<h1>Hello {{name}},</h1>\n<p>This is a notification from {{platform_name}}.</p>`
};

const EditEmailTemplate: React.FC<EditEmailTemplateProps> = ({ user }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [template, setTemplate] = useState({
        id: id || '',
        subject: '',
        bodyHtml: ''
    });

    // Store all templates fetched from config to update the array
    const [allTemplates, setAllTemplates] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchTemplate = async () => {
            try {
                const savedTemplatesData = await getSiteConfig('email_templates');
                const templatesArray = savedTemplatesData && Array.isArray(savedTemplatesData) ? savedTemplatesData : [];
                setAllTemplates(templatesArray);

                const existingTpl = templatesArray.find((t: any) => t.id === id);

                if (existingTpl) {
                    setTemplate(existingTpl);
                } else {
                    // Initialize with defaults if it doesn't exist in DB yet
                    setTemplate({
                        id: id,
                        subject: `Notification regarding ${id.replace(/_/g, ' ')}`,
                        bodyHtml: DEFAULT_BODIES[id] || DEFAULT_BODIES['default']
                    });
                }
            } catch (error) {
                console.error("Error loading template:", error);
                toast.error("Failed to load template details");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update or insert into array
            const templateIndex = allTemplates.findIndex(t => t.id === id);
            let newTemplatesArray = [...allTemplates];

            if (templateIndex >= 0) {
                newTemplatesArray[templateIndex] = template;
            } else {
                newTemplatesArray.push(template);
            }

            await updateSiteConfig('email_templates', newTemplatesArray);
            toast.success("Template saved successfully!");
            navigate('/admin/email-templates');
        } catch (error) {
            console.error("Error saving template:", error);
            toast.error("Failed to save template");
        } finally {
            setSaving(false);
        }
    };

    if (!user || user.role !== UserRole.ADMIN) return null;

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            </DashboardLayout>
        );
    }

    const availableVariables = TEMPLATE_VARIABLES[id || ''] || TEMPLATE_VARIABLES['default'];

    return (
        <DashboardLayout user={user}>
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/email-templates')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 capitalize">
                                Edit {id?.replace(/_/g, ' ')}
                            </h1>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#F84464] text-white px-6 py-2.5 rounded-lg hover:bg-[#E03C5A] transition-colors font-medium shadow-sm disabled:opacity-70"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{saving ? 'Saving...' : 'Save Template'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Editor Form */}
                    <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Subject Line</label>
                            <input
                                type="text"
                                value={template.subject}
                                onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Email HTML Body</label>
                            <textarea
                                value={template.bodyHtml}
                                onChange={(e) => setTemplate({ ...template, bodyHtml: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none h-96 font-mono text-sm leading-relaxed"
                            />
                            <p className="text-xs text-gray-500">You can use standard HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, etc to style your email.</p>
                        </div>
                    </div>

                    {/* Variables Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                                <Info size={18} /> Available Variables
                            </div>
                            <p className="text-xs text-blue-600 mb-4">Click to copy a variable and paste it into the subject or body. It will be replaced real-time before sending.</p>

                            <div className="space-y-2">
                                {availableVariables.map((v, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            navigator.clipboard.writeText(v.code);
                                            toast.success(`Copied ${v.code}`);
                                        }}
                                        className="bg-white p-2 text-xs rounded border border-blue-100 flex justify-between items-center cursor-pointer hover:border-blue-300 transition-colors"
                                    >
                                        <span className="font-medium text-gray-600">{v.label}</span>
                                        <code className="bg-gray-50 px-1.5 py-0.5 rounded text-blue-600">{v.code}</code>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-800 text-sm mb-2">Preview Note</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                The design wrapper (header logo, footer copyrights) is automatically applied to all outgoing emails. You only need to edit the core message content here.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default EditEmailTemplate;
