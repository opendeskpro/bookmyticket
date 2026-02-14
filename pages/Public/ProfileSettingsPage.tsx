
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Added ShieldCheck to the imports from lucide-react
import { ChevronLeft, Users, ArrowRight, Camera, Mail, Phone, User as UserIcon, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { User } from '../../types';
import { upsertProfile } from '../../lib/supabase';



interface ProfileSettingsPageProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await upsertProfile(user.id, user.email, name);
      onUpdate({ name });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-inter">
      <div className="max-w-[1000px] mx-auto px-8 py-16">

        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-[#ff5a5f] text-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-100 hover:scale-105 transition-all active:scale-95"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <h1 className="text-[24px] font-black text-slate-800 tracking-tight">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Quick Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-[#ff5a00] rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-xl">
                  {name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>
              <h2 className="text-xl font-black text-slate-900">{name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{user.role}</p>
            </div>

            <div className="bg-[#1e1e2d] rounded-[2.5rem] p-10 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-[80px] opacity-10"></div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" /> Account Trust
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Your account is secured with multi-factor authentication. Verified users receive faster payouts and exclusive event access.
              </p>
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
                <UserIcon className="text-[#ff5a5f]" /> Profile Information
              </h3>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      className="w-full bg-[#f8fafc] border border-transparent focus:border-amber-500 focus:bg-white rounded-2xl pl-14 pr-6 py-4 font-bold text-slate-900 outline-none transition-all"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                    <input
                      type="email" readOnly
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 font-bold text-slate-300 outline-none cursor-not-allowed"
                      value={user.email}
                    />
                  </div>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight italic">Email cannot be changed for security reasons.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="tel"
                      className="w-full bg-[#f8fafc] rounded-2xl pl-14 pr-6 py-4 font-bold text-slate-900 outline-none"
                      placeholder="+91 XXXXX XXXXX"
                      defaultValue={user.mobile}
                    />
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  {saveSuccess ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-left-2">
                      <CheckCircle2 size={18} /> Changes saved successfully
                    </div>
                  ) : <div></div>}

                  <button
                    onClick={handleSave}
                    disabled={isSaving || !name.trim()}
                    className="bg-slate-950 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Organizer Verification</h4>
                  <p className="text-xs text-slate-400 font-medium">Elevate your account to host ticketed events</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/become-organizer')}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff5a5f] hover:underline"
              >
                Start KYC <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
