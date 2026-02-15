
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  ChevronDown,
  Ticket,
  Clock,
  X,
  FileText,
  ShieldCheck,
  Check,
  Building,
  Mail,
  Phone,
  MapPin,
  Eye,
  Loader2,
  ExternalLink,
  Smartphone,
  LayoutDashboard
} from 'lucide-react';
import { User } from '../../types.ts';

type KYCStep = 'INTRO' | 'DETAILS' | 'DOCUMENTS' | 'AGREEMENT' | 'SUCCESS';

const KYCPage: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<KYCStep>('INTRO');
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: 'Individual',
    individualName: user.name || 'Raja',
    panNumber: 'DPIPR3985B',
    website: '',
    socialMedia: '',
    hasOSTIN: 'No',
    hasLast2YearsITR: 'No',
    fullName: user.name || 'Raja Vasudevan',
    emailAddress: user.email || 'v.rajadece@gmail.com',
    mobileNumber: '+918344442221',
    alternateNumber: '',
    designation: 'ITOPS',
    city: 'Pollachi',
    undertakingAccepted: true
  });

  // File Upload State
  const [panFile, setPanFile] = useState<string | null>('WhatsApp Image 2026-02-15 at 9.09.24 AM.jpeg');
  const [chequeFile, setChequeFile] = useState<string | null>('Adobe Scan Nov 27, 2020.pdf');
  const [aadharFile, setAadharFile] = useState<string | null>('Aadhar.jpg');

  const handleNext = () => {
    if (currentStep === 'INTRO') setCurrentStep('DETAILS');
    else if (currentStep === 'DETAILS') setCurrentStep('DOCUMENTS');
    else if (currentStep === 'DOCUMENTS') setCurrentStep('AGREEMENT');
    else if (currentStep === 'AGREEMENT') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep('SUCCESS');
      }, 1500);
    }
  };

  const handlePrev = () => {
    if (currentStep === 'DETAILS') setCurrentStep('INTRO');
    else if (currentStep === 'DOCUMENTS') setCurrentStep('DETAILS');
    else if (currentStep === 'AGREEMENT') setCurrentStep('DOCUMENTS');
  };

  const renderSidebar = (activeStep: number) => (
    <div className="w-1/4 pr-12 border-r border-black/5">
      <div className="space-y-16 relative">
        <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-[#f0f2f5]"></div>

        {/* Step 1 */}
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${activeStep >= 1 ? (activeStep > 1 ? 'bg-emerald-500 text-white' : 'bg-gradient-to-br from-[#ff5862] to-[#ff7b84] text-white ring-8 ring-[#ff5862]/10') : 'bg-white border-2 border-[#f0f2f5] text-[#9ca3af]'}`}>
            {activeStep > 1 ? <Check size={20} strokeWidth={3} /> : '1'}
          </div>
          <span className={`text-[14px] font-bold ${activeStep >= 1 ? 'text-[#484848]' : 'text-[#9ca3af]'}`}>Organization Details</span>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${activeStep >= 2 ? (activeStep > 2 ? 'bg-emerald-500 text-white' : 'bg-gradient-to-br from-[#ff5862] to-[#ff7b84] text-white ring-8 ring-[#ff5862]/10') : 'bg-white border-2 border-[#f0f2f5] text-[#9ca3af]'}`}>
            {activeStep > 2 ? <Check size={20} strokeWidth={3} /> : '2'}
          </div>
          <span className={`text-[14px] font-bold ${activeStep >= 2 ? 'text-[#484848]' : 'text-[#9ca3af]'}`}>Upload Documents</span>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${activeStep >= 3 ? (activeStep > 3 ? 'bg-emerald-500 text-white' : 'bg-gradient-to-br from-[#ff5862] to-[#ff7b84] text-white ring-8 ring-[#ff5862]/10') : 'bg-white border-2 border-[#f0f2f5] text-[#9ca3af]'}`}>
            {activeStep > 3 ? <Check size={20} strokeWidth={3} /> : '3'}
          </div>
          <span className={`text-[14px] font-bold ${activeStep >= 3 ? 'text-[#484848]' : 'text-[#9ca3af]'}`}>Agreement</span>
        </div>
      </div>
    </div>
  );

  const renderIntro = () => (
    <div className="max-w-[1100px] mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-2xl shadow-black/5">
        <div className="bg-[#0e1724] relative overflow-hidden h-72 flex items-center px-20">
          <div className="absolute top-10 left-10 opacity-20">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
              ))}
            </div>
          </div>
          <div className="relative z-10">
            <h1 className="text-6xl font-black text-white tracking-widest uppercase italic">START ONBOARDING</h1>
          </div>
          <div className="absolute right-[-5%] top-[-20%] w-96 h-96 bg-gradient-to-br from-[#ff5862] to-[#ff7b84] rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 p-20 items-center">
          <div className="relative">
            <img
              src="https://img.freepik.com/free-vector/identity-verification-concept-illustration_114360-3136.jpg"
              className="w-full h-auto drop-shadow-2xl"
              alt="KYC Onboarding"
            />
          </div>
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-[12px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              Takes 3 mins
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-[#484848] leading-tight">Host events with confidence</h2>
              <p className="text-[#767676] font-medium text-lg leading-relaxed">We prioritize security, trust, and seamless event experiences for all organizers.</p>
            </div>
            <div className="space-y-8">
              <h3 className="text-[#484848] font-black uppercase tracking-widest text-sm italic">Why KYC Verification?</h3>
              {[
                { title: 'Seamless Event Hosting', desc: 'Verified hosts enjoy faster and hassle-free event access.' },
                { title: 'Regulatory Compliance', desc: 'Ensures adherence to industry standards and policies.' },
                { title: 'Seamless Payouts', desc: 'Ensure smooth and timely settlements.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="mt-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                    <Check size={16} strokeWidth={4} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#484848] text-[16px]">{item.title}</h4>
                    <p className="text-[#767676] text-[14px] font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 flex items-center gap-8">
              <button
                onClick={handleNext}
                className="bg-[#0e1724] text-white px-10 py-5 rounded-2xl font-black text-[15px] flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-black/10 group"
              >
                Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-[#767676] font-bold text-[14px] flex items-center gap-2 hover:text-[#ff5862] transition-colors">
                Contact Us <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white rounded-[2rem] border border-black/5 shadow-2xl p-12 flex min-h-[700px]">
        {renderSidebar(1)}

        <div className="flex-1 pl-12 space-y-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#484848]">Organizer KYC</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#ff5862] to-[#ff7b84] rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
            {/* Category */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Category</label>
              <div className="relative">
                <select
                  className="w-full bg-[#f9fafb] border border-black/5 rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] appearance-none outline-none focus:ring-2 focus:ring-[#ff5862]/10 transition-all cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Individual">Individual</option>
                  <option value="Creator">Creator</option>
                  <option value="Company">Company</option>
                  <option value="Non-profit Organization">Non-profit Organization</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767676] pointer-events-none" size={18} />
              </div>
            </div>

            {/* Individual Name */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Individual Name</label>
              <input
                type="text"
                className="w-full bg-[#f0f2f5] border border-transparent rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none"
                value={formData.individualName}
                readOnly
              />
            </div>

            {/* PAN card number */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>PAN card number</label>
              <input
                type="text"
                className="w-full bg-[#f9fafb] border border-black/5 rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none focus:ring-2 focus:ring-[#ff5862]/10 transition-all"
                value={formData.panNumber}
                onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
              />
            </div>

            {/* Website Link */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#9ca3af] uppercase tracking-widest">Website Link</label>
              <input
                type="text"
                placeholder="(ex: https://www.abc.com)"
                className="w-full bg-[#f9fafb] border border-black/5 rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
              />
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#22c55e] italic">
                <CheckCircle2 size={12} /> This will help us to verify your KYC soon
              </p>
            </div>

            {/* Social Media Link */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#9ca3af] uppercase tracking-widest">Social Media Link</label>
              <input
                type="text"
                placeholder="(ex: https://www.facebook.com)"
                className="w-full bg-[#f9fafb] border border-black/5 rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none"
                value={formData.socialMedia}
                onChange={e => setFormData({ ...formData, socialMedia: e.target.value })}
              />
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#22c55e] italic">
                <CheckCircle2 size={12} /> This will help us to verify your KYC soon
              </p>
            </div>

            {/* OSTIN number */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Do you have OSTIN number?</label>
              <div className="flex gap-6 py-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ostin"
                    className="w-4 h-4 accent-[#ff5862]"
                    checked={formData.hasOSTIN === 'Yes'}
                    onChange={() => setFormData({ ...formData, hasOSTIN: 'Yes' })}
                  />
                  <span className="text-[13px] font-bold text-[#484848]">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ostin"
                    className="w-4 h-4 accent-[#ff5862]"
                    checked={formData.hasOSTIN === 'No'}
                    onChange={() => setFormData({ ...formData, hasOSTIN: 'No' })}
                  />
                  <span className="text-[13px] font-bold text-[#484848]">No</span>
                </label>
              </div>
            </div>

            {/* ITR Return */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Have you filled last 2 years ITR return?</label>
              <div className="flex gap-6 py-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="itr"
                    className="w-4 h-4 accent-[#ff5862]"
                    checked={formData.hasLast2YearsITR === 'Yes'}
                    onChange={() => setFormData({ ...formData, hasLast2YearsITR: 'Yes' })}
                  />
                  <span className="text-[13px] font-bold text-[#484848]">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="itr"
                    className="w-4 h-4 accent-[#ff5862]"
                    checked={formData.hasLast2YearsITR === 'No'}
                    onChange={() => setFormData({ ...formData, hasLast2YearsITR: 'No' })}
                  />
                  <span className="text-[13px] font-bold text-[#484848]">No</span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Full Name</label>
              <input
                type="text"
                className="w-full bg-[#f0f2f5] border border-transparent rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none"
                value={formData.fullName}
                readOnly
              />
            </div>

            {/* Email address */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Email address</label>
              <input
                type="text"
                className="w-full bg-[#f0f2f5] border border-transparent rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none"
                value={formData.emailAddress}
                readOnly
              />
            </div>

            {/* Mobile number */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Mobile number</label>
              <input
                type="text"
                className="w-full bg-[#f0f2f5] border border-transparent rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none"
                value={formData.mobileNumber}
                readOnly
              />
            </div>

            {/* Alternate number */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Alternate number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+91 88888 88888"
                  className="w-full bg-[#f9fafb] border border-black/5 rounded-xl px-16 py-4 text-[14px] font-bold text-[#484848] outline-none"
                  value={formData.alternateNumber}
                  onChange={e => setFormData({ ...formData, alternateNumber: e.target.value })}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <img src="https://flagcdn.com/w20/in.png" className="w-5 h-auto rounded-sm" alt="IN" />
                  <span className="text-[12px] font-bold text-[#767676]">+91</span>
                </div>
              </div>
            </div>

            {/* Designation */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>Designation <span className="text-[#ff5862] font-medium lowercase italic text-[10px]">(min 3 letters)</span></label>
              <input
                type="text"
                className="w-full bg-[#f0f2f5] border border-transparent rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none"
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>

            {/* City */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-black text-[#767676] uppercase tracking-widest"><span className="text-[#ff5862] mr-1">*</span>City</label>
              <input
                type="text"
                className="w-full bg-[#f0f2f5] border border-transparent rounded-xl px-5 py-4 text-[14px] font-bold text-[#484848] outline-none"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-10 flex flex-col gap-10">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#ff5862]"
                checked={formData.undertakingAccepted}
                onChange={e => setFormData({ ...formData, undertakingAccepted: e.target.checked })}
              />
              <span className="text-[14px] font-bold text-[#484848]">I have read and accept the <button className="text-[#0e1724] hover:underline">undertaking</button></span>
            </label>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-[#ff5862] to-[#ff7b84] text-white px-12 py-4 rounded-2xl font-black text-[14px] flex items-center gap-3 shadow-xl shadow-[#ff5862]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white rounded-[2rem] border border-black/5 shadow-2xl p-12 flex min-h-[700px]">
        {renderSidebar(2)}

        <div className="flex-1 pl-12 flex flex-col">
          <div className="space-y-2 mb-16">
            <h2 className="text-2xl font-black text-[#484848]">Organizer KYC</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#ff5862] to-[#ff7b84] rounded-full"></div>
          </div>

          <div className="flex-1 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
              {/* PAN */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#484848]">Upload PAN (Max 1 MB)</label>
                  <button className="text-[11px] font-black text-[#ff5862] uppercase tracking-widest hover:underline">Sample</button>
                </div>
                <div className="relative">
                  <input type="file" className="hidden" id="pan-upload" />
                  <label htmlFor="pan-upload" className="flex items-center bg-[#f9fafb] border border-black/5 rounded-xl overflow-hidden cursor-pointer group hover:border-[#ff5862]/30 transition-all">
                    <span className="px-6 py-4 bg-white border-r border-black/5 text-[13px] font-black text-[#484848] group-hover:bg-[#f9fafb]">Choose file</span>
                    <span className="px-6 py-4 text-[13px] font-medium text-[#767676] truncate">{panFile || 'No file chosen'}</span>
                  </label>
                </div>
                {panFile && (
                  <div className="bg-[#f9fafb] border border-black/5 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="text-[#ff5862]" size={24} />
                      </div>
                      <span className="text-[13px] font-bold text-[#484848] truncate max-w-[200px]">{panFile}</span>
                    </div>
                    <button className="p-2 hover:bg-red-50 text-[#767676] hover:text-[#ff5862] transition-colors rounded-lg">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Cancelled Cheque */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#484848]">Upload Cancelled Cheque (Max 1 MB)</label>
                  <button className="text-[11px] font-black text-[#ff5862] uppercase tracking-widest hover:underline">Sample</button>
                </div>
                <div className="relative">
                  <input type="file" className="hidden" id="cheque-upload" />
                  <label htmlFor="cheque-upload" className="flex items-center bg-[#f9fafb] border border-black/5 rounded-xl overflow-hidden cursor-pointer group hover:border-[#ff5862]/30 transition-all">
                    <span className="px-6 py-4 bg-white border-r border-black/5 text-[13px] font-black text-[#484848] group-hover:bg-[#f9fafb]">Choose file</span>
                    <span className="px-6 py-4 text-[13px] font-medium text-[#767676] truncate">{chequeFile || 'No file chosen'}</span>
                  </label>
                </div>
                {chequeFile && (
                  <div className="bg-[#f9fafb] border border-black/5 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="text-blue-500" size={24} />
                      </div>
                      <span className="text-[13px] font-bold text-[#484848] truncate max-w-[200px]">{chequeFile}</span>
                    </div>
                    <button className="p-2 hover:bg-red-50 text-[#767676] hover:text-[#ff5862] transition-colors rounded-lg">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Aadhar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#484848]">Upload Aadhar card (Max 1 MB)</label>
                  <button className="text-[11px] font-black text-[#ff5862] uppercase tracking-widest hover:underline">Sample</button>
                </div>
                <div className="relative">
                  <input type="file" className="hidden" id="aadhar-upload" />
                  <label htmlFor="aadhar-upload" className="flex items-center bg-[#f9fafb] border border-black/5 rounded-xl overflow-hidden cursor-pointer group hover:border-[#ff5862]/30 transition-all">
                    <span className="px-6 py-4 bg-white border-r border-black/5 text-[13px] font-black text-[#484848] group-hover:bg-[#f9fafb]">Choose file</span>
                    <span className="px-6 py-4 text-[13px] font-medium text-[#767676] truncate">{aadharFile || 'No file chosen'}</span>
                  </label>
                </div>
                {aadharFile && (
                  <div className="bg-[#f9fafb] border border-black/5 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="text-emerald-500" size={24} />
                      </div>
                      <span className="text-[13px] font-bold text-[#484848] truncate max-w-[200px]">{aadharFile}</span>
                    </div>
                    <button className="p-2 hover:bg-red-50 text-[#767676] hover:text-[#ff5862] transition-colors rounded-lg">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col gap-6">
            <div className="flex justify-between items-center w-full">
              <button
                onClick={handlePrev}
                className="bg-white border border-black/5 text-[#484848] px-10 py-4 rounded-2xl font-black text-[14px] flex items-center gap-3 shadow-xl shadow-black/5 hover:bg-[#f9fafb] transition-all"
              >
                <ChevronLeft size={18} /> prev
              </button>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-[#ff5862] to-[#ff7b84] text-white px-12 py-4 rounded-2xl font-black text-[14px] flex items-center gap-3 shadow-xl shadow-[#ff5862]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
            <p className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#22c55e]">
              <ShieldCheck size={14} /> All data in transit is safe and secure, encrypted to Ticket 9
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgreement = () => (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white rounded-[2rem] border border-black/5 shadow-2xl p-12 flex min-h-[700px]">
        {renderSidebar(3)}

        <div className="flex-1 pl-12 flex flex-col items-center justify-center space-y-16">
          <div className="w-full space-y-2 mb-8">
            <h2 className="text-2xl font-black text-[#484848]">Organizer KYC</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#ff5862] to-[#ff7b84] rounded-full"></div>
          </div>

          <div className="bg-[#f9fafb] rounded-[3rem] p-16 border border-black/[0.03] space-y-10 text-center max-w-2xl shadow-inner-lg">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-500/10">
              <ShieldCheck className="text-emerald-500" size={48} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#484848]">Last Step: User Agreement</h3>
              <p className="text-[#767676] font-medium leading-relaxed">Please review and sign the seller agreement to complete your onboarding process.</p>
            </div>
            <button
              onClick={() => setShowAgreementModal(true)}
              className="bg-[#0e1724] text-white px-12 py-5 rounded-2xl font-black text-[15px] flex items-center gap-3 hover:bg-black transition-all mx-auto shadow-xl"
            >
              Review Agreement <Eye size={18} />
            </button>
          </div>

          <div className="w-full flex justify-between items-center px-4">
            <button
              onClick={handlePrev}
              className="bg-white border border-black/5 text-[#484848] px-10 py-4 rounded-2xl font-black text-[14px] flex items-center gap-3 shadow-xl"
            >
              <ChevronLeft size={18} /> prev
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#ff5862] to-[#ff7b84] text-white px-16 py-4 rounded-2xl font-black text-[14px] flex items-center gap-3 shadow-xl shadow-[#ff5862]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Submit <CheckCircle2 size={18} /></>}
            </button>
          </div>
          <p className="flex items-center gap-2 text-[11px] font-bold text-[#22c55e]">
            <ShieldCheck size={14} /> All data in transit is safe and secure, encrypted to Ticket 9
          </p>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="max-w-[800px] mx-auto animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[3rem] border border-black/5 shadow-2xl p-20 text-center space-y-12">
        <div className="relative">
          <div className="w-32 h-32 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 relative z-10 transition-transform hover:scale-110">
            <Check size={64} strokeWidth={4} />
          </div>
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-black text-[#484848] tracking-tight">Application Submitted Successfully!</h2>
          <p className="text-[#767676] font-medium text-lg leading-relaxed max-w-md mx-auto">
            Thanks for your patience, <span className="text-[#484848] font-bold">{user.name}</span>.
            Our team is now verifying your documents.
          </p>
        </div>

        <div className="bg-[#f9fafb] rounded-[2rem] p-8 border border-black/[0.02] space-y-4 inline-block w-full text-left">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-500">
              <Clock size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#484848]">Verification in progress</h4>
              <p className="text-[13px] text-[#767676] font-medium">This usually takes 24-48 business hours.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/organiser/dashboard')}
            className="bg-[#0e1724] text-white px-10 py-5 rounded-2xl font-black text-[15px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-black/10"
          >
            <LayoutDashboard size={20} /> Organizer Panel
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-white border border-black/5 text-[#484848] px-10 py-5 rounded-2xl font-black text-[15px] flex items-center justify-center gap-3 hover:bg-[#f9fafb] transition-all shadow-xl"
          >
            <Ticket size={20} /> Browse Events
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-inter">
      <header className="py-8 px-12 flex items-center justify-between sticky top-0 bg-[#f8fafc]/90 backdrop-blur-md z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-gradient-to-r from-[#ff5862] to-[#ff7b84] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ff5862] flex items-center justify-center">
            <Ticket className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-[#484848]">Organizer <span className="italic text-[#ff5862]">KYC</span></h1>
        </div>
      </header>

      <main className="px-12 pb-32">
        {currentStep === 'INTRO' && renderIntro()}
        {currentStep === 'DETAILS' && renderDetails()}
        {currentStep === 'DOCUMENTS' && renderDocuments()}
        {currentStep === 'AGREEMENT' && renderAgreement()}
        {currentStep === 'SUCCESS' && renderSuccess()}
      </main>

      {/* Agreement Modal */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#0e1724]/80 backdrop-blur-md" onClick={() => setShowAgreementModal(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-black/5 flex justify-between items-center bg-[#f9fafb]">
              <div className="space-y-1">
                <h2 className="text-[12px] font-black text-[#767676] uppercase tracking-[0.2em]">Agreement</h2>
                <h3 className="text-2xl font-black text-[#484848]">USER AGREEMENT</h3>
              </div>
              <button
                onClick={() => setShowAgreementModal(false)}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#767676] hover:text-[#ff5862] shadow-sm transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-10 overflow-y-auto no-scrollbar space-y-10">
              {/* Agreement Content - matching reference image text roughly */}
              <div className="space-y-6">
                <h4 className="text-[15px] font-black text-[#484848] uppercase tracking-widest italic">1. SELLER T&C</h4>
                <div className="text-[14px] text-[#767676] space-y-4 font-medium leading-relaxed">
                  <p>This agreement is made on this {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} between The Ticket9 Tech Event Private Ltd, a company incorporated under the Indian Companies Act, 2013 having its registered office located at Coimbatore (hereinafter referred to as 'Ticket9', which expression shall unless repugnant to the context or meaning thereof be deemed to include a reference to its successors and permitted assigns);</p>
                  <p>And {user.name}, a {formData.category === 'Individual' ? 'individual' : 'Company'} having its registered office located at {formData.city} (hereinafter referred to as 'Event Manager' which expression shall unless repugnant to the context or meaning thereof be deemed to include a reference to its successors and permitted assigns);</p>
                  <p>Ticket9 and Event Manager shall hereinafter be individually referred to as a 'Party' and collectively as the 'Parties'.</p>

                  <h5 className="text-[14px] font-black text-[#484848] pt-4">Recitals:</h5>
                  <p>The Event (as defined below) is the property of Event Manager and Event Manager has been appointed to organize the Event. Ticket9 is engaged in the business of rendering ticket booking services through online platform channels of Ticket9, which enable customers to reserve / book tickets to various entertainment events without accessing physical points of booking / sale of the tickets to such events.</p>
                  <p>The Parties are entering into this Agreement in order to record the terms and conditions based on which, Ticket9 shall facilitate remote booking of tickets for the Event (as defined below) being organized by the Event Manager and other matters in connection therewith.</p>

                  <h5 className="text-[14px] font-black text-[#484848] pt-4 uppercase tracking-widest">1. DEFINITIONS:</h5>
                  <p>The following capitalized words and expressions, whenever used in this Agreement, unless repugnant to the meaning or context thereof, shall have the respective meanings set forth below: 'Confidential Information' shall include, but is not limited to inventions, ideas, concepts, know-how, techniques, processes, designs, specifications, drawings, patterns, diagrams, flowcharts, data, Intellectual Property Rights, manufacturing techniques, computer software, methods, procedures, materials, operations, reports, studies, and all other technical and business information in oral, written, electronic, digital or physical form that is disclosed by either...</p>
                  {/* Adding more dummy text to fill space */}
                  <p>2. SCOPE OF SERVICES: Ticket9 shall provide the platform for listing and selling tickets for events organized by the Event Manager. Ticket9 shall handle payment processing and ticket delivery to customers.</p>
                  <p>3. COMMISSION AND FEES: The Event Manager agrees to pay Ticket9 a commission for each ticket sold through the platform, as agreed upon separately.</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#f9fafb] border-t border-black/5 flex justify-end items-center gap-6">
              <span className="text-[12px] font-bold text-[#767676]">By clicking I Agree, you confirm you've read the full T&C</span>
              <button
                onClick={() => { setShowAgreementModal(false); }}
                className="bg-gradient-to-r from-[#ff5862] to-[#ff7b84] text-white px-12 py-4 rounded-2xl font-black text-[14px] shadow-xl shadow-[#ff5862]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
