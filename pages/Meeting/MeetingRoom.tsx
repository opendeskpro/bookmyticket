import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Video, VideoOff, Mic, MicOff, MonitorUp, MessageSquare, Users as UsersIcon, LogOut, Copy, Check } from 'lucide-react';
import { getMeeting, Meeting } from '../../lib/meetingData';
import { useWebRTC } from '../../hooks/useWebRTC';
import { v4 as uuidv4 } from 'uuid';

// Helper component to render remote video streams
const VideoPlayer: React.FC<{ stream: MediaStream; isLocal?: boolean; label: string }> = ({ stream, isLocal = false, label }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative w-full aspect-video bg-[#151515] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                className={`w-full h-full object-cover ${isLocal ? 'scale-x-[-1]' : ''}`} // Mirror local video
            />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium flex items-center gap-2 text-white">
                {label}
            </div>
        </div>
    );
};

const MeetingRoom = () => {
    const { meetingId } = useParams<{ meetingId: string }>();
    const navigate = useNavigate();

    // Core States
    const [user, setUser] = useState<any>(null);
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // Pre-join States
    const [hasJoined, setHasJoined] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [participantId, setParticipantId] = useState(''); // Real DB ID or random Guest ID

    // Initialize WebRTC
    const {
        localStream,
        remoteStreams,
        isCamOn,
        isMicOn,
        toggleCamera,
        toggleMicrophone,
        startLocalStream,
        error: webrtcError
    } = useWebRTC({
        meetingId: meetingId || '',
        userId: participantId // Use the resolved ID for WebRTC presence
    });

    useEffect(() => {
        const init = async () => {
            if (meetingId) {
                const m = await getMeeting(meetingId);
                if (m) {
                    setMeeting(m);
                } else {
                    setError('Meeting not found or you do not have permission to join.');
                    setLoading(false);
                    return;
                }
            } else {
                setError('Invalid meeting link.');
                setLoading(false);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            const demoUser = localStorage.getItem('demo_user');
            const resolvedUser = user || (demoUser ? JSON.parse(demoUser) : null);

            if (resolvedUser) {
                setUser(resolvedUser);
                setParticipantId(resolvedUser.id);
                setGuestName(resolvedUser.name || resolvedUser.user_metadata?.full_name || resolvedUser.email?.split('@')[0] || 'User');
            } else {
                // Generate a random ID for the guest session
                const gid = `guest_${uuidv4()}`;
                setParticipantId(gid);
            }

            // Always start local stream for the pre-join preview
            await startLocalStream(true, true);
            setLoading(false);
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meetingId]);

    const handleJoinMeeting = async () => {
        if (!guestName.trim()) {
            alert('Please enter your name to join.');
            return;
        }

        if (user && meetingId) {
            try {
                await supabase.from('participants').upsert(
                    { meeting_id: meetingId, user_id: user.id, status: 'admitted' },
                    { onConflict: 'meeting_id,user_id' }
                );
            } catch (err) {
                console.error("Could not insert DB participant, continuing with Realtime...", err);
            }
        }

        setHasJoined(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLeave = async () => {
        if (meetingId && user) {
            await supabase.from('participants')
                .update({ status: 'left', left_at: new Date().toISOString() })
                .eq('meeting_id', meetingId)
                .eq('user_id', user.id);
        }
        navigate('/meeting-now');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !meeting) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center px-4">
                <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl max-w-md text-center border border-red-500/20">
                    <h2 className="text-xl font-bold mb-2">Oops!</h2>
                    <p className="text-sm">{error || 'Meeting not found.'}</p>
                    <button onClick={() => navigate('/')} className="mt-6 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-bold transition-colors">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------
    // PRE-JOIN SCREEN
    // ----------------------------------------------------
    if (!hasJoined) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-6">
                <div className="max-w-4xl w-full flex flex-col lg:flex-row items-center gap-12">

                    {/* Media Preview Area */}
                    <div className="flex-1 w-full">
                        <div className="relative w-full aspect-video bg-[#151515] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl mb-6">
                            {localStream && isCamOn ? (
                                <video
                                    ref={(ref) => { if (ref) ref.srcObject = localStream; }}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center">
                                    <VideoOff size={48} className="mb-4 opacity-50" />
                                    <p>Camera is turned off</p>
                                </div>
                            )}

                            {/* In-preview Media Controls */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                                <button
                                    onClick={toggleMicrophone}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                                >
                                    {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                                </button>
                                <button
                                    onClick={toggleCamera}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCamOn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                                >
                                    {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Join Details Area */}
                    <div className="w-full lg:w-96 flex flex-col justify-center">
                        <h1 className="text-3xl font-black mb-2">{meeting.title}</h1>
                        <p className="text-gray-400 mb-8">Ready to join this session?</p>

                        {!user && (
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-300 mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleJoinMeeting}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                        >
                            {user ? 'Join Now' : 'Join as Guest'}
                        </button>

                        {!user && (
                            <p className="text-xs text-gray-500 text-center mt-6">
                                Joining as a guest. To save your history and access all features, <a href="#/auth" className="text-blue-500 hover:underline">log in</a>.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------
    // IN-MEETING SCREEN
    // ----------------------------------------------------
    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col h-screen overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0B0B0B]/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-lg">{meeting.title}</h1>
                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-bold text-gray-400 uppercase">
                        {meeting.status}
                    </span>
                    {webrtcError && <span className="text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">{webrtcError}</span>}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Video Grid Area */}
                <div className={`flex-1 p-4 grid gap-4 overflow-y-auto ${Object.keys(remoteStreams).length > 0 ? 'grid-cols-2 lg:grid-cols-3 auto-rows-min' : 'place-items-center'}`}>

                    {/* Local Stream */}
                    <div className={`${Object.keys(remoteStreams).length === 0 ? 'max-w-4xl w-full max-h-[80vh]' : 'w-full'} relative aspect-video bg-[#151515] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl transition-all duration-300`}>
                        {localStream && isCamOn ? (
                            <VideoPlayer stream={localStream} isLocal={true} label={`${guestName} (You)`} />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-black shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                {guestName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {!isCamOn && (
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium flex items-center gap-2">
                                {guestName} (You)
                                {!isMicOn && <MicOff size={14} className="text-red-500" />}
                            </div>
                        )}
                    </div>

                    {/* Remote Streams */}
                    {Object.entries(remoteStreams).map(([peerId, stream]) => (
                        <div key={peerId} className="w-full">
                            <VideoPlayer stream={stream} label={`Peer: ${peerId.substring(0, 5)}...`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="h-20 border-t border-white/5 flex items-center justify-center px-6 shrink-0 bg-[#0B0B0B]/80 backdrop-blur-md z-20 gap-4">

                <button
                    onClick={toggleMicrophone}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                >
                    {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                <button
                    onClick={toggleCamera}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isCamOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                >
                    {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                <div className="w-px h-8 bg-white/10 mx-2"></div>

                <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white relative group">
                    <MonitorUp size={20} />
                    <span className="absolute -top-10 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Share</span>
                </button>

                <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white relative group">
                    <UsersIcon size={20} />
                    <span className="absolute -top-10 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">People</span>
                </button>

                <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white relative group">
                    <MessageSquare size={20} />
                    <span className="absolute -top-10 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Chat</span>
                </button>

                <div className="w-px h-8 bg-white/10 mx-2"></div>

                <button
                    onClick={handleLeave}
                    className="px-6 py-3 rounded-xl flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                >
                    <LogOut size={18} />
                    Leave
                </button>
            </div>
        </div>
    );
};

export default MeetingRoom;
