import React from 'react';
import { X, ChevronRight, User as UserIcon, Calendar, Ticket, Tag, LayoutDashboard, Smartphone, HelpCircle, Lock, Plus } from 'lucide-react';
import { User } from '../types.ts';
import { Link } from 'react-router-dom';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, user }) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[1001] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-black/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#ff5862] flex items-center justify-center">
                                <Ticket className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-black text-[#484848]">ticket<span className="text-[#ff5862]">9</span></span>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#f9fafb] flex items-center justify-center text-[#767676] hover:text-[#ff5862] transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {/* User Section */}
                        <div className="p-6">
                            {!user ? (
                                <div className="bg-[#f9fafb] rounded-[2rem] p-6 flex flex-col items-center text-center space-y-4 border border-black/5">
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#767676] shadow-sm">
                                        <UserIcon size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-[16px] text-[#484848]">Hey Champ! 👋 Ready to explore?</h3>
                                        <p className="text-[13px] text-[#767676] font-medium">Log in to unlock exclusive updates and perks.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#f9fafb] rounded-[2rem] p-6 flex items-center gap-4 border border-black/5">
                                    <div className="w-14 h-14 rounded-full bg-[#ff5862] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#ff5862]/20">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[16px] text-[#484848]">{user.name}</h3>
                                        <p className="text-[12px] text-[#767676] font-medium uppercase tracking-widest">{user.role}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Links */}
                        <div className="px-4 space-y-1">
                            {[
                                { icon: <Plus className="text-green-500" />, label: 'Create RSVP', badge: 'NEW', locked: !user },
                                { icon: <Ticket className="text-blue-500" />, label: 'My Bookings', locked: !user },
                                { icon: <Tag className="text-orange-500" />, label: 'My Coupons', locked: !user },
                                { icon: <Calendar className="text-purple-500" />, label: 'Event Calendar', locked: !user },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl hover:bg-[#f9fafb] transition-all cursor-pointer group ${item.locked ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <span className="font-bold text-[14px] text-[#484848]">{item.label}</span>
                                        {item.badge && <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-black">{item.badge}</span>}
                                    </div>
                                    {item.locked ? <Lock size={14} className="text-[#767676]" /> : <ChevronRight size={18} className="text-[#767676]" />}
                                </div>
                            ))}
                        </div>

                        {/* Explore Section */}
                        <div className="p-6 space-y-4">
                            <h4 className="text-[12px] font-black text-[#767676] uppercase tracking-[0.2em] px-2">Explore</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Events', icon: '🎟️', color: 'bg-red-50' },
                                    { label: 'Brands', icon: '🎭', color: 'bg-pink-50' },
                                    { label: 'Creators', icon: '📸', color: 'bg-orange-50' },
                                    { label: 'Coupons', icon: '🎫', color: 'bg-amber-50' },
                                ].map((item, i) => (
                                    <div key={i} className={`p-4 rounded-[1.5rem] border border-black/[0.03] space-y-3 cursor-pointer hover:shadow-md transition-all ${item.color}`}>
                                        <span className="text-2xl">{item.icon}</span>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[13px] text-[#484848]">{item.label}</span>
                                            <ChevronRight size={14} className="text-[#767676]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* More Section */}
                        <div className="px-4 pb-12 space-y-1">
                            <h4 className="text-[12px] font-black text-[#767676] uppercase tracking-[0.2em] p-2">More</h4>
                            {[
                                { icon: <Smartphone size={18} />, label: 'Get the App' },
                                { icon: <LayoutDashboard size={18} />, label: 'Become an organizer' },
                                { icon: <HelpCircle size={18} />, label: 'Help & Support' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#f9fafb] transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="text-[#767676] group-hover:text-[#ff5862] transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="font-bold text-[14px] text-[#484848]">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-[#767676]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Login Bottom Button */}
                    {!user && (
                        <div className="p-6 bg-white border-t border-black/5">
                            <Link to="/auth" onClick={onClose} className="w-full py-5 bg-[#0e1724] text-white rounded-[1.25rem] font-bold text-[15px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-black/10">
                                <ChevronRight size={18} /> Login to your account
                            </Link>
                            <p className="text-center mt-4 text-[12px] font-medium text-[#767676]">
                                Don't have an account? <Link to="/auth" className="text-[#00A699] hover:underline">Create one now</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SideMenu;
