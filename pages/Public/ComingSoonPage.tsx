import React, { useState } from 'react';
import { Target, Bell, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoonPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail('');
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex flex-col relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F84464]/10 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00B9F1]/10 rounded-full blur-[150px] -ml-64 -mb-64 pointer-events-none"></div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-20">
                <div className="max-w-4xl w-full mx-auto text-center space-y-12">

                    {/* Top Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm animate-fade-in-up">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F84464] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F84464]"></span>
                        </span>
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">New Feature</span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F84464] to-[#ff7a93] flex items-center justify-center shadow-[0_0_40px_rgba(248,68,100,0.4)] rotate-12 hover:-rotate-12 transition-transform duration-500">
                                <Target size={40} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-md">
                            Meeting Now <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B9F1] to-[#F84464]">Coming Soon.</span>
                        </h1>
                        <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            We're building a groundbreaking new way to discover and join impromptu events, meetups, and live gatherings happening right now in your city.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
                        {[
                            { icon: <Zap size={24} />, title: 'Instant Discovery', desc: 'Find live events happening right this second.' },
                            { icon: <Users size={24} />, title: 'Connect Instantly', desc: 'Join like-minded people with one tap.' },
                            { icon: <ShieldCheck size={24} />, title: 'Safe & Verified', desc: 'Real-time location matching safely curated.' }
                        ].map((feat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors backdrop-blur-md">
                                <div className="w-12 h-12 rounded-xl bg-[#F84464]/20 flex items-center justify-center text-[#F84464] mb-4 mx-auto md:mx-0">
                                    {feat.icon}
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2 text-center md:text-left">{feat.title}</h3>
                                <p className="text-gray-400 text-sm font-medium text-center md:text-left">{feat.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Waitlist Form */}
                    <div className="pt-12 max-w-md mx-auto w-full">
                        {submitted ? (
                            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3">
                                <Bell size={20} />
                                You're on the list! We'll notify you.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#F84464] to-[#00B9F1] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-black rounded-full flex items-center p-2 border border-white/10">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email for early access..."
                                        className="flex-1 bg-transparent px-6 py-3 text-white placeholder:text-gray-500 outline-none font-medium text-sm"
                                    />
                                    <button type="submit" className="bg-[#F84464] hover:bg-[#D93654] text-white px-6 py-3 rounded-full font-bold text-sm transition-colors flex items-center gap-2">
                                        Notify Me <ArrowRight size={16} />
                                    </button>
                                </div>
                            </form>
                        )}
                        <p className="text-gray-500 text-xs font-medium mt-4 uppercase tracking-widest">
                            Be the first to know when we launch.
                        </p>
                    </div>

                    <div className="pt-12">
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2 group">
                            <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ComingSoonPage;
