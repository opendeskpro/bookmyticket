
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
  LayoutDashboard,
  Lock,
  Zap,
  Shield
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
    <div className="w-1/4 pr-12 border-r border-white/5 relative">
      <div className="space-y-16 relative">
        <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-white/5"></div>

        {/* Step 1 */}
        <div className="flex items-center gap-5 relative z-10 transition-all">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-[10px] transition-all shadow-2xl ${activeStep >= 1 ? (activeStep > 1 ? 'bg-[#38B000] text-white' : 'bg-[#FF006E] text-white ring-8 ring-[#FF006E]/10') : 'bg-white/5 border border-white/10 text-white/20'}`}>
            {activeStep > 1 ? <Check size={20} strokeWidth={4} /> : '01'}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${activeStep >= 1 ? 'text-white' : 'text-white/20'}`}>Organization</span>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-5 relative z-10 transition-all">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-[10px] transition-all shadow-2xl ${activeStep >= 2 ? (activeStep > 2 ? 'bg-[#38B000] text-white' : 'bg-[#7209B7] text-white ring-8 ring-[#7209B7]/10') : 'bg-white/5 border border-white/10 text-white/20'}`}>
            {activeStep > 2 ? <Check size={20} strokeWidth={4} /> : '02'}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${activeStep >= 2 ? 'text-white' : 'text-white/20'}`}>Artifacts</span>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-5 relative z-10 transition-all">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-[10px] transition-all shadow-2xl ${activeStep >= 3 ? (activeStep > 3 ? 'bg-[#38B000] text-white' : 'bg-[#FFB703] text-black ring-8 ring-[#FFB703]/10') : 'bg-white/5 border border-white/10 text-white/20'}`}>
            {activeStep > 3 ? <Check size={20} strokeWidth={4} /> : '03'}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${activeStep >= 3 ? 'text-white' : 'text-white/20'}`}>Encryption</span>
        </div>
      </div>
    </div>
  );

  const renderIntro = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="bg-[#050716] relative overflow-hidden h-96 flex items-center px-24">
          <div className="absolute top-10 left-10 opacity-10">
            <div className="grid grid-cols-8 gap-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
              ))}
            </div>
          </div>
          <div className="relative z-10 space-y-4">
            <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">IDENTITY<br />ONBOARDING</h1>
            <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.5em] ml-2">Secure Node Authentication Protocol</p>
          </div>
          <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-gradient-to-br from-[#7209B7] to-[#FF006E] rounded-full opacity-20 blur-[120px] animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 p-24 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7209B7] to-[#FF006E] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
            <img
              src="https://img.freepik.com/free-vector/identity-verification-concept-illustration_114360-3136.jpg"
              className="w-full h-auto drop-shadow-3xl rounded-[3rem] grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5"
              alt="KYC Onboarding"
            />
          </div>
          <div className="space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl italic">
              <Zap size={14} className="animate-pulse" /> Sequence Ready
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white leading-tight italic tracking-tighter">Establish Authority</h2>
              <p className="text-white/40 font-bold text-lg leading-relaxed uppercase tracking-tight">Synchronize your credentials with the global event registry for seamless payout mutations.</p>
            </div>
            <div className="space-y-10">
              {[
                { title: 'Authority Node Access', desc: 'Secure listing authority for premium venue deployments.', icon: <Shield size={20} /> },
                { title: 'Ledger Synchronization', desc: 'Automated revenue extraction through verified relays.', icon: <LayoutDashboard size={20} /> },
                { title: 'Global Trust Pulse', desc: 'Real-time reliability indexing across the coordinate system.', icon: <Globe size={20} /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="mt-1 w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 shadow-xl group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-white text-[18px] italic">{item.title}</h4>
                    <p className="text-white/20 text-[14px] font-bold uppercase tracking-wide leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-8 flex items-center gap-10">
              <button
                onClick={handleNext}
                className="bg-white text-black px-12 py-6 rounded-3xl font-black text-[15px] flex items-center gap-4 hover:bg-[#FF006E] hover:text-white transition-all shadow-2xl active:scale-95 italic group uppercase tracking-widest"
              >
                Initialize Protocol <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="text-white/20 font-black text-[12px] flex items-center gap-3 hover:text-white transition-all uppercase tracking-widest italic decoration-white/10 underline underline-offset-8">
                Documentation Portal <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 shadow-2xl p-20 flex min-h-[800px]">
        {renderSidebar(1)}

        <div className="flex-1 pl-20 space-y-16">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Authority Registry</h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Sector 01: Organization Parameters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {/* Category */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Organization Type*</label>
              <div className="relative">
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[14px] font-black text-white italic appearance-none outline-none focus:border-[#7209B7] transition-all cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option className="bg-[#050716]" value="Individual">Individual</option>
                  <option className="bg-[#050716]" value="Creator">Creator</option>
                  <option className="bg-[#050716]" value="Company">Company</option>
                  <option className="bg-[#050716]" value="Non-profit Organization">Non-profit Organization</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Individual Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Authorized Identity</label>
              <input
                type="text"
                className="w-full bg-white/10 border border-transparent rounded-2xl px-6 py-5 text-[14px] font-black text-white italic outline-none cursor-not-allowed opacity-50"
                value={formData.individualName}
                readOnly
              />
            </div>

            {/* PAN card number */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Cryptographic ID (PAN)*</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[14px] font-black text-white italic outline-none focus:border-[#7209B7] transition-all"
                value={formData.panNumber}
                onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
              />
            </div>

            {/* Website Link */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Node Domain (URL)</label>
              <input
                type="text"
                placeholder="https://terminal-node.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[14px] font-black text-white italic outline-none focus:border-[#7209B7] transition-all placeholder:text-white/5"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            {/* Social Media Link */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Social Frequency</label>
              <input
                type="text"
                placeholder="https://facebook.com/identity"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[14px] font-black text-white italic outline-none focus:border-[#7209B7] transition-all placeholder:text-white/5"
                value={formData.socialMedia}
                onChange={e => setFormData({ ...formData, socialMedia: e.target.value })}
              />
            </div>

            {/* Designation */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4">Coordinate City</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[14px] font-black text-white italic outline-none focus:border-[#7209B7] transition-all"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-12 flex flex-col gap-12 border-t border-white/5">
            <label className="flex items-center gap-6 cursor-pointer group w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={formData.undertakingAccepted}
                  onChange={e => setFormData({ ...formData, undertakingAccepted: e.target.checked })}
                />
                <div className="w-6 h-6 border-2 border-white/10 rounded-lg flex items-center justify-center transition-all peer-checked:bg-[#FF006E] peer-checked:border-[#FF006E]">
                  <Check size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                </div>
              </div>
              <span className="text-[13px] font-black text-white/40 uppercase tracking-widest italic group-hover:text-white transition-colors">I accept the <button className="text-[#FF006E] hover:underline decoration-skip-ink">Undertaking Protocols</button></span>
            </label>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-[#7209B7] text-white px-16 py-5 rounded-3xl font-black text-[14px] flex items-center gap-4 shadow-2xl shadow-purple-500/20 hover:bg-white hover:text-[#7209B7] transition-all active:scale-95 italic uppercase tracking-widest"
              >
                Next Sequence <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 shadow-2xl p-20 flex min-h-[800px]">
        {renderSidebar(2)}

        <div className="flex-1 pl-20 flex flex-col">
          <div className="space-y-2 mb-20">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Artifact Upload</h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Sector 02: Verification Documents</p>
          </div>

          <div className="flex-1 space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
              {[
                { label: 'Identity Mesh (PAN)', file: panFile, setter: setPanFile, color: 'from-[#FF006E] to-[#7209B7]' },
                { label: 'Fiscal Node (Cheque)', file: chequeFile, setter: setChequeFile, color: 'from-[#3A86FF] to-[#8338EC]' },
                { label: 'Global Hash (Aadhar)', file: aadharFile, setter: setAadharFile, color: 'from-[#38B000] to-[#008000]' }
              ].map((doc, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center justify-between ml-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{doc.label}</label>
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-widest italic cursor-help hover:text-[#FF006E] transition-colors">Spec. Sample</span>
                  </div>
                  {!doc.file ? (
                    <div className="relative group">
                      <input type="file" className="hidden" id={`upload-${idx}`} onChange={(e) => doc.setter(e.target.files?.[0]?.name || null)} />
                      <label htmlFor={`upload-${idx}`} className="flex flex-col items-center justify-center bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] p-12 cursor-pointer group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <Upload size={32} className="text-white/20 mb-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-black text-white/40 uppercase tracking-widest italic">Inject Data Chunk</span>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl group overflow-hidden relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${doc.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                      <div className="flex items-center gap-6 relative z-10">
                        <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shadow-xl border border-white/10`}>
                          <FileText className="text-white/40" size={24} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[13px] font-black text-white italic truncate max-w-[200px] block">{doc.file}</span>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Synchronized</span>
                        </div>
                      </div>
                      <button onClick={() => doc.setter(null)} className="p-3 bg-white/5 hover:bg-[#FF006E] text-white/20 hover:text-white transition-all rounded-xl relative z-10 shadow-lg">
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 flex flex-col gap-8 border-t border-white/5">
            <div className="flex justify-between items-center w-full">
              <button
                onClick={handlePrev}
                className="bg-white/5 border border-white/10 text-white/40 px-12 py-5 rounded-3xl font-black text-[12px] flex items-center gap-4 hover:bg-white hover:text-black transition-all italic uppercase tracking-widest"
              >
                <ChevronLeft size={20} /> back
              </button>
              <button
                onClick={handleNext}
                className="bg-[#38B000] text-white px-16 py-5 rounded-3xl font-black text-[14px] flex items-center gap-4 shadow-2xl shadow-green-500/20 hover:bg-white hover:text-[#38B000] transition-all active:scale-95 italic uppercase tracking-widest"
              >
                Verification Pulse <ArrowRight size={20} />
              </button>
            </div>
            <p className="flex items-center justify-center gap-3 text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.2em] italic">
              <Lock size={14} /> End-to-End Quantum Encryption Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgreement = () => (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 shadow-2xl p-20 flex min-h-[800px]">
        {renderSidebar(3)}

        <div className="flex-1 pl-20 flex flex-col items-center justify-center space-y-20">
          <div className="w-full space-y-2 mb-12">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Authority Encryption</h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Sector 03: Mutual Consent Protocols</p>
          </div>

          <div className="bg-white/5 rounded-[4rem] p-24 border border-white/10 space-y-12 text-center max-w-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB703] to-transparent opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-8 ring-[#FFB703]/10 border border-[#FFB703]/20 relative z-10 transition-transform group-hover:scale-110">
              <ShieldCheck className="text-[#FFB703]" size={64} />
            </div>
            <div className="space-y-6 relative z-10">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Final Encryption Step</h3>
              <p className="text-white/30 font-bold leading-relaxed uppercase tracking-tight text-lg">Initialize the mutual node agreement to complete the authority sequence and activate your portal access.</p>
            </div>
            <button
              onClick={() => setShowAgreementModal(true)}
              className="bg-white text-black px-16 py-6 rounded-3xl font-black text-[15px] flex items-center gap-4 hover:bg-[#FFB703] hover:text-black transition-all mx-auto shadow-2xl italic uppercase tracking-widest relative z-10 active:scale-95"
            >
              Examine Protocol <Eye size={20} />
            </button>
          </div>

          <div className="w-full flex justify-between items-center px-8">
            <button
              onClick={handlePrev}
              className="bg-white/5 border border-white/10 text-white/40 px-12 py-5 rounded-3xl font-black text-[12px] flex items-center gap-4 hover:bg-white hover:text-black transition-all italic uppercase tracking-widest"
            >
              <ChevronLeft size={20} /> back
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-[#FFB703] text-black px-20 py-5 rounded-3xl font-black text-[14px] flex items-center gap-4 shadow-2xl shadow-yellow-500/20 hover:bg-white transition-all active:scale-95 italic uppercase tracking-widest disabled:opacity-20"
            >
              {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <>Finalize Mutation <CheckCircle2 size={20} /></>}
            </button>
          </div>
          <p className="flex items-center gap-4 text-[10px] font-black text-[#FFB703]/40 uppercase tracking-[0.2em] italic">
            <Lock size={14} /> Legally Binding Digital Signature Pulse Active
          </p>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-1000">
      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[5rem] border border-white/5 shadow-2xl p-24 text-center space-y-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#38B000]/10 to-transparent opacity-20"></div>
        <div className="relative">
          <div className="w-40 h-40 bg-[#38B000] text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40 relative z-10 transition-transform hover:scale-110 border-8 border-white/10">
            <Check size={80} strokeWidth={4} />
          </div>
          <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20 animate-pulse"></div>
        </div>

        <div className="space-y-8 relative z-10">
          <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-tight">SEQUENCE<br />SYNCHRONIZED</h2>
          <p className="text-white/40 font-bold text-xl leading-relaxed max-w-lg mx-auto uppercase tracking-tight">
            Identity artifacts received. Our neural monitors are verifying your <span className="text-white font-black italic">Authority Node</span> status within the registry.
          </p>
        </div>

        <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 space-y-6 inline-block w-full text-left relative z-10">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shadow-xl text-[#FFB703] border border-[#FFB703]/20">
              <Clock size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-white text-xl italic uppercase tracking-tight">Latency Phase Initiated</h4>
              <p className="text-[14px] text-white/30 font-bold uppercase tracking-widest">Verification node completion expected within 24-48 solar hours.</p>
            </div>
          </div>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row gap-8 justify-center relative z-10">
          <button
            onClick={() => navigate('/organiser/dashboard')}
            className="bg-white text-black px-12 py-6 rounded-3xl font-black text-[15px] flex items-center justify-center gap-4 hover:bg-[#7209B7] hover:text-white transition-all shadow-2xl italic uppercase tracking-widest"
          >
            <LayoutDashboard size={20} /> Access Portal
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-white/5 border border-white/10 text-white/40 px-12 py-6 rounded-3xl font-black text-[15px] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all shadow-2xl italic uppercase tracking-widest underline decoration-white/10 underline-offset-8"
          >
            <Ticket size={20} /> Global Feed
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent font-inter relative overflow-hidden">
      {/* Absolute Background Image Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('file:///home/raja/.gemini/antigravity/brain/6e645366-9b22-4abc-9ec9-a36d5dd0694f/premium_sidebar_bg_1771147469027.png')` }}
      />
      <div className="fixed inset-0 z-0 bg-[#050716]/95 backdrop-blur-3xl" />

      <header className="py-12 px-20 flex items-center justify-between sticky top-0 z-[100] bg-[#050716]/60 backdrop-blur-3xl border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="w-14 h-14 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all"
        >
          <ChevronLeft size={24} strokeWidth={4} />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7209B7] to-[#FF006E] flex items-center justify-center shadow-2xl shadow-purple-500/20 rotate-3 border border-white/20">
            <Zap className="text-white w-6 h-6 -rotate-3" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">IDENTITY<br /><span className="text-[10px] not-italic tracking-[0.4em] text-[#FF006E] font-bold">PROTOCOLS</span></h1>
        </div>
      </header>

      <main className="px-20 py-24 relative z-10">
        {currentStep === 'INTRO' && renderIntro()}
        {currentStep === 'DETAILS' && renderDetails()}
        {currentStep === 'DOCUMENTS' && renderDocuments()}
        {currentStep === 'AGREEMENT' && renderAgreement()}
        {currentStep === 'SUCCESS' && renderSuccess()}
      </main>

      {/* Agreement Modal - Re-themed */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-12 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[#050716]/90 backdrop-blur-2xl" onClick={() => setShowAgreementModal(false)}></div>
          <div className="relative bg-slate-900/80 border border-white/10 w-full max-w-5xl rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 backdrop-blur-3xl">
            <div className="p-16 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="space-y-1">
                <h2 className="text-[10px] font-black text-[#FFB703] uppercase tracking-[0.5em]">Legal Mutation Layer</h2>
                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">Authority Covenant</h3>
              </div>
              <button
                onClick={() => setShowAgreementModal(false)}
                className="w-16 h-16 rounded-full bg-white/5 hover:bg-[#FF006E] flex items-center justify-center text-white/40 hover:text-white shadow-xl transition-all border border-white/10"
              >
                <X size={32} />
              </button>
            </div>

            <div className="p-16 overflow-y-auto no-scrollbar space-y-12">
              <div className="space-y-8">
                <h4 className="text-[18px] font-black text-white uppercase tracking-widest italic border-l-4 border-[#FF006E] pl-6">01. OPERATIONAL PARAMETERS</h4>
                <div className="text-[15px] text-white/40 space-y-6 font-bold uppercase tracking-tight leading-relaxed">
                  <p>This covenant is established on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} between <span className="text-white italic">EVENTO CORE</span> (hereinafter 'Registry Authority') and <span className="text-white italic">{user.name}</span> (hereinafter 'Authorized Host').</p>
                  <p>The Host acknowledges that all data transmissions, ticket mutations, and financial extractions conducted through this terminal are subject to high-frequency verification and compliance protocols.</p>
                  <p>Registry Authority reserves the right to suspend node access if integrity thresholds are compromised or if deviations from established safety vectors are detected during automated auditing.</p>

                  <h5 className="text-[16px] font-black text-white pt-6 uppercase italic">Recitals:</h5>
                  <p>The Host maintains full ownership of Identity Artifacts but grants Registry Authority permission to encrypt and relay these artifacts to verified financial nodes for processing payout mutations.</p>
                  <p>Both Parties agree to maintain quantum-grade confidentiality regarding internal operational sequences and proprietary terminal logic disclosed during this authority synchronization.</p>

                  <h5 className="text-[16px] font-black text-white pt-6 uppercase tracking-widest italic">02. FISCAL DYNAMICS:</h5>
                  <p>Commission nodes are calculated dynamically based on event scope and transaction volume. Net payouts shall be released according to established solar cycles after attendance validation hashes are verified by the scanning terminal.</p>
                </div>
              </div>
            </div>

            <div className="p-16 bg-white/5 border-t border-white/10 flex justify-between items-center gap-12">
              <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] italic">Initializing Agreement Pulse... Validation Required</span>
              <button
                onClick={() => { setShowAgreementModal(false); }}
                className="bg-[#38B000] text-white px-16 py-6 rounded-3xl font-black text-[15px] shadow-2xl shadow-green-500/20 hover:bg-white hover:text-[#38B000] transition-all italic uppercase tracking-widest active:scale-95"
              >
                Confirm Covenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
