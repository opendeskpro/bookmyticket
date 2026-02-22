
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserRole, User } from '@/types';
import {
  Eye,
  EyeOff,
  Loader2,
  Smartphone,
  ChevronDown,
  ShieldCheck,
  AlertCircle,
  Key,
  Mail,
  User as UserIcon,
  ShieldAlert,
  ArrowRight,
  Github,
  Chrome,
  Facebook,
  Apple
} from 'lucide-react';
import { api } from '@/lib/api';
import { Logo } from '@/components/Layout';


type AuthStep = 'FORM' | 'OTP_VERIFY';
type LoginMethod = 'EMAIL' | 'OTP';

const AuthPage: React.FC<{ onAuth: (user: User | null) => void }> = ({ onAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(location.state?.isRegistering || false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('EMAIL');
  const [authStep, setAuthStep] = useState<AuthStep>('FORM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  // Extract role from Query Params or Location State
  const queryParams = new URLSearchParams(location.search);
  const roleParam = queryParams.get('role');
  const modeParam = queryParams.get('mode');

  const [role, setRole] = useState<UserRole>(
    (roleParam as UserRole) || (location.state?.role as UserRole) || UserRole.PUBLIC
  );

  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    if (modeParam === 'signup' || location.state?.isRegistering) {
      setIsRegistering(true);
    }
  }, [modeParam, location.state]);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleDemoLogin = (role: UserRole) => {
    setLoading(true);
    setError(null);

    let demoEmail = '';
    let demoName = '';
    let path = '/';

    if (role === UserRole.ADMIN) {
      demoEmail = 'admin@bookmyticket.com';
      demoName = 'Super Admin';
      path = '/admin/dashboard';
    } else if (role === UserRole.ORGANISER) {
      demoEmail = 'demo@organizer.com';
      demoName = 'Professional Organizer';
      path = '/organizer/dashboard';
    } else {
      demoEmail = 'demo@user.com';
      demoName = 'Demo User';
      path = '/';
    }

    setTimeout(() => {
      const user: User = {
        id: `demo-${role.toLowerCase()}-${Date.now()}`,
        email: demoEmail,
        name: demoName,
        role: role,
        walletBalance: 1000
      };

      // Persist demo user for new tabs
      localStorage.setItem('demo_user', JSON.stringify(user));

      onAuth(user);
      navigate(path);
      setLoading(false);
    }, 1000);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setError("Social login is currently disabled in the new backend.");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        await api.auth.register({
          email,
          password,
          full_name: name.trim(),
          role: role
        });
        setError("Registration successful! Please log in.");
        setIsRegistering(false);
      } else {
        const response = await api.auth.login({ email, password });

        if (response.session) {
          localStorage.setItem('token', response.session.access_token);
          const profile = await api.auth.me();
          if (profile) {
            onAuth(profile);
            if (profile.role === UserRole.ADMIN) navigate('/admin/dashboard');
            else if (profile.role === UserRole.ORGANISER) navigate('/organizer/dashboard');
            else navigate(from || '/user/dashboard');
          } else {
            const fallbackUser: User = {
              id: response.user.id,
              email: response.user.email,
              name: response.user.user_metadata?.full_name || 'User',
              role: UserRole.PUBLIC,
              walletBalance: 0
            };
            onAuth(fallbackUser);
            navigate(from || '/');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid authentication attempt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      {/* Auth Header - Logo */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-[1440px] w-[95%] mx-auto flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hidden sm:block">
            Experience Live Events
          </div>
        </div>
      </header>

      {/* Promo Ticker - Global Coupons */}
      <div className="bg-[#F84464] text-white py-2 overflow-hidden whitespace-nowrap relative">
        <div className="flex items-center gap-12 animate-scroll-fast font-bold text-xs uppercase tracking-widest">
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} className="flex items-center gap-2">
              <ShieldCheck size={14} /> USE CODE: <span className="text-[#FFCC00]">BMS50</span> FOR 50% OFF ON FIRST BOOKING! ✨
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 mt-[-40px]">
        <div className="w-full max-w-md bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 reveal">

          {/* Top Promotional Banner Layer (requested: below banner above notation) */}
          <div className="relative h-24 bg-[#333333] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <img src="https://images.unsplash.com/photo-1470229722913-7ea0d11e5922?q=80&w=1000" alt="Banner" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFCC00] mb-1">Limited Time Offer</p>
              <h3 className="text-white text-lg font-black tracking-tight">Enjoy Unlimited Entertainment</h3>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="text-center relative">
              <h2 className="text-xl font-black text-[#333333]">Get Started</h2>

              {/* Close button fake */}
              <button onClick={() => navigate('/')} className="absolute right-0 top-0 text-gray-400 hover:text-black transition-all">
                <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">✕</div>
              </button>
            </div>

            {/* Social Logins - BMS Style Vertical Stack */}
            <div className="space-y-3">
              <button onClick={() => handleSocialLogin('google')} className="w-full flex items-center justify-center gap-4 py-3 px-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-all font-bold text-gray-600 text-sm">
                <Chrome size={20} className="text-[#4285F4]" />
                Continue with Google
              </button>
              <button disabled className="w-full flex items-center justify-center gap-4 py-3 px-4 border border-gray-200 rounded-md opacity-50 cursor-not-allowed font-bold text-gray-400 text-sm">
                <Apple size={20} className="text-black" />
                Continue with Apple
              </button>
              <button disabled className="w-full flex items-center justify-center gap-4 py-3 px-4 border border-gray-200 rounded-md opacity-50 cursor-not-allowed font-bold text-gray-400 text-sm">
                <Facebook size={20} className="text-[#1877F2]" />
                Continue with Facebook
              </button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-4 text-gray-400">OR</span></div>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-[#F84464] rounded-md text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <div className="space-y-4">
                {isRegistering && (
                  <input
                    type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded bg-transparent border border-gray-200 focus:border-[#F84464] outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                )}
                <input
                  type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded bg-transparent border border-gray-200 focus:border-[#F84464] outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400 text-sm"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded bg-transparent border border-gray-200 focus:border-[#F84464] outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400 text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-[#F84464] text-white rounded-md font-bold text-sm hover:bg-[#d63a56] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isRegistering ? 'Register' : 'Login')}
              </button>

              <div className="text-center">
                <button onClick={() => setIsRegistering(!isRegistering)} type="button" className="text-xs font-bold text-gray-500 hover:text-[#F84464] transition-colors">
                  {isRegistering ? 'Already have an account? Login' : "Don't have an account? Create one"}
                </button>
              </div>
            </form>

            <div className="text-[10px] text-center text-gray-400 leading-relaxed font-medium">
              I agree to the <span className="underline cursor-pointer">Terms & Conditions</span> & <span className="underline cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>

        {/* Floating Dev Toggle (Corner) */}
        <div className="fixed bottom-8 right-8 flex items-center gap-3 bg-white p-2 rounded-full shadow-lg border border-gray-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-3">Dev Mode</span>
          <button
            onClick={() => setIsSimulationMode(!isSimulationMode)}
            className={`w-10 h-6 rounded-full transition-all relative ${isSimulationMode ? 'bg-[#F84464]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isSimulationMode ? 'left-5' : 'left-1'}`} />
          </button>
        </div>

        {isSimulationMode && (
          <div className="fixed bottom-24 right-8 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <ShieldAlert size={14} className="text-[#F84464]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#333333]">Simulation Login</span>
            </div>
            <div className="space-y-2">
              <button onClick={() => handleDemoLogin(UserRole.ADMIN)} className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-bold uppercase transition-all">Super Admin</button>
              <button onClick={() => handleDemoLogin(UserRole.ORGANISER)} className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-bold uppercase transition-all">Organizer</button>
              <button onClick={() => handleDemoLogin(UserRole.PUBLIC)} className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-bold uppercase transition-all">Public User</button>
            </div>
          </div>
        )}
      </div>

      <footer className="py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} bookmyticket • all rights reserved
      </footer>
    </div>
  );
};

export default AuthPage;
