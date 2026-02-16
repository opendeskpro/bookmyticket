import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Send, Paperclip, User, Calendar, Clock, ArrowLeft, CheckCircle, XCircle, AlertCircle, MoreVertical, Mail } from 'lucide-react';

interface Message {
    id: string;
    sender: 'Admin' | 'User';
    content: string;
    timestamp: string;
    attachments?: string[];
}

const TicketDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { theme } = useTheme();
    const [replyText, setReplyText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'User', content: 'Hi, I haven\'t received my payout for the last event yet. It\'s been 5 days.', timestamp: '2026-02-15 10:30 AM' },
        { id: '2', sender: 'Admin', content: 'Hello! Let me check the status of your withdrawal request. Please hold on.', timestamp: '2026-02-15 11:15 AM' },
        { id: '3', sender: 'User', content: 'Okay, waiting for your update.', timestamp: '2026-02-15 11:20 AM' },
    ]);

    const handleSend = () => {
        if (!replyText.trim()) return;
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'Admin',
            content: replyText,
            timestamp: new Date().toLocaleString()
        };
        setMessages([...messages, newMessage]);
        setReplyText('');
    };

    return (
        <div className={`p-6 md:p-10 min-h-screen flex flex-col ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-6 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/support" className={`p-2 rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">Ticket #{id}</h1>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">Pending</span>
                            </div>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                                Payout not received yet
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 font-bold text-xs hover:bg-green-500/20 transition-colors flex items-center gap-2">
                            <CheckCircle size={14} /> Mark Resolved
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs hover:bg-red-500/20 transition-colors flex items-center gap-2">
                            <XCircle size={14} /> Close Ticket
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    {/* Chat Area */}
                    <div className={`lg:col-span-2 rounded-[2rem] border shadow-xl flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                        {/* Messages */}
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-black/20">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'Admin'
                                        ? 'bg-[#3A86FF] text-white rounded-tr-none'
                                        : theme === 'dark' ? 'bg-[#1e2736] text-white rounded-tl-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                                        }`}>
                                        <div className="flex items-center justify-between gap-4 mb-2 opacity-70">
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{msg.sender}</span>
                                            <span className="text-[10px]">{msg.timestamp}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Box */}
                        <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5 bg-[#131922]' : 'border-slate-100 bg-white'}`}>
                            <div className={`rounded-xl border p-2 flex flex-col gap-2 ${theme === 'dark' ? 'bg-[#0c1017] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here..."
                                    className="w-full bg-transparent outline-none p-2 text-sm resize-none h-24"
                                />
                                <div className="flex items-center justify-between px-2 pb-1">
                                    <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-400">
                                        <Paperclip size={18} />
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        className="px-6 py-2 bg-[#3A86FF] hover:bg-[#2f6cdb] text-white rounded-lg font-bold text-xs transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                                    >
                                        <Send size={14} /> Send Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className={`p-6 rounded-[2rem] border shadow-xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                            <h3 className="text-lg font-bold mb-4">Ticket Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-dashed border-gray-200 dark:border-white/10">
                                    <span className="text-xs opacity-60 font-bold uppercase tracking-wider">Department</span>
                                    <span className="text-sm font-bold">Billing</span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-dashed border-gray-200 dark:border-white/10">
                                    <span className="text-xs opacity-60 font-bold uppercase tracking-wider">Priority</span>
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">High</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs opacity-60 font-bold uppercase tracking-wider">Last Activity</span>
                                    <span className="text-sm font-bold">5 mins ago</span>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-[2rem] border shadow-xl ${theme === 'dark' ? 'bg-[#131922] border-white/5' : 'bg-white border-slate-200'}`}>
                            <h3 className="text-lg font-bold mb-4">User Details</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                    <img src="https://i.pravatar.cc/150?u=1" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold">event_pro</h4>
                                    <p className="text-xs opacity-60">Optimizer</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 opacity-80">
                                    <Mail size={14} /> pro@events.com
                                </div>
                                <div className="flex items-center gap-3 opacity-80">
                                    <User size={14} /> ID: #ORG-8832
                                </div>
                                <div className="flex items-center gap-3 opacity-80">
                                    <Calendar size={14} /> Joined Jan 2026
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-gray-300 dark:border-white/20 hover:border-[#3A86FF] hover:text-[#3A86FF] transition-all text-xs font-bold uppercase tracking-wider">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
