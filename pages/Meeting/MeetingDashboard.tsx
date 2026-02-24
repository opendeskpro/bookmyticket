import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Video, Calendar, Clock, Plus, ArrowRight, MonitorPlay, Users } from 'lucide-react';
import { createMeeting, getUserMeetings, Meeting } from '../../lib/meetingData';

const MeetingDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [joinId, setJoinId] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const demoUser = localStorage.getItem('demo_user');

        if (!user && !demoUser) {
            navigate('/auth');
            return;
        }

        const resolvedUser = user || JSON.parse(demoUser!);
        setUser(resolvedUser);
        loadMeetings();
    };

    const loadMeetings = async () => {
        try {
            setLoading(true);
            const data = await getUserMeetings();
            setMeetings(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMeeting = async () => {
        try {
            setCreating(true);
            const meeting = await createMeeting(`${user.user_metadata?.full_name || 'User'}'s Meeting`);
            if (meeting) {
                navigate(`/meeting/${meeting.id}`);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to create meeting.");
        } finally {
            setCreating(false);
        }
    };

    const handleJoinMeeting = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinId.trim()) {
            navigate(`/meeting/${joinId.trim()}`);
        }
    };

    // Group meetings
    const upcoming = meetings.filter(m => m.status === 'scheduled');
    const past = meetings.filter(m => m.status === 'ended' || m.status === 'active');

    const userRole = user?.role || user?.user_metadata?.role || 'USER';
    const canCreateMeeting = userRole === 'ADMIN' || userRole === 'ORGANISER';

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pt-24 pb-12 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">MeetSphere</h1>
                        <p className="text-gray-400 font-medium tracking-wide">Secure, high-quality video meetings.</p>
                    </div>
                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <span className="text-sm font-bold text-gray-400">{user?.email}</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Actions */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Join Meeting Card (Available to Everyone) */}
                        <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 shadow-2xl hover:border-purple-500/30 transition-all group overflow-hidden relative">
                            <div className="absolute -right-10 -top-10 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                                <Users size={150} />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-14 h-14 bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center">
                                    <MonitorPlay size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black mb-1">Join Meeting</h3>
                                    <p className="text-sm font-medium text-gray-400">Enter a code or link</p>
                                </div>
                                <form onSubmit={handleJoinMeeting} className="mt-4 flex flex-col gap-3">
                                    <input
                                        type="text"
                                        placeholder="Enter meeting code..."
                                        value={joinId}
                                        onChange={(e) => setJoinId(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!joinId}
                                        className="w-full bg-transparent border border-purple-500/50 hover:bg-purple-500/10 text-purple-400 font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:hover:bg-transparent"
                                    >
                                        Join
                                    </button>
                                </form>
                            </div>
                        </div>

                        {canCreateMeeting && (
                            <>
                                {/* New Meeting Card */}
                                <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 shadow-2xl hover:border-blue-500/30 transition-all group overflow-hidden relative">
                                    <div className="absolute -right-10 -top-10 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                                        <Video size={150} />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-14 h-14 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
                                            <Video size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-1">New Meeting</h3>
                                            <p className="text-sm font-medium text-gray-400">Start an instant meeting</p>
                                        </div>
                                        <button
                                            onClick={handleCreateMeeting}
                                            disabled={creating}
                                            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {creating ? 'Starting...' : <><Plus size={18} /> Start a Meeting</>}
                                        </button>
                                    </div>
                                </div>

                                {/* Schedule Card */}
                                <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 shadow-2xl hover:border-orange-500/30 transition-all group flex items-center gap-4 cursor-pointer hover:bg-orange-500/5">
                                    <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black mb-0">Schedule</h3>
                                        <p className="text-xs font-medium text-gray-400">Plan a future meeting</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column: Meetings List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#151515] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl min-h-[600px] flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-black">Upcoming Meetings</h2>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center flex-1">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : upcoming.length > 0 ? (
                                <div className="space-y-4">
                                    {upcoming.map(m => (
                                        <div key={m.id} className="bg-black/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-lg">{m.title}</h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                    <Clock size={14} className="text-blue-500" />
                                                    {new Date(m.scheduled_at!).toLocaleString()}
                                                </div>
                                            </div>
                                            <button onClick={() => navigate(`/meeting/${m.id}`)} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-bold text-sm transition-colors">
                                                Join
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center flex-1 text-center opacity-50">
                                    <Calendar size={64} className="text-gray-600 mb-4" />
                                    <h3 className="text-xl font-bold mb-2">No upcoming meetings</h3>
                                    <p className="text-sm font-medium">Your schedule is clear. Create a new meeting to get started.</p>
                                </div>
                            )}

                            {past.length > 0 && (
                                <>
                                    <div className="flex items-center gap-4 mb-6 mt-12">
                                        <h2 className="text-xl font-black text-gray-400">Recent Meetings</h2>
                                        <div className="h-px bg-white/5 flex-1"></div>
                                    </div>
                                    <div className="space-y-3">
                                        {past.slice(0, 3).map(m => (
                                            <div key={m.id} className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                                                <div>
                                                    <p className="font-bold text-sm">{m.title}</p>
                                                    <p className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
                                                    {m.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MeetingDashboard;
