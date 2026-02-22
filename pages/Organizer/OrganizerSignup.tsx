import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

const OrganizerSignup: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF006E]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FBB040]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 bg-[#151515] p-10 rounded-[3rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#FF006E] to-[#FB426E] rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_rgba(255,0,110,0.4)] rotate-3 mb-6">
                        <Ticket size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Become an Organizer</h2>
                    <p className="mt-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
                        Join the next generation of event creators
                    </p>
                </div>

                <div className="space-y-6 pt-6">
                    <div className="flex flex-col gap-4">
                        <Link
                            to="/auth?mode=signup&role=ORGANISER"
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-gradient-to-r from-[#FF006E] to-[#FB426E] shadow-[0_0_15px_rgba(255,0,110,0.4)] hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                        >
                            Sign up as Organizer <ArrowRight className="ml-2" size={18} />
                        </Link>

                        <Link
                            to="/auth?role=ORGANISER"
                            className="w-full text-center text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest pt-2"
                        >
                            Already have an account? <span className="text-[#FBB040]">Log in</span>
                        </Link>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                            <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                            <span>Quick KYC & Verified Profile</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                            <Mail size={18} className="text-[#FBB040] shrink-0" />
                            <span>Priority Organizer Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerSignup;
