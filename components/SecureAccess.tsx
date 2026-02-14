import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, ChevronLeft, Mail, UserPlus } from 'lucide-react';

const SecureAccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-[500px] p-12 rounded-[1.5rem] border border-slate-50 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.06)] text-center animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-16 h-16 bg-[#e6fff7] rounded-full flex items-center justify-center text-[#00d09c] mx-auto mb-10 shadow-sm">
          <ShieldCheck size={32} strokeWidth={2.5} />
        </div>

        <h2 className="text-2xl font-black text-[#1e293b] mb-4">Secure Access Only</h2>
        <p className="text-[#64748b] font-medium text-sm leading-relaxed mb-10 max-w-[320px] mx-auto opacity-90">
          This page requires you to be logged in. Please authenticate to continue.
        </p>

        <Link 
          to="/auth" 
          className="text-[#00d09c] text-sm font-black hover:underline block mb-12 flex items-center justify-center gap-2 group"
        >
          <div className="w-6 h-6 bg-[#e6fff7] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <UserPlus size={14} strokeWidth={3} />
          </div>
          Don't have an account? Sign up here
        </Link>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button 
            onClick={() => navigate('/auth')}
            className="flex-1 bg-[#2b2b2b] text-white py-4.5 rounded-[0.8rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
          >
            <LogIn size={18} strokeWidth={2.5} /> Go to Login
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 bg-white border border-slate-100 py-4.5 rounded-[0.8rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 text-slate-500 hover:bg-slate-50 transition-all"
          >
            <ChevronLeft size={18} strokeWidth={2.5} /> Go Back
          </button>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <a 
            href="mailto:support@theticket9.com" 
            className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest flex items-center justify-center gap-2 hover:text-[#1e293b] transition-colors"
          >
            <span className="opacity-70 italic text-[14px]">?</span> Need help? Contact support@theticket9.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default SecureAccess;