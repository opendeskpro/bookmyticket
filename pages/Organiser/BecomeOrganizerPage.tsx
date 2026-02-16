
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  ArrowRight,
  CheckCircle2,
  Smartphone,
  QrCode,
  Zap,
  ShieldCheck,
  Plus,
  ChevronRight,
  Star,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Search,
  Globe,
  LayoutDashboard,
  CreditCard,
  MessageSquarePlus,
  Shield,
  ZapOff,
  Sparkles,
  Award
} from 'lucide-react';

const BecomeOrganizerPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Create' | 'Monetize' | 'Repeat' | 'Engage'>('Create');

  const partners = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    logo: `https://i.pravatar.cc/100?u=partner${i}` // Placeholder logos
  }));

  const liveEvents = [
    { title: 'Saree, These Are Just Jokes!', location: 'Coimbatore', date: 'Mar 13, 2026', type: 'Paid', banner: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400&h=400' },
    { title: 'Moonwalk Musical Night', location: 'Chennai', date: 'Jan 04, 2026', type: 'Paid', banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=400' },
    { title: 'Soulfest 2025', location: 'Chennai', date: 'Dec 24, 2025', type: 'Paid', banner: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=400&h=400' },
    { title: 'Thalapathy Katcheri DJ Night', location: 'Bengaluru', date: 'Jan 10, 2026', type: 'Paid', banner: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=400&h=400' },
  ];

  return (
    <div className="min-h-screen bg-transparent font-inter relative overflow-hidden">
      {/* Absolute Background Image Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('file:///home/raja/.gemini/antigravity/brain/6e645366-9b22-4abc-9ec9-a36d5dd0694f/premium_sidebar_bg_1771147469027.png')` }}
      />
      <div className="fixed inset-0 z-0 bg-[#050716]/95 backdrop-blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation / Header Shimmer */}
        <header className="py-10 px-20 flex items-center justify-between bg-[#050716]/60 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7209B7] to-[#FF006E] flex items-center justify-center shadow-2xl shadow-purple-500/20 rotate-3 border border-white/20">
              <Zap className="text-white w-7 h-7 -rotate-3" />
            </div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">IDENTITY<br /><span className="text-[10px] not-italic tracking-[0.4em] text-[#FF006E] font-bold">PROTOCOLS</span></h1>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-black px-10 py-4 rounded-3xl font-black text-[12px] uppercase tracking-widest hover:bg-[#FF006E] hover:text-white transition-all shadow-2xl active:scale-95 italic"
          >
            Terminal Access
          </button>
        </header>

        {/* Hero Section Redesign */}
        <section className="max-w-7xl mx-auto px-10 py-32 flex flex-col lg:flex-row items-center justify-between gap-24 min-h-[90vh]">
          <div className="flex-1 space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#7209B7]/10 border border-[#7209B7]/20 text-[#7209B7] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl italic">
              <Award size={14} className="animate-pulse" /> Elite Protocol Activated
            </div>
            <h1 className="text-7xl font-black text-white leading-[0.9] italic tracking-tighter uppercase">
              Host the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7209B7] via-[#FF006E] to-[#FFB703]">Unforgettable</span>
            </h1>
            <p className="text-2xl font-bold text-white/40 leading-relaxed uppercase tracking-tight max-w-xl">
              Establish your authority in the event grid with the <span className="text-white italic">ultimate synchronization platform.</span>
            </p>

            <div className="flex flex-col gap-10">
              <button
                onClick={() => navigate('/organiser/create')}
                className="bg-white text-black px-16 py-6 rounded-3xl font-black text-lg w-fit hover:bg-[#FF006E] hover:text-white transition-all shadow-2xl shadow-purple-500/10 italic uppercase tracking-widest group flex items-center gap-4 active:scale-95"
              >
                Deploy Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center gap-8 text-[10px] font-black text-white/10 uppercase tracking-[0.4em] italic">
                Sequence Ready :
                <span className="flex items-center gap-2 text-emerald-400/60"><Users size={14} /> Identity Auth</span>
                <span className="flex items-center gap-2 text-emerald-400/60"><Shield size={14} /> KYC Node</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-12 border-t border-white/5">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex items-center gap-4 backdrop-blur-xl group hover:border-white/20 transition-all">
                <Globe className="text-[#3A86FF]" size={24} />
                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic group-hover:text-white transition-colors">Global Transmission</div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-all">
                <div className="flex text-[#FFB703]"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                <span className="text-[12px] font-black text-white italic">4.9 Node Index</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7209B7] to-[#FF006E] opacity-20 blur-[100px] group-hover:opacity-30 transition-opacity animate-pulse"></div>
            <img
              src="/event_organizer_illustration_1771080592158.png"
              className="w-full h-auto object-contain scale-110 drop-shadow-[0_0_50px_rgba(114,9,183,0.3)] relative z-10 transition-transform duration-1000 group-hover:scale-115 grayscale group-hover:grayscale-0"
              alt="Organizer Protocol"
            />
          </div>
        </section>

        {/* Tabbed Feature Section Redesign */}
        <section className="py-40 bg-[#050716]/40 backdrop-blur-3xl relative">
          <div className="max-w-7xl mx-auto px-10">
            <div className="text-center mb-32 space-y-6">
              <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">THE END-TO-END<br /><span className="text-[#FF006E]">EVENT LIFECYCLE</span></h2>
              <div className="flex justify-center gap-6 overflow-x-auto pb-6 no-scrollbar">
                {(['Create', 'Monetize', 'Repeat', 'Engage'] as const).map((label) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all italic border ${activeTab === label ? 'bg-[#7209B7] text-white border-[#7209B7] shadow-[0_0_30px_rgba(114,9,183,0.3)]' : 'bg-white/5 text-white/20 border-white/10 hover:text-white/40 hover:bg-white/10'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Contents - Redesigned with Glassmorphism */}
            <div className="relative min-h-[600px]">
              {activeTab === 'Create' && (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] p-24 border border-white/5 flex flex-col lg:flex-row items-center gap-24 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <div className="flex-1 space-y-10">
                    <div className="w-16 h-16 bg-[#7209B7]/20 border border-[#7209B7]/40 rounded-3xl flex items-center justify-center text-[#7209B7] shadow-2xl">
                      <Plus size={32} />
                    </div>
                    <div>
                      <p className="text-[#FF006E] text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Protocol Sector 01</p>
                      <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">Initialize</h3>
                      <p className="text-white/20 text-lg font-bold uppercase tracking-widest italic leading-tight">Publish in Quantum Seconds</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">Zero-Friction UX</h4>
                        <p className="text-[14px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
                          Host single-day, multi-frequency, recurring or virtual nodes with absolute precision.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">Clone Legacy</h4>
                        <p className="text-[14px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
                          Duplicate successful mutation chains with a single pulse. Effortless scaling.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/organiser/create')}
                      className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center gap-4 hover:bg-[#FF006E] hover:text-white transition-all shadow-2xl italic active:scale-95"
                    >
                      Access Creation Terminal <ArrowRight size={20} />
                    </button>
                  </div>
                  <div className="flex-1 relative group">
                    <img
                      src="/event_creation_mockup_1771080610927.png"
                      className="w-full h-auto rounded-[3.5rem] shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                      alt="Creation Hub"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#7209B7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3.5rem]"></div>
                  </div>
                </div>
              )}

              {activeTab === 'Monetize' && (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] p-24 border border-white/5 flex flex-col lg:flex-row-reverse items-center gap-24 shadow-2xl animate-in fade-in slide-in-from-right-10 duration-700">
                  <div className="flex-1 space-y-10">
                    <div className="w-16 h-16 bg-[#FF006E]/20 border border-[#FF006E]/40 rounded-3xl flex items-center justify-center text-[#FF006E] shadow-2xl">
                      <TrendingUp size={32} />
                    </div>
                    <div>
                      <p className="text-[#FFB703] text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Protocol Sector 02</p>
                      <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">Monetize</h3>
                      <p className="text-white/20 text-lg font-bold uppercase tracking-widest italic leading-tight">Revenue Extraction Utility</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">Dynamic Pricing</h4>
                        <p className="text-[14px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
                          Inject early-bird pulses and promotional mutations to maximize conversion velocity.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">Direct extractions</h4>
                        <p className="text-[14px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
                          Receive revenue payloads directly to your bank node. Transparent, instant, zero latency.
                        </p>
                      </div>
                    </div>
                    <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center gap-4 hover:bg-[#FFB703] transition-all shadow-2xl italic active:scale-95">
                      Sync Banking Hub <ArrowRight size={20} />
                    </button>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-[3rem] p-16 border border-white/10 shadow-2xl backdrop-blur-xl space-y-10 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E] to-transparent opacity-5"></div>
                    <div className="grid grid-cols-2 gap-8 relative z-10">
                      <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-2 group-hover:bg-white/10 transition-all">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Views</p>
                        <p className="text-4xl font-black text-white italic">29.7<span className="text-[#FF006E]">K</span></p>
                      </div>
                      <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-2 group-hover:bg-white/10 transition-all">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Mutation Count</p>
                        <p className="text-4xl font-black text-white italic">754</p>
                      </div>
                    </div>
                    <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] relative z-10">
                      <p className="text-xs font-black text-emerald-400 uppercase tracking-widest italic">Live Revenue Pulse: +24% Acceleration</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Repeat & Engage placeholders with similar high-fidelity styling */}
              {activeTab === 'Repeat' && (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] p-24 border border-white/5 flex flex-col lg:flex-row items-center gap-24 shadow-2xl animate-in fade-in slide-in-from-left-10 duration-700">
                  <div className="flex-1 space-y-10">
                    <div className="w-16 h-16 bg-[#3A86FF]/20 border border-[#3A86FF]/40 rounded-3xl flex items-center justify-center text-[#3A86FF] shadow-2xl">
                      <Zap size={32} />
                    </div>
                    <div>
                      <p className="text-[#3A86FF] text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Protocol Sector 03</p>
                      <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">Regenerate</h3>
                      <p className="text-white/20 text-lg font-bold uppercase tracking-widest italic leading-tight">Business Scaling Algorithm</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">One-Click Multi-Node</h4>
                        <p className="text-[14px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
                          Scale your presence across multiple geographic sectors with automated deployment triggers.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">Recursive Logic</h4>
                        <p className="text-[14px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
                          Inherit all settings, descriptions, and ticket meshes from successful past iterations.
                        </p>
                      </div>
                    </div>
                    <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center gap-4 hover:bg-[#3A86FF] hover:text-white transition-all shadow-2xl italic active:scale-95">
                      Initiate Scaling <ArrowRight size={20} />
                    </button>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="relative w-80 h-80 group">
                      <div className="absolute inset-0 bg-[#3A86FF]/20 rounded-full animate-ping opacity-20"></div>
                      <div className="relative w-80 h-80 bg-white/5 backdrop-blur-3xl rounded-full shadow-[0_0_100px_rgba(58,134,255,0.2)] flex items-center justify-center border border-white/10 transition-transform duration-1000 group-hover:scale-110">
                        <Zap size={100} className="text-[#3A86FF] drop-shadow-[0_0_30px_rgba(58,134,255,0.5)]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Engage' && (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] p-24 border border-white/5 flex flex-col lg:flex-row-reverse items-center gap-24 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <div className="flex-1 space-y-10">
                    <div className="w-16 h-16 bg-[#38B000]/20 border border-[#38B000]/40 rounded-3xl flex items-center justify-center text-[#38B000] shadow-2xl">
                      <Users size={32} />
                    </div>
                    <div>
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Protocol Sector 04</p>
                      <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">Synergy</h3>
                      <p className="text-white/20 text-lg font-bold uppercase tracking-widest italic leading-tight">Neural Fan Engagement</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">Unified Community</h4>
                        <p className="text-[14px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
                          Connect different attendee clusters and analyze demographic behavioral patterns.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-xl italic uppercase tracking-tighter">Direct Marketing</h4>
                        <p className="text-[14px] text-white/30 leading-relaxed font-bold uppercase tracking-tight">
                          Integrated multi-channel transmission tools to keep your audience synchronized.
                        </p>
                      </div>
                    </div>
                    <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center gap-4 hover:bg-[#38B000] hover:text-white transition-all shadow-2xl italic active:scale-95">
                      Engage Colony <ArrowRight size={20} />
                    </button>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-[3rem] p-20 border border-white/10 shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl space-y-10 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#38B000] to-transparent opacity-5"></div>
                    <div className="space-y-8 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.2rem] flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl">
                          <Users size={32} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-black text-white/20 uppercase tracking-widest">Global Citizenry</p>
                          <p className="text-4xl font-black text-white italic">12,450</p>
                        </div>
                      </div>
                      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[75%] shadow-[0_0_20px_rgba(56,176,0,0.5)]"></div>
                      </div>
                      <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] italic text-right">Retention Threshold: 75% Verified</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Global Feed Preview Section Redesign */}
        <section className="py-40 relative">
          <div className="max-w-7xl mx-auto px-10">
            <div className="mb-20 space-y-2">
              <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">ORBITAL FEED <span className="text-[#FF006E] animate-pulse">●</span></h2>
              <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] italic">Live Pulse of Premium Host Deployments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {liveEvents.map((event, i) => (
                <div key={i} className="bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl group hover:border-white/20 transition-all hover:-translate-y-4 duration-500">
                  <div className="aspect-[1/1.2] relative overflow-hidden">
                    <img src={event.banner} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                    <div className="absolute top-6 right-6">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-[#3A86FF] shadow-xl border border-white/10 group-hover:bg-[#3A86FF] group-hover:text-white transition-all">
                        <CheckCircle2 size={24} />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050716] via-transparent to-transparent opacity-60"></div>
                  </div>
                  <div className="p-8 space-y-6 relative -mt-10 z-10">
                    <h4 className="font-black text-white text-lg italic uppercase tracking-tighter truncate leading-tight">{event.title}</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                        <MapPin size={14} className="text-[#FF006E]" /> {event.location}
                      </div>
                      <div className="flex items-center gap-3 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                        <Calendar size={14} className="text-[#FFB703]" /> {event.date}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] italic">{event.type} Protocol</span>
                      <button className="text-[10px] font-black uppercase text-white/20 hover:text-[#FF006E] transition-colors italic tracking-widest">Examine Hub</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnerships / Alliances Redesign */}
        <section className="py-40 bg-[#050716]/60 backdrop-blur-3xl">
          <div className="max-w-7xl mx-auto px-10 text-center space-y-32">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">ALLIANCE MESH</h2>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] italic">Globally Synchronized Host Networks</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6">
              {partners.map(p => (
                <div key={p.id} className="bg-white/5 aspect-square rounded-[2rem] flex items-center justify-center p-6 shadow-2xl border border-white/5 hover:scale-110 hover:bg-white/10 hover:border-white/20 transition-all group">
                  <img src={p.logo} className="w-full h-full object-contain grayscale opacity-20 group-hover:opacity-60 transition-all" />
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-16 bg-slate-900/40 backdrop-blur-3xl p-24 rounded-[5rem] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
              <div className="text-left space-y-6 max-w-lg">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-xl">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">TRUSTED<br /><span className="text-emerald-500">IDENTITY LAYER</span></h3>
                <p className="text-white/30 text-lg font-bold uppercase tracking-tight leading-relaxed italic">
                  Absolute encryption and payout integrity via high-frequency SSL and mutual node synchronization.
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Cloud Node', val: '4.9/5', icon: <Globe size={14} className="text-blue-500" /> },
                  { label: 'Lead Pulse', val: '4.5/5', icon: <Plus size={14} className="text-red-500" /> },
                  { label: 'Pilot Hub', val: '4.5/5', icon: <Sparkles size={14} className="text-emerald-500" /> },
                  { label: 'C-Terra', val: '4.5/5', icon: <Zap size={14} className="text-orange-500" /> }
                ].map((rating, i) => (
                  <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] flex flex-col items-center gap-4 border border-white/10 group hover:bg-white hover:text-black transition-all">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-black/40">{rating.label}</span>
                    <div className="flex text-[#FFB703] group-hover:text-black">{rating.icon}</div>
                    <span className="text-xl font-black group-hover:text-black italic">{rating.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA Redesign - Ticket Form Factor */}
        <section className="max-w-7xl mx-auto px-10 py-48">
          <div className="bg-gradient-to-br from-[#FF006E]/80 to-[#7209B7]/80 backdrop-blur-3xl rounded-[5rem] p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-24 shadow-[0_0_150px_rgba(114,9,183,0.4)] border border-white/20">
            {/* Ticket notch styles */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-40 bg-[#050716] rounded-full border border-white/10 shadow-inner"></div>
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-40 bg-[#050716] rounded-full border border-white/10 shadow-inner"></div>

            <div className="space-y-10 max-w-xl relative z-10 text-center lg:text-left">
              <h2 className="text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">INITIALIZE<br />IDENTITY</h2>
              <p className="text-white/80 font-bold uppercase tracking-tight text-xl leading-relaxed">
                Terminal synchronization is free of cost. Access our neural monitors for a direct host evaluation pulse.
              </p>
              <div className="flex flex-col items-center lg:items-start gap-8">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-white text-black px-16 py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-2xl hover:bg-[#050716] hover:text-white transition-all italic active:scale-95"
                >
                  Become a Host
                </button>
                <button className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-4 hover:text-white transition-all italic group">
                  Request Sync Demo <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-white blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="w-[450px] h-[450px] bg-white/10 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-1000 overflow-hidden rotate-6">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
                  className="w-full h-full object-cover grayscale"
                  alt="Terminal Interface"
                />
              </div>
            </div>
          </div>

          <div className="mt-40 text-center space-y-20">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">PROTOCOLS FAQ</h3>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                "WHEN CAN I EXTRACT NODE REVENUE?",
                "IDENTITY ARTIFACT VERIFICATION LATENCY?",
                "MULTI-GEOGRAPHIC DEPLOYMENT LIMITS?",
                "COMMISSION MUTATION CALCULUS?"
              ].map((q, i) => (
                <div key={i} className="p-8 bg-white/5 rounded-[2rem] text-left flex justify-between items-center group cursor-pointer hover:bg-[#FF006E] transition-all border border-white/10 hover:border-white/20 shadow-xl overflow-hidden relative">
                  <p className="font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em] italic transition-colors relative z-10">{q}</p>
                  <ChevronRight size={24} className="text-white/10 group-hover:text-white group-hover:translate-x-3 transition-all relative z-10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Footer Shimmer */}
        <footer className="py-20 border-t border-white/5 text-center bg-[#050716]/60 backdrop-blur-3xl">
          <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.6em] italic">©2026 IDENTITY_PROTOCOLS // ALL MUTATIONS RESERVED</p>
        </footer>
      </div>
    </div>
  );
};

export default BecomeOrganizerPage;
