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
  Search
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
    <div className="bg-[#fcfaff] min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl md:text-6xl font-black text-[#2e2b61] leading-[1.1]">
            Where Next-Gen Events Begin
          </h1>
          <p className="text-xl font-bold text-slate-900 leading-relaxed">
            Host your next event with an all-in-one event platform.
          </p>
          <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
            Whether you're just starting out or organizing your biggest event yet, We ensure a seamless, stress-free experience every step of the way.
          </p>
          <div className="flex flex-col gap-6">
            <button
              onClick={() => navigate('/organiser/create')}
              className="bg-black text-white px-10 py-4 rounded-full font-black text-sm w-fit hover:scale-105 transition-all shadow-xl shadow-black/10"
            >
              Create Event
            </button>
            <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              Get Started in 2 easy steps :
              <span className="flex items-center gap-1.5 text-pink-500"><Users size={14} /> Signup</span>
              <span className="flex items-center gap-1.5 text-pink-500"><ShieldCheck size={14} /> KYC</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
              <img src="https://g2.com/favicon.ico" className="w-6 h-6" alt="G2" />
              <div className="text-[10px] font-black text-[#0a0a23] uppercase">Users Love Us</div>
            </div>
            <div className="flex items-center gap-2 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              <span className="text-xs font-black text-slate-900">4.8</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <img
            src="/event_organizer_illustration_1771080592158.png"
            className="w-full h-auto object-contain scale-110"
            alt="Event illustration"
          />

        </div>

      </section>

      {/* Feature Steps */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-[#2e2b61]">Your entire event journey in one place</h2>
            <div className="flex justify-center gap-4 mt-12 overflow-x-auto pb-4">
              {(['Create', 'Monetize', 'Repeat', 'Engage'] as const).map((label) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === label ? 'bg-[#7c3aed]/10 text-[#7c3aed] shadow-lg shadow-[#7c3aed]/5' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  {label}
                </button>
              ))}
            </div>

          </div>

          {/* Step 1 */}
          {activeTab === 'Create' && (
            <div className="bg-[#f0e8ff] rounded-[3.5rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-16 mb-20 overflow-hidden relative">
              <div className="flex-1 space-y-8">
                <div className="w-12 h-12 bg-[#7c3aed] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Plus size={24} />
                </div>
                <div>
                  <p className="text-[#7c3aed] text-xs font-black uppercase tracking-[0.3em] mb-2">Step 1</p>
                  <h3 className="text-3xl font-black text-[#2e2b61] mb-2">Create</h3>
                  <p className="text-slate-500 font-medium">Publish in Minutes</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2e2b61]">Events with Ease</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Plan and publish your event in just a few steps, be it single-day, multi-day, seated, recurring, or online.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2e2b61]">Clone Past Events with a Click</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Save time and effort by duplicating your previous events. With just a few clicks, you can clone, tweak, and publish.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/organiser/create')}
                  className="bg-[#7c3aed] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#7c3aed]/20"
                >
                  Get Started <ArrowRight size={16} />
                </button>
              </div>
              <div className="flex-1">
                <img
                  src="/event_creation_mockup_1771080610927.png"
                  className="w-full h-auto rounded-[2.5rem] shadow-2xl"
                  alt="Create event mockup"
                />

              </div>
            </div>
          )}

          {activeTab === 'Monetize' && (
            <div className="bg-[#fff4f7] rounded-[3.5rem] p-12 lg:p-20 flex flex-col lg:flex-row-reverse items-center gap-16 mb-20 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex-1 space-y-8">
                <div className="w-12 h-12 bg-[#ff3b5c] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-[#ff3b5c] text-xs font-black uppercase tracking-[0.3em] mb-2">Step 2</p>
                  <h3 className="text-3xl font-black text-[#2e2b61] mb-2">Monetize</h3>
                  <p className="text-slate-500 font-medium">Turn your passion into profits</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2e2b61]">Early-Bird Discounts</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Attract more attendees with smart pricing, set up early-bird offers, and exclusive promos to boost your sales.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2e2b61]">Get Paid Quickly</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Receive your earnings directly to your bank account. Transparent settlements, always on time, Zero delays.
                    </p>
                  </div>
                </div>
                <button className="bg-[#ff3b5c] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#ff3b5c]/20">
                  Get Started <ArrowRight size={16} />
                </button>
              </div>
              <div className="flex-1 bg-white rounded-[2rem] p-10 shadow-2xl border border-[#ff3b5c]/10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Event Views</p>
                    <p className="text-2xl font-black text-slate-900">29.7K</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Tickets Sold</p>
                    <p className="text-2xl font-black text-slate-900">754</p>
                  </div>
                </div>
                <div className="mt-6 p-6 bg-[#ff3b5c]/5 border border-[#ff3b5c]/10 rounded-3xl">
                  <p className="text-xs font-black text-[#ff3b5c] uppercase">Live Ticket Interest: 16%</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Repeat' && (
            <div className="bg-[#e8faff] rounded-[3.5rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-16 mb-20 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex-1 space-y-8">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-blue-500 text-xs font-black uppercase tracking-[0.3em] mb-2">Step 3</p>
                  <h3 className="text-3xl font-black text-[#2e2b61] mb-2">Repeat</h3>
                  <p className="text-slate-500 font-medium">Scale your event business</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2e2b61]">Clone with Ease</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      One-click cloning for recurring events. All your settings, tickets, and descriptions stay intact.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2e2b61]">Automated Scaling</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Manage multiple cities and dates from a single dashboard. Scaling has never been this simple.
                    </p>
                  </div>
                </div>
                <button className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
                  Scale Now <ArrowRight size={16} />
                </button>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                  <div className="relative w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center border border-blue-100">
                    <Zap size={80} className="text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Engage' && (
            <div className="bg-[#f0f9ff] rounded-[3.5rem] p-12 lg:p-20 flex flex-col lg:flex-row-reverse items-center gap-16 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-1 space-y-8">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em] mb-2">Step 4</p>
                  <h3 className="text-3xl font-black text-[#2e2b61] mb-2">Engage</h3>
                  <p className="text-slate-500 font-medium">Build a lasting community</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2e2b61]">Attendee Insights</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Understand your audience with detailed demographics and behavioral data.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-[#2e2b61]">Direct Marketing</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Integrated email and SMS tools to keep your fans informed about upcoming experiences.
                    </p>
                  </div>
                </div>
                <button className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                  Engage Fans <ArrowRight size={16} />
                </button>
              </div>
              <div className="flex-1 bg-white rounded-[2rem] p-10 shadow-2xl border border-emerald-500/10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Total Attendees</p>
                      <p className="text-2xl font-black text-emerald-600">12,450</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%]"></div>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Retention Rate: 75%</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Discover Events Section */}
      <section className="bg-white py-24 border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-[#2e2b61] mb-4">Discover Live Events 🚀</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Take a peek at some amazing events using book my ticket</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {liveEvents.map((event, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm group hover:shadow-xl transition-all">
                <div className="aspect-square relative overflow-hidden">
                  <img src={event.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-black/5">
                      <CheckCircle2 size={16} fill="currentColor" className="text-white fill-blue-500" />
                    </div>
                  </div>

                </div>
                <div className="p-6">
                  <h4 className="font-black text-slate-900 text-sm mb-4 truncate">{event.title}</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                      <MapPin size={12} className="text-[#ff3b5c]" /> {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                      <Calendar size={12} className="text-[#ff3b5c]" /> {event.date}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{event.type}</span>
                    <button className="text-[10px] font-black uppercase text-[#ff3b5c] hover:underline">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-[#2e2b61] mb-16">Alliances and Reliance 🤝</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 mb-24">
            {partners.map(p => (
              <div key={p.id} className="bg-white aspect-square rounded-2xl flex items-center justify-center p-4 shadow-sm border border-slate-100 hover:scale-110 transition-transform">
                <img src={p.logo} className="w-full h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 bg-white p-16 rounded-[4rem] shadow-sm border border-slate-100">
            <div className="text-left space-y-4 max-w-md">
              <h3 className="text-2xl font-black text-[#2e2b61]">A Trusted <span className="text-emerald-500">Event Tech Platform</span></h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Your confidence in our event tech platform is paramount. We take your trust seriously, ensuring the security of your events with SSL measures.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Google', val: '4.9/5', color: 'text-blue-500' },
                { label: 'G2 Crowd', val: '4.5/5', color: 'text-red-500' },
                { label: 'Trustpilot', val: '4.5/5', color: 'text-emerald-500' },
                { label: 'Capterra', val: '4.5/5', color: 'text-orange-500' }
              ].map(rating => (
                <div key={rating.label} className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center gap-2 min-w-[120px]">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">{rating.label}</span>
                  <div className="flex text-yellow-400"><Star size={10} fill="currentColor" /></div>
                  <span className="text-sm font-black text-slate-900">{rating.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-[#ffdec9] rounded-[4rem] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Ticket notch styles */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-24 bg-[#fcfaff] rounded-r-full"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 bg-[#fcfaff] rounded-l-full"></div>

          <div className="space-y-8 max-w-xl relative z-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-[#2e2b61]">Get started</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Setting up an account is free. We're here to assist you in getting started! Prefer a demo call with one of our team members? No problem.
            </p>
            <div className="flex flex-col items-center lg:items-start gap-6">
              <button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-[#ff8a5c] to-[#ff2d97] text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-pink-500/30 hover:scale-105 transition-all"
              >
                Become an Organizer
              </button>
              <button className="text-sm font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 hover:underline">
                Book a Demo <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="w-80 h-80 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop"
                className="w-64 h-64 rounded-full object-cover shadow-2xl"
                alt="Organizer graphic"
              />
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h3 className="text-3xl font-black text-[#2e2b61] mb-12">FAQs</h3>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-6 bg-slate-50 rounded-2xl text-left flex justify-between items-center group cursor-pointer hover:bg-white transition-all border border-transparent hover:border-slate-100">
              <p className="font-bold text-slate-700">When can I withdraw my revenue from book my ticket?</p>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeOrganizerPage;
