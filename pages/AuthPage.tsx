
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
  ArrowRight
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


  const handleSocialLogin = async (provider: string) => {
    setError("Social login is disabled. Please use email and password.");
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
            const isAdmin = response.user.email === 'v.raja2mail@gmail.com';
            const fallbackUser: User = {
              id: response.user.id,
              email: response.user.email || '',
              name: response.user.user_metadata?.full_name || (isAdmin ? 'Admin' : 'User'),
              role: isAdmin ? UserRole.ADMIN : UserRole.PUBLIC,
              walletBalance: 0
            };
            onAuth(fallbackUser);
            if (isAdmin) navigate('/admin/dashboard');
            else navigate(from || '/');
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

      {/* Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-6">
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

            {/* Email/Password Login */}
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

      </div>

      <footer className="py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} bookmyticket • all rights reserved
      </footer>
    </div>
  );
};

export default AuthPage;
