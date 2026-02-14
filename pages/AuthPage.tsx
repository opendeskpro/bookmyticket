
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserRole, User } from '../types';
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
import { supabase, signInWithSocial } from '../lib/supabase';
import { Logo } from '../components/Layout';


type AuthStep = 'FORM' | 'OTP_VERIFY';
type LoginMethod = 'EMAIL' | 'OTP';

const AuthPage: React.FC<{ onAuth: (user: User | null) => void }> = ({ onAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
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

  const from = location.state?.from?.pathname || null;

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
      path = '/organiser/dashboard';
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
      onAuth(user);
      navigate(path);
      setLoading(false);
    }, 1000);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    setError(null);
    try {
      await signInWithSocial(provider);
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}: ${err.message}`);
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isRegistering) {
        // Mock credentials check
        if (email === 'admin@bookmyticket.com' && password === 'admin123') {
          handleDemoLogin(UserRole.ADMIN);
          return;
        }
        if (email === 'demo@organizer.com' && password === 'password123') {
          handleDemoLogin(UserRole.ORGANISER);
          return;
        }
        if (email === 'demo@user.com' && password === 'password123') {
          handleDemoLogin(UserRole.PUBLIC);
          return;
        }
      }

      if (loginMethod === 'OTP') {
        const phone = mobile.startsWith('+') ? mobile : `+91${mobile}`;
        const { error: otpError } = await supabase.auth.signInWithOtp({
          phone: phone,
          options: {
            data: { name: name.trim() || 'User', role: UserRole.PUBLIC }
          }
        });
        if (otpError) {
          setIsSimulationMode(true);
          setAuthStep('OTP_VERIFY');
          setResendTimer(30);
          return;
        }
        setAuthStep('OTP_VERIFY');

      } else {
        if (isRegistering) {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name: name.trim(), role: UserRole.PUBLIC }
            }
          });
          if (signUpError) throw signUpError;
          setError("Check your email for confirmation!");
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) throw signInError;

          if (data.user) {
            const meta = data.user.user_metadata || {};
            const fullName = meta.name || meta.full_name || 'User';
            const role = meta.role || UserRole.PUBLIC;

            onAuth({
              id: data.user.id,
              name: fullName,
              email: data.user.email || '',
              role: role,
              walletBalance: 0
            });

            if (role === UserRole.ADMIN) navigate('/admin/dashboard');
            else if (role === UserRole.ORGANISER) navigate('/organiser/dashboard');
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

  const verifyMobileOtp = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      if (isSimulationMode || token === '123456') {
        const finalName = name.trim() || 'Guest User';
        onAuth({
          id: 'demo-' + Date.now(),
          name: finalName,
          email: email || `${mobile}@mobile.com`,
          role: UserRole.PUBLIC,
          walletBalance: 0
        });
        navigate(from || '/');
      } else {
        const phone = mobile.startsWith('+') ? mobile : `+91${mobile}`;
        const { data, error: verifyError } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
        if (verifyError) throw verifyError;
        if (data.user) {
          const meta = data.user.user_metadata || {};
          onAuth({
            id: data.user.id,
            name: meta.name || meta.full_name || name.trim() || 'User',
            email: data.user.email || email || `${mobile}@mobile.com`,
            role: meta.role || UserRole.PUBLIC,
            walletBalance: 0
          });
          navigate(from || '/');
        }
      }


    } catch (err: any) {
      setError("Invalid code. Use '123456' for testing.");
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-inter overflow-hidden">
      {/* LEFT SIDE: Brand Sidebar (Split design 30%) */}
      <div className="hidden lg:flex w-[30%] bg-gradient-to-b from-[#7209B7] to-[#FF006E] relative flex-col px-12 py-20 shrink-0 overflow-hidden">
        {/* Abstract background circles */}
        <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col h-full">
          <Link to="/" className="inline-block transform hover:scale-105 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck size={24} className="text-[#FF006E]" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">TICKET9</span>
            </div>
          </Link>

          <div className="mt-24 space-y-6">
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight uppercase">
              GROW YOUR EVENTS <br />
              <span className="text-white/70 italic">EXPONENTIALLY.</span>
            </h2>
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-xs">
              Join the ecosystem of over 200,000+ event lovers across the nation. Experience the future of event management.
            </p>
          </div>

          <div className="mt-16 space-y-8">
            {[
              { id: '01', title: 'CREATE EVENT PAGE', desc: 'DO-IT-YOURSELF APPROACH' },
              { id: '02', title: 'EASY SIGN-UP', desc: 'SUPER QUICK ACTIVATION' },
              { id: '03', title: 'SIMPLE REGISTRATION', desc: 'NO HASSLE' },
              { id: '04', title: 'QUICK SETUP', desc: 'ZERO SETUP COST' }
            ].map((f) => (
              <div key={f.id} className="flex gap-4 group">
                <span className="text-xl font-black text-white/30 group-hover:text-white transition-colors duration-500">{f.id}</span>
                <div>
                  <h4 className="text-xs font-black text-white tracking-widest uppercase">{f.title}</h4>
                  <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto opacity-30">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} TICKET9 GLOBAL
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form (Split design 70%) */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center py-12 px-6 lg:px-20 relative overflow-y-auto">
        <div className="w-full max-w-md">
          {authStep === 'FORM' ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                  GOOD TO SEE YOU<br />
                  <span className="text-[#FF5862] italic">AGAIN 👋</span>
                </h1>
                <p className="text-slate-500 text-sm font-bold mt-4">
                  {isRegistering ? (
                    <>Already a member? <button onClick={() => setIsRegistering(false)} className="text-[#FF5862] hover:underline font-black">Sign in</button></>
                  ) : (
                    <>Don't have an account? <button onClick={() => setIsRegistering(true)} className="text-[#FF5862] hover:underline font-black">Create one now</button></>
                  )}
                </p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm flex items-center gap-3 animate-in shake-in">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-6">
                {isRegistering && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Full Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF5862] transition-colors" size={18} />
                      <input
                        type="text" required value={name} onChange={e => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#FF5862]/40 focus:ring-4 focus:ring-[#FF5862]/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>
                )}

                {loginMethod === 'EMAIL' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF5862] transition-colors" size={18} />
                        <input
                          type="email" required value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#FF5862]/40 focus:ring-4 focus:ring-[#FF5862]/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Password</label>
                        {!isRegistering && <button type="button" className="text-[11px] font-black text-[#FF5862] hover:underline uppercase tracking-tight transition-colors">Forgot password?</button>}
                      </div>
                      <div className="relative group">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF5862] transition-colors" size={18} />
                        <input
                          type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#FF5862]/40 focus:ring-4 focus:ring-[#FF5862]/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Mobile Number</label>
                    <div className="relative flex group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-[#FF5862] transition-colors tracking-tighter text-sm">+91</span>
                      <input
                        type="tel" required maxLength={10} value={mobile} onChange={e => setMobile(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#FF5862]/40 focus:ring-4 focus:ring-[#FF5862]/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-6 text-center">
                  <button type="submit" disabled={loading} className="w-full py-4 bg-[#FF5862] text-white rounded-xl font-black uppercase text-[12px] tracking-[0.2em] shadow-lg shadow-[#FF5862]/20 hover:bg-[#ff404a] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        {isRegistering ? 'LET\'S GO' : 'LOG IN'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]"><span className="bg-white px-4 text-slate-300">OR</span></div>
                  </div>

                  <button
                    onClick={() => handleSocialLogin('google')}
                    disabled={loading}
                    type="button"
                    className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-slate-200 rounded-xl font-bold text-[13px] text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Chrome size={18} className="text-[#4285F4]" />
                    Continue with Google
                  </button>
                </div>
              </form>


            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-emerald-100">
                <ShieldCheck size={32} />
              </div>

              <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">VERIFY IDENTITY</h1>
              <p className="text-slate-400 text-xs mb-10 font-bold uppercase tracking-widest leading-relaxed">
                We sent a code to <span className="text-slate-900">{mobile}</span>. <br />
                <span className="text-[9px] opacity-70 block mt-2 font-black text-[#FF5862]">USE 123456 FOR TEST ACCESS</span>
              </p>

              <div className="flex justify-center gap-3 mb-10">
                {otp.map((digit, i) => (
                  <input
                    key={i} id={`otp-${i}`} type="text" maxLength={1}
                    className="w-12 h-16 bg-slate-50 border border-slate-100 focus:border-[#FF5862]/40 focus:bg-white rounded-xl text-center text-2xl font-black text-slate-900 outline-none transition-all shadow-sm"
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && !/^\d+$/.test(val)) return;
                      const newOtp = [...otp];
                      newOtp[i] = val.substring(val.length - 1);
                      setOtp(newOtp);
                      if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
                      if (newOtp.every(d => d)) verifyMobileOtp(newOtp.join(''));
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => verifyMobileOtp(otp.join(''))}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Complete Verification
              </button>

              <button onClick={() => setAuthStep('FORM')} className="mt-8 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-[#FF5862] transition-colors">
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default AuthPage;
