import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Settings,
    BarChart3,
    Repeat,
    Share2,
    CheckCircle2,
    MapPin,
    Calendar,
    Star,
    Users,
    ShieldCheck,
    Zap,
    Ticket
} from 'lucide-react';

const BecomeOrganizerPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    // Auto-rotate tabs every 5 seconds if interaction hasn't happened recently
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            id: 'create',
            step: 'STEP 1',
            title: 'Create',
            subtitle: 'Publish In Minutes',
            color: 'bg-[#00C6FF]/10 text-[#00C6FF]',
            icon: Settings,
            content: [
                { title: 'Events with Ease', text: 'Plan and publish your event in just a few steps, be it single-day, multi-day, seated, recurring, or online.' },
                { title: 'Clone Past Events with a Click', text: 'Save time and effort by duplicating your previous events. With just a few clicks, you can clone, tweak, and publish.' }
            ],
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'monetize',
            step: 'STEP 2',
            title: 'Monetize',
            subtitle: 'Turn your passion into profits',
            color: 'bg-[#FBB040]/10 text-[#FBB040]',
            icon: Zap,
            content: [
                { title: 'Early-Bird Discounts, Coupons & Group Ticketing', text: 'Attract more attendees with smart pricing, set up early-bird offers, and exclusive promos to boost your sales and reach.' },
                { title: 'Get Paid Quickly & Securely', text: 'Receive your earnings directly to your bank account. Transparent settlements, always on time, Zero delays.' }
            ],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'repeat',
            step: 'STEP 3',
            title: 'Repeat & Grow',
            subtitle: 'Scale your success',
            color: 'bg-[#FF006E]/10 text-[#FF006E]',
            icon: Repeat,
            content: [
                { title: 'Actionable Analytics', text: 'Track performance with real-time insights on ticket sales, audience behavior, and more.' },
                { title: 'Unmatched Organizer Support', text: 'From setup to scaling, our dedicated team is here to guide you every step of the way.' }
            ],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: 'engage',
            step: 'STEP 4',
            title: 'Launch & Engage',
            subtitle: 'Deliver memorable experiences.',
            color: 'bg-[#7209B7]/10 text-[#7209B7]',
            icon: Share2,
            content: [
                { title: 'Connect with Your Attendees', text: 'Build lasting impressions by interacting with your attendees through announcements and smart reminders.' },
                { title: 'QR Scanning', text: 'Seamlessly manage check-ins with smart QR code scanning. Speed up entry, contactless experience for everyone.' }
            ],
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000'
        }
    ];

    const dummyEvents = [
        { title: "Thalapathy Katcheri DJ Night", date: "Jan 10, 2026", location: "Bengaluru", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600", paid: true },
        { title: "Holi Utsav '26", date: "Mar 01, 2026", location: "Trichy", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600", paid: true },
        { title: "Power Of Wealth 2026", date: "Jan 31, 2026", location: "Chennai", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600", paid: false },
        { title: "Tour Breathless", date: "Mar 13, 2026", location: "Chennai", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=600", paid: true },
        { title: "The Breakup", date: "Feb 07, 2026", location: "Hosur", image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=600", paid: true }
    ];

    const topBrands = [
        { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
        { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
        { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
        { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
        { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
        { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
        { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" }
    ];

    const bottomBrands = [
        { name: "YourStory", logo: "https://images.seeklogo.com/logo-png/33/2/yourstory-logo-png_seeklogo-331627.png" },
        { name: "Radio City", logo: "https://upload.wikimedia.org/wikipedia/en/e/e0/Radio_City_Logo_New.jpg" },
        { name: "Behindwoods", logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/Behindwoods_Logo.png" },
        { name: "Galatta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/77/Galatta_Media_Logo.png" },
        { name: "PVR", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/PVR_Cinemas_logo.svg" },
        { name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
        { name: "BookMyShow", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Bookmyshow-logo-vector.svg/2560px-Bookmyshow-logo-vector.svg.png" }
    ];

    return (
        <div className="bg-[#0B0B0B] min-h-screen font-sans text-white">

            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF006E]/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FBB040]/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div className="space-y-8 z-10">
                        <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#FBB040] shadow-inner mb-2">
                            ORGANIZER ECOSYSTEM 🚀
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black leading-[1.1] tracking-tighter text-white drop-shadow-md">
                            Where Next-Gen <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FBB040]">Events Begin</span>
                        </h1>
                        <p className="text-lg text-gray-400 leading-relaxed max-w-lg font-medium">
                            Host your next event with an all-in-one event platform.
                            Whether you're just starting out or organizing your biggest event yet, we ensure a seamless, stress-free experience every step of the way.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                            <div className="flex flex-col gap-4">
                                <Link to="/auth?mode=signup&role=ORGANISER" className="px-10 py-4 bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(255,0,110,0.5)] hover:shadow-[0_0_40px_rgba(255,0,110,0.7)] hover:scale-[1.05] transition-all text-center">
                                    Create Event Now
                                </Link>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                    Get Started in 2 easy steps: <span className="text-[#FF006E]">/ Signup</span> <span className="text-[#FBB040]">/ KYC</span>
                                </p>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-8 pt-10 opacity-60 hover:opacity-100 transition-all duration-500">
                            <div className="flex flex-col border-r border-white/10 pr-8">
                                <div className="text-white font-black text-2xl tracking-tighter">4.9/5</div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Google Rating</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-white font-black text-2xl tracking-tighter">99.9%</div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Client Satisfaction</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="relative z-10 flex justify-center lg:justify-end">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E] to-[#FBB040] rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                            <img
                                src="https://illustrations.popsy.co/white/party.svg"
                                alt="Band Performing"
                                className="w-full max-w-xl object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 invert brightness-200"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TABBED STEP SECTION */}
            <section className="py-24 bg-[#0B0B0B]">
                <div className="max-w-[1200px] mx-auto px-6">

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveTab(index)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === index
                                    ? 'bg-[#151515] shadow-[0_10px_30px_rgba(0,0,0,1)] border border-white/10 text-white scale-105'
                                    : 'bg-transparent text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${activeTab === index ? 'scale-110' : 'grayscale'} ${index === 0 ? 'bg-blue-500/20 text-blue-400' : index === 1 ? 'bg-orange-500/20 text-orange-400' : index === 2 ? 'bg-pink-500/20 text-pink-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                    {index === 0 && <Settings size={14} />}
                                    {index === 1 && <Zap size={14} />}
                                    {index === 2 && <Repeat size={14} />}
                                    {index === 3 && <Share2 size={14} />}
                                </span>
                                {step.title}
                            </button>
                        ))}
                    </div>

                    {/* Content Card */}
                    <div className="bg-[#151515] rounded-[2.5rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-white/5 transition-all duration-700 group">
                        <div className="grid grid-cols-1 lg:grid-cols-2">

                            {/* Text Content */}
                            <div className="p-12 lg:p-20 flex flex-col justify-center space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF006E]/40 to-transparent"></div>

                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block w-fit ${steps[activeTab].color} border border-white/5 shadow-inner`}>
                                    {steps[activeTab].step}
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">{steps[activeTab].title}</h2>
                                    <p className="text-xl text-gray-400 font-medium italic">"{steps[activeTab].subtitle}"</p>
                                </div>

                                <div className="space-y-8 pt-4">
                                    {steps[activeTab].content.map((item, idx) => (
                                        <div key={idx} className="space-y-3 group/item">
                                            <h3 className="font-extrabold text-xl text-white group-hover/item:text-[#FBB040] transition-colors flex items-center gap-3">
                                                <div className="w-1.5 h-6 bg-[#FF006E] rounded-full"></div>
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed text-sm font-medium pl-4 border-l border-white/5">{item.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className={`mt-10 px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest text-white transition-all w-fit shadow-2xl hover:scale-105 active:scale-95 ${activeTab === 0 ? 'bg-blue-600 shadow-blue-600/20' :
                                    activeTab === 1 ? 'bg-orange-600 shadow-orange-600/20' :
                                        activeTab === 2 ? 'bg-[#FF006E] shadow-[#FF006E]/20' :
                                            'bg-purple-600 shadow-purple-600/20'
                                    }`}>
                                    Get Started <ArrowRight size={16} className="inline ml-2" />
                                </button>
                            </div>

                            {/* Visual/Image Content */}
                            <div className="relative min-h-[500px] lg:min-h-full bg-black/40 p-8 lg:p-16 flex items-center justify-center border-l border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E]/5 to-transparent"></div>
                                <div className="relative w-full max-w-sm aspect-[4/5] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,1)] border-[10px] border-[#222] overflow-hidden bg-[#111] mx-auto group-hover:rotate-1 transition-transform duration-700">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/12 h-6 bg-[#222] rounded-b-2xl z-20"></div>
                                    <img
                                        src={steps[activeTab].image}
                                        alt={steps[activeTab].title}
                                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* 3. EVENT CAROUSEL */}
            <section className="py-24 bg-transparent border-t border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="h-12 w-1.5 bg-[#FF006E] rounded-full shadow-[0_0_15px_rgba(255,0,110,0.5)]"></div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Discover Live Events 🚀</h2>
                            <p className="text-gray-500 font-bold uppercase text-[11px] tracking-widest mt-1">Take a peek at some amazing events using BookMyTicket</p>
                        </div>
                    </div>

                    <div className="flex gap-8 overflow-x-auto pb-12 snap-x scrollbar-hide px-2 pt-4">
                        {dummyEvents.map((event, i) => (
                            <div key={i} className="min-w-[300px] md:min-w-[340px] snap-center group bg-[#151515] rounded-[2.5rem] p-4 shadow-2xl border border-white/5 hover:border-[#FBB040]/30 transition-all duration-700 cursor-pointer hover:-translate-y-4 hover:rotate-1">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 relative border border-white/10 shadow-inner">
                                    <img src={event.image} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1s]" alt={event.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
                                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#FBB040] border border-[#FBB040]/30 uppercase tracking-widest">
                                        {event.paid ? 'Paid' : 'Free'}
                                    </div>
                                </div>
                                <div className="space-y-4 px-2 pb-2">
                                    <h3 className="font-black text-xl text-white leading-tight line-clamp-2 min-h-[50px] group-hover:text-[#FBB040] transition-colors">{event.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        <MapPin size={14} className="text-[#FF006E]" /> {event.location}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            <Calendar size={14} className="text-[#FBB040]" /> {event.date}
                                        </div>
                                        <div className="text-[#FF006E] font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">Book Now →</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. TRUSTED BY MARQUEE SECTION */}
            <section className="py-32 bg-[#0B0B0B] overflow-hidden space-y-24 border-t border-white/5">

                {/* Row 1: Left to Right */}
                <div className="space-y-12">
                    <div className="text-center space-y-3 px-6">
                        <div className="inline-block px-4 py-1 bg-[#151515] rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 border border-white/5 mb-2">POWERED BY EXCELLENCE</div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Our Event Organizers</h3>
                        <p className="text-gray-500 font-medium text-lg italic">"Trusted by the world's most innovative event creators"</p>
                    </div>

                    <div className="relative w-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B0B0B] to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B0B0B] to-transparent z-10"></div>
                        <div className="flex w-max animate-scroll-left gap-10 py-4 px-10">
                            {[...topBrands, ...topBrands].map((brand, i) => (
                                <div key={i} className="flex-shrink-0 w-56 h-28 bg-[#151515] border border-white/5 rounded-[2rem] flex items-center justify-center p-8 shadow-2xl hover:border-[#FF006E]/30 transition-all duration-500 group">
                                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain grayscale brightness-50 contrast-125 opacity-40 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 transition-all duration-500 invert" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vertical CTA */}
                <div className="max-w-[800px] mx-auto text-center px-6 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-[#FF006E]/10 rounded-full blur-[120px] -z-10"></div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter">Ready to launch your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBB040] to-[#FF006E]">next big experience?</span></h2>
                    <Link to="/auth?mode=signup&role=ORGANISER" className="inline-flex h-16 items-center justify-center rounded-2xl bg-white text-black px-12 text-sm font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all">
                        Get Started Now
                    </Link>
                </div>

                <style>{`
                  @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  @keyframes scroll-right {
                     0% { transform: translateX(-50%); }
                     100% { transform: translateX(0); }
                  }
                  .animate-scroll-left {
                    animation: scroll-left 50s linear infinite;
                  }
                  .animate-scroll-right {
                    animation: scroll-right 50s linear infinite;
                  }
                `}</style>
            </section>

        </div>
    );
};

export default BecomeOrganizerPage;
