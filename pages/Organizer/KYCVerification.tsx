import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Button from '../../components/Shared/UI/Button';
import { Building2, FileText, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

interface KYCVerificationProps {
    user: User | null;
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ user }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('KYC Documents Submitted Successfully! We will review them shortly.');
            navigate('/organizer/dashboard');
        }, 1500);
    };

    return (
        <DashboardLayout user={user}>
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Organizer Verification</h1>
                    <p className="text-gray-500">Complete these steps to activate your account and start receiving payouts.</p>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#FF006E] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#FF006E] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-[#FF006E] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Step 1: Organization Details */}
                    {step === 1 && (
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Building2 className="text-[#FF006E]" /> Organization Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Registered Organization Name</label>
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" defaultValue={user.organizationName} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Number (GST/CIN)</label>
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" placeholder="e.g. 29ABCDE1234F1Z5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Registered Address</label>
                                    <textarea rows={3} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" placeholder="Enter full business address"></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setStep(2)}>Next Step</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Documents */}
                    {step === 2 && (
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="text-[#FF006E]" /> Identify Proofs
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                    <p className="font-bold text-sm text-gray-700">Upload Pan Card</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF or JPG up to 5MB</p>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <ShieldCheck className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                    <p className="font-bold text-sm text-gray-700">Incorporation Certificate</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF or JPG up to 5MB</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                                <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                                <p>Your documents are stored securely and encrypted. We only use them for verification purposes.</p>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={() => setStep(3)}>Next Step</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Banking */}
                    {step === 3 && (
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <CreditCard className="text-[#FF006E]" /> Bank Account Details
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">Payouts will be settled to this account automatically after every event.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                    <input type="password" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[#FF006E]" placeholder="e.g. HDFC0001234" />
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                                <Button onClick={handleSubmit} isLoading={loading}>Submit for Verification</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default KYCVerification;
