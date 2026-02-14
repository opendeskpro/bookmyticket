
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  ExternalLink,
  ChevronDown,
  Ticket,
  Heart,
  CreditCard,
  Edit3,
  Calendar,
  ArrowUpRight,
  Info,
  X,
  FileText,
  Trash2,
  ShieldCheck,
  ChevronLeft as PrevIcon,
  Check,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { User } from '../../types';
import { registerOrganizer, supabase } from '../../lib/supabase';

type KYCStep = 'INTRO' | 'DETAILS' | 'DOCUMENTS' | 'AGREEMENT' | 'SUCCESS';

const KYCPage: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<KYCStep>('INTRO');
  const [showGSTModal, setShowGSTModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [isUndertakingAccepted, setIsUndertakingAccepted] = useState(false);
  const [isFinalAgreementAccepted, setIsFinalAgreementAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingStatus, setExistingStatus] = useState<'PENDING' | 'ACTIVE' | 'SUSPENDED' | null>(null);

  // File Upload State
  const [panFile, setPanFile] = useState<File | null>(null);
  const [chequeFile, setChequeFile] = useState<File | null>(null);
  const [aadharFile, setAadharFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    category: '',
    orgName: '',
    panNumber: 'DPIPR3985B',
    website: '',
    city: 'Coimbatore',
  });

  // Verify status on mount to prevent double submission
  useEffect(() => {
    const checkStatus = async () => {
      // Demo bypass
      if (user.id.startsWith('demo-')) {
        setLoading(false);
        return;
      }

      try {
        const { data: org, error } = await supabase
          .from('organizers')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (org) {
          if (org.status === 'ACTIVE') {
            navigate('/organiser/dashboard'); // Already active, go to dashboard
          } else {
            setExistingStatus(org.status as any); // Show status specific screen
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [user.id, navigate]);

  const handleNext = async () => {
    if (currentStep === 'INTRO') {
      setCurrentStep('DETAILS');
    } else if (currentStep === 'DETAILS') {
      if (!isUndertakingAccepted) {
        alert("Please accept the undertaking");
        return;
      }
      setCurrentStep('DOCUMENTS');
    } else if (currentStep === 'DOCUMENTS') {
      setShowAgreementModal(true);
    } else if (currentStep === 'AGREEMENT') {
      if (!isFinalAgreementAccepted) {
        alert("Please accept the vendor agreement to continue.");
        return;
      }

      setIsSubmitting(true);
      try {
        await registerOrganizer(user.id, formData.orgName, formData.panNumber);
        setCurrentStep('SUCCESS');
      } catch (err) {
        console.error(err);
        alert("Failed to register organizer profile. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep === 'DETAILS') setCurrentStep('INTRO');
    else if (currentStep === 'DOCUMENTS') setCurrentStep('DETAILS');
    else if (currentStep === 'AGREEMENT') setCurrentStep('DOCUMENTS');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'PAN' | 'CHEQUE' | 'AADHAR') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'PAN') setPanFile(file);
      else if (type === 'CHEQUE') setChequeFile(file);
      else if (type === 'AADHAR') setAadharFile(file);
    }
  };

  const handleAgreeModal = () => {
    setShowAgreementModal(false);
    setCurrentStep('AGREEMENT');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-[#ff5a5f]" size={32} />
      </div>
    );
  }

  // If already pending, show this instead of form
  if (existingStatus === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-sm border border-amber-100">
            <Clock size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Application Received</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
            Your application is already submitted and is currently under review by our admin team.
          </p>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest mb-4">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (existingStatus === 'SUSPENDED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-red-500 mb-2">Account Suspended</h2>
          <p className="text-slate-500 font-medium text-sm">Please contact support.</p>
        </div>
      </div>
    );
  }

  const renderIntro = () => (
    <div className="animate-in fade-in duration-500 max-w-[1100px] mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-[#1a1c2e] relative overflow-hidden h-64 flex items-center px-16">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 text-white grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              ))}
            </div>
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-white tracking-widest uppercase">START ONBOARDING</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-12 items-center bg-white">
          <div className="lg:col-span-5">
            <img src="https://img.freepik.com/free-vector/identity-verification-concept-illustration_114360-3136.jpg" className="w-full h-auto" alt="KYC" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22c55e] text-white rounded-md text-[11px] font-bold">Takes 3 mins</div>
            <h2 className="text-[22px] font-black text-slate-900">Host events with confidence</h2>
            <div className="space-y-5">
              {[
                { title: 'Seamless Event Hosting', desc: 'Verified hosts enjoy faster and hassle-free event access.' },
                { title: 'Regulatory Compliance', desc: 'Ensures adherence to industry standards and policies.' },
                { title: 'Seamless Payouts', desc: 'Ensure smooth and timely settlements.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 bg-[#22c55e] rounded-full flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[14px]">{item.title}</h4>
                    <p className="text-slate-500 text-[13px] font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleNext} className="bg-[#1a1c2e] text-white px-8 py-3 rounded-full font-black text-[13px] flex items-center gap-2 hover:bg-slate-950 transition-all shadow-lg">
              Get Started <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm min-h-[600px] flex">
        <div className="w-1/4 bg-white border-r border-slate-100 p-10 flex flex-col">
          <div className="space-y-20 relative">
            <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-slate-100"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-[#ff8a5c] to-[#ff4d6e] text-white shadow-lg border-2 border-white">1</div>
              <span className="text-sm font-bold text-slate-700">Organization Details</span>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-white border border-slate-200 text-slate-400">2</div>
              <span className="text-sm font-bold text-slate-400">Upload Documents</span>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-white border border-slate-200 text-slate-400">3</div>
              <span className="text-sm font-bold text-slate-400">Agreement</span>
            </div>
          </div>
        </div>
        <div className="flex-1 p-10 bg-white relative">
          <h2 className="text-xl font-bold text-slate-800 mb-8">Organizer KYC</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700"><span className="text-red-500 mr-1">*</span>Category</label>
              <select
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm appearance-none outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Choose Category</option>
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700"><span className="text-red-500 mr-1">*</span>Organization Name</label>
              <input
                type="text"
                placeholder="Type your Name"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none text-sm"
                value={formData.orgName}
                onChange={e => setFormData({ ...formData, orgName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700"><span className="text-red-500 mr-1">*</span>PAN card number</label>
              <input
                type="text"
                placeholder="PAN"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none text-sm uppercase"
                value={formData.panNumber}
                onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Website Link</label>
              <input
                type="text"
                placeholder="(ex: https://www.abc.com)"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none text-sm"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <input type="checkbox" id="undertaking" className="w-4 h-4 accent-[#ff5a5f]" checked={isUndertakingAccepted} onChange={(e) => setIsUndertakingAccepted(e.target.checked)} />
            <label htmlFor="undertaking" className="text-sm font-medium text-slate-700">I have read and accept the <button onClick={() => setShowGSTModal(true)} className="text-blue-500 hover:underline">undertaking</button></label>
          </div>
          <div className="mt-16 flex justify-end">
            <button onClick={handleNext} className="bg-[#ff5a5f] text-white px-10 py-3 rounded-xl font-bold text-sm flex items-center gap-3">Next <ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm min-h-[600px] flex">
        <div className="w-1/4 bg-white border-r border-slate-100 p-10 flex flex-col">
          <div className="space-y-20 relative">
            <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-slate-100"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-500 text-white shadow-lg border-2 border-white"><Check size={20} strokeWidth={3} /></div>
              <span className="text-sm font-bold text-slate-700">Organization Details</span>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-[#ff8a5c] to-[#ff4d6e] text-white shadow-lg border-2 border-white">2</div>
              <span className="text-sm font-bold text-slate-700">Upload Documents</span>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-white border border-slate-200 text-slate-400">3</div>
              <span className="text-sm font-bold text-slate-400">Agreement</span>
            </div>
          </div>
        </div>
        <div className="flex-1 p-10 bg-white relative flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-10">Organizer KYC</h2>
          <div className="space-y-12 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              <div className="space-y-3">
                <p className="text-[13px] font-medium text-slate-700">Upload PAN (Max 1 MB) <button className="text-blue-500 hover:underline">View Sample</button></p>
                <label className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden cursor-pointer max-w-sm">
                  <span className="px-4 py-2 bg-slate-100 border-r text-[13px] font-medium text-slate-700">Choose file</span>
                  <span className="px-4 py-2 text-[13px] text-slate-500 truncate">{panFile ? panFile.name : 'No file chosen'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'PAN')} />
                </label>
              </div>
            </div>
          </div>
          <div className="mt-16 flex items-center justify-between">
            <button onClick={handlePrev} className="bg-gradient-to-r from-[#ff8a5c] to-[#ff4d6e] text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-3">prev</button>
            <button onClick={handleNext} className="bg-gradient-to-r from-[#ff8a5c] to-[#ff4d6e] text-white px-10 py-2.5 rounded-xl font-bold text-sm flex items-center gap-3">Next <ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgreement = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm min-h-[600px] flex">
        <div className="w-1/4 bg-white border-r border-slate-100 p-10 flex flex-col">
          <div className="space-y-20 relative">
            <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-slate-100"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-500 text-white shadow-lg border-2 border-white"><Check size={20} strokeWidth={3} /></div>
              <span className="text-sm font-bold text-slate-700">Organization Details</span>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-500 text-white shadow-lg border-2 border-white"><Check size={20} strokeWidth={3} /></div>
              <span className="text-sm font-bold text-slate-700">Upload Documents</span>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-[#ff8a5c] to-[#ff4d6e] text-white shadow-lg border-2 border-white">3</div>
              <span className="text-sm font-bold text-slate-700">Agreement</span>
            </div>
          </div>
        </div>
        <div className="flex-1 p-10 bg-white relative flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-12">Organizer KYC</h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center -mt-20">
            <div className="flex items-center gap-3 bg-slate-50 px-8 py-5 rounded-2xl border border-slate-100 mb-16">
              <input type="checkbox" id="final-agreement" className="w-4 h-4 accent-[#ff5a5f]" checked={isFinalAgreementAccepted} onChange={(e) => setIsFinalAgreementAccepted(e.target.checked)} />
              <label htmlFor="final-agreement" className="text-[13px] font-medium text-slate-700">I have read and agreed to the <button onClick={() => setShowAgreementModal(true)} className="text-blue-500 hover:underline">vendor agreement</button></label>
            </div>
            <div className="flex items-center justify-between w-full max-w-4xl px-12">
              <button onClick={handlePrev} className="bg-gradient-to-r from-[#ff8a5c] to-[#ff4d6e] text-white px-10 py-3 rounded-2xl font-bold text-sm">prev</button>
              <button onClick={handleNext} disabled={isSubmitting} className="bg-gradient-to-r from-[#ff8a5c] to-[#ff4d6e] text-white px-12 py-3 rounded-2xl font-bold text-sm flex items-center gap-3 disabled:opacity-50">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[1200px] mx-auto">
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm p-16 space-y-12">
        <div className="relative flex items-center justify-between px-10">
          <div className="absolute left-[15%] right-[15%] h-1 bg-slate-100 top-1/2 -translate-y-1/2 z-0"></div>
          <div className="relative z-10 flex flex-col items-center gap-3 bg-white px-6">
            <div className="w-12 h-12 bg-[#64748b] text-white rounded-full flex items-center justify-center shadow-lg">
              <Check size={24} strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">KYC Submitted</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3 bg-white px-6">
            <div className="w-12 h-12 bg-[#f59e0b] text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Clock size={24} strokeWidth={3} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">Verification Pending</span>
          </div>
        </div>
        <div className="bg-[#f8fafc] rounded-[2rem] p-12 border border-slate-50 space-y-10 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-3xl font-black text-slate-900">Application Received</h3>
            <p className="text-slate-500 font-medium">
              Thanks for submitting your details, <span className="text-slate-900 font-bold">{user.name}</span>.
              Our admin team is currently reviewing your profile.
            </p>
            <p className="text-slate-500 font-medium">
              This process usually takes 24-48 hours. You will be able to create events once your account status changes to <span className="text-emerald-600 font-bold">Active</span>.
            </p>
          </div>

          <button onClick={() => navigate('/')} className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold text-sm">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="py-8 px-12 flex items-center justify-between sticky top-0 bg-[#f8fafc]/90 backdrop-blur-sm z-50">
        <button onClick={() => navigate(-1)} className="w-8 h-8 bg-[#ff5a5f] text-white rounded-[6px] flex items-center justify-center shadow-md hover:scale-110 transition-all active:scale-95">
          <ChevronLeft size={18} strokeWidth={3} />
        </button>
        <div className="flex-1 flex justify-end">
          <h1 className="text-[18px] font-bold text-slate-800 tracking-tight">Organizer KYC</h1>
        </div>
      </header>

      <main className="px-12 pb-24 overflow-y-auto scrollbar-hide">
        {currentStep === 'INTRO' && renderIntro()}
        {currentStep === 'DETAILS' && renderDetails()}
        {currentStep === 'DOCUMENTS' && renderDocuments()}
        {currentStep === 'AGREEMENT' && renderAgreement()}
        {currentStep === 'SUCCESS' && renderSuccess()}
      </main>

      {showAgreementModal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAgreementModal(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-xl font-black">USER AGREEMENT</h2>
              <button onClick={() => setShowAgreementModal(false)}><X size={24} /></button>
            </div>
            <div className="p-10 overflow-y-auto text-sm space-y-6 text-slate-600">
              <h3 className="font-black text-slate-900 uppercase tracking-widest">1. SELLER TERMS & CONDITIONS</h3>
              <p>This agreement outlines the relationship between BookMyTicket and you as an event organizer. By agreeing, you authorize us to process ticketing for your events...</p>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end">
              <button onClick={handleAgreeModal} className="bg-[#ff5a5f] text-white px-10 py-3 rounded-xl font-bold">I Agree</button>
            </div>
          </div>
        </div>
      )}

      {showGSTModal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowGSTModal(false)}></div>
          <div className="relative bg-white p-10 max-w-xl rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold mb-6">GST Declaration</h2>
            <p className="text-sm text-slate-600 mb-8">I confirm that my annual turnover is below the GST threshold limit, or I will provide my GSTIN details for tax compliance.</p>
            <button onClick={() => setShowGSTModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
