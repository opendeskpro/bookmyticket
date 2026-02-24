import React, { useState } from 'react';
import {
    X,
    User,
    Mail,
    Phone,
    Briefcase,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OrganizerRequestFormProps {
    onClose: () => void;
}

const OrganizerRequestForm: React.FC<OrganizerRequestFormProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        category: 'Individual'
    });

    const categories = ['Individual', 'Pvt Ltd', 'Event Organiser', 'Others'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: submitError } = await supabase
                .from('organizer_requests')
                .insert([{
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    contact_number: formData.contactNumber,
                    category: formData.category,
                    status: 'PENDING'
                }]);

            if (submitError) throw submitError;

            setSuccess(true);
            // In a real scenario, we would trigger email notifications here via Edge Functions or Backend
            console.log("Confirmation emails triggered (Simulated)");

        } catch (err: any) {
            setError(err.message || "Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Request Submitted!</h3>
                <p className="text-gray-500 text-sm">
                    Thank you for your interest. We've received your request and our team will review it shortly.
                    A confirmation email has been sent to your inbox.
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-all"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Become an Organiser</h2>
                    <p className="text-gray-500 text-sm">Fill in the details to join our platform.</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-2">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none transition-all text-sm"
                                placeholder="John"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none transition-all text-sm"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email ID</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none transition-all text-sm"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="tel"
                            required
                            value={formData.contactNumber}
                            onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none transition-all text-sm"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F84464]/20 focus:border-[#F84464] outline-none transition-all text-sm appearance-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#F84464] text-white rounded-xl font-bold text-sm hover:bg-[#D93654] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F84464]/20 disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default OrganizerRequestForm;
