import React from 'react';
import { X, ChevronRight, User as UserIcon, Calendar, Ticket, Tag, LayoutDashboard, Smartphone, HelpCircle, Lock, Plus } from 'lucide-react';
import { User } from '../types.ts';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../contexts/SiteConfigContext';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, user }) => {
    const { config } = useSiteConfig();
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#111111] z-[1001] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FF006E] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,110,0.5)]">
                                <Ticket className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-black text-white">ticket<span className="text-[#FF006E]">9</span></span>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {/* User Section */}
                        <div className="p-6">
                            {!user ? (
                                <div className="bg-[#151515] rounded-[1.5rem] p-6 flex flex-col items-center text-center space-y-4 border border-white/5 shadow-xl">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-400 shadow-sm border border-white/10">
                                        <UserIcon size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-[16px] text-white">Hey Champ! 👋 Ready to explore?</h3>
                                        <p className="text-[13px] text-gray-400 font-medium">Log in to unlock exclusive updates and perks.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#151515] rounded-[1.5rem] p-6 flex items-center gap-4 border border-white/5 shadow-xl">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF006E] to-[#FBB040] text-white flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(255,0,110,0.5)]">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-extrabold text-[16px] text-white">{user.name}</h3>
                                        <p className="text-[12px] text-[#FBB040] font-bold uppercase tracking-widest">{user.role}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Links */}
                        <div className="px-4 space-y-1">
                            {[
                                { icon: <Plus className="text-[#FBB040]" />, label: 'Create RSVP', badge: 'NEW', locked: !user },
                                { icon: <Ticket className="text-[#00C6FF]" />, label: 'My Bookings', locked: !user },
                                { icon: <Tag className="text-[#FF006E]" />, label: 'My Coupons', locked: !user },
                                { icon: <Calendar className="text-[#B92B27]" />, label: 'Event Calendar', locked: !user },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group ${item.locked ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <span className="font-bold text-[14px] text-gray-200 group-hover:text-white">{item.label}</span>
                                        {item.badge && <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FBB040] to-[#FF006E] text-white text-[10px] font-black drop-shadow-md shadow-[0_0_10px_rgba(251,176,64,0.5)]">{item.badge}</span>}
                                    </div>
                                    {item.locked ? <Lock size={14} className="text-gray-500" /> : <ChevronRight size={18} className="text-gray-500 group-hover:text-white" />}
                                </div>
                            ))}
                        </div>

                        {/* Explore Section */}
                        <div className="p-6 space-y-4">
                            <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Explore</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Events', icon: '🎟️', color: 'bg-[#151515] hover:border-[#FF006E]/30', link: '/#events' },
                                    { label: 'Brands', icon: '🎭', color: 'bg-[#151515] hover:border-[#FBB040]/30', link: '/brands' },
                                    { label: 'Creators', icon: '📸', color: 'bg-[#151515] hover:border-[#00C6FF]/30', link: '/creators' },
                                    { label: 'Coupons', icon: '🎫', color: 'bg-[#151515] hover:border-[#B92B27]/30', link: '/coupons' },
                                    ...(config.enable_movies_page !== false ? [{ label: 'Movies', icon: '🎬', color: 'bg-[#151515] hover:border-blue-500/30', link: '/movies' }] : []),
                                ].map((item, i) => (
                                    <Link to={item.link || '#'} key={i} onClick={onClose} className={`p-4 rounded-2xl border border-white/5 space-y-3 cursor-pointer hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all ${item.color}`}>
                                        <span className="text-2xl drop-shadow-md">{item.icon}</span>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[13px] text-gray-300 hover:text-white">{item.label}</span>
                                            <ChevronRight size={14} className="text-gray-500" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* More Section */}
                        <div className="px-4 pb-12 space-y-1">
                            <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-[0.2em] p-2">More</h4>
                            {[
                                { icon: <Smartphone size={18} />, label: 'Get the App' },
                                { icon: <LayoutDashboard size={18} />, label: 'Become an organizer', link: '/#organizer-request' },
                                { icon: <HelpCircle size={18} />, label: 'Help & Support' },
                            ].map((item, i) => (
                                <Link
                                    to={item.link || '#'}
                                    key={i}
                                    onClick={() => {
                                        onClose();
                                        if (item.label === 'Become an organizer') {
                                            // Trigger is handled by URL hash or redirect
                                        }
                                    }}
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-gray-500 group-hover:text-[#FBB040] transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="font-bold text-[14px] text-gray-300 group-hover:text-white">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-500 group-hover:text-[#FBB040]" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Login Bottom Button */}
                    {!user && (
                        <div className="p-6 bg-[#111111] border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                            <Link to="/auth" onClick={onClose} className="w-full py-4 bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white rounded-full font-black text-[15px] flex items-center justify-center gap-3 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,0,110,0.5)] transition-all">
                                <ChevronRight size={18} /> Login to your account
                            </Link>
                            <p className="text-center mt-4 text-[12px] font-medium text-gray-400">
                                Don't have an account? <Link to="/auth" className="text-[#FBB040] font-bold hover:underline drop-shadow-[0_0_5px_rgba(251,176,64,0.3)]">Create one now</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SideMenu;
