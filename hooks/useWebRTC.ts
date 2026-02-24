import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface UseWebRTCProps {
    meetingId: string;
    userId: string;
}

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export const useWebRTC = ({ meetingId, userId }: UseWebRTCProps) => {
    // Media State
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
    const [isCamOn, setIsCamOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for keeping track of connections and the Supabase channel
    const peersRef = useRef<{ [key: string]: RTCPeerConnection }>({});
    const channelRef = useRef<any>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // 1. Initialize Local Media
    const startLocalStream = useCallback(async (video = true, audio = true) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
            setLocalStream(stream);
            localStreamRef.current = stream;
            setIsCamOn(video);
            setIsMicOn(audio);
            setError(null);
            return stream;
        } catch (err: any) {
            console.error("Error accessing media devices.", err);
            setError("Could not access camera or microphone. Please check permissions.");
            return null;
        }
    }, []);

    // 2. Initialize Signaling Channel
    useEffect(() => {
        if (!meetingId || !userId) return;

        // Create a unique channel for this meeting
        const channel = supabase.channel(`meeting:${meetingId}`, {
            config: {
                presence: { key: userId },
                broadcast: { self: false }
            }
        });

        // Handle incoming WebRTC signaling messages
        channel.on('broadcast', { event: 'webrtc-signal' }, async (payload) => {
            const { type, data, senderId, targetId } = payload.payload;

            // Only process messages meant for everyone (like new-peer) or specifically for this user
            if (targetId && targetId !== userId) return;

            if (type === 'new-peer') {
                // A new peer joined, so the existing peers create an offer
                createOffer(senderId);
            } else if (type === 'webrtc-offer') {
                await handleReceiveOffer(senderId, data.offer);
            } else if (type === 'webrtc-answer') {
                await handleReceiveAnswer(senderId, data.answer);
            } else if (type === 'webrtc-ice-candidate') {
                await handleNewICECandidate(senderId, data.candidate);
            } else if (type === 'peer-left') {
                handlePeerLeft(senderId);
            }
        });

        // Handle Presence (Tracking who is in the room)
        channel.on('presence', { event: 'sync' }, () => {
            // Can be used to track list of connected users
        });

        channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
            // Wait for new-peer broadcast instead to initiate WebRTC
        });

        channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            // Clean up left peers
            const leftUserId = leftPresences[0]?.key;
            if (leftUserId) {
                handlePeerLeft(leftUserId);
            }
        });

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ online_at: new Date().toISOString() });
                // Broadcast that we just joined so others can send us offers
                channel.send({
                    type: 'broadcast',
                    event: 'webrtc-signal',
                    payload: { type: 'new-peer', senderId: userId }
                });
            }
        });

        channelRef.current = channel;

        // Cleanup on unmount
        return () => {
            channel.send({
                type: 'broadcast',
                event: 'webrtc-signal',
                payload: { type: 'peer-left', senderId: userId }
            });
            supabase.removeChannel(channel);

            // Close all peer connections
            Object.values(peersRef.current).forEach(peer => peer.close());
            peersRef.current = {};

            // Stop local tracks
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meetingId, userId]);


    // --- WebRTC Core Functions ---

    const createPeerConnection = (targetUserId: string) => {
        const peerConnection = new RTCPeerConnection(configuration);

        // Add local tracks to the connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStreamRef.current!);
            });
        }

        // Handle ICE candidates generated by the local browser
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                channelRef.current?.send({
                    type: 'broadcast',
                    event: 'webrtc-signal',
                    payload: {
                        type: 'webrtc-ice-candidate',
                        senderId: userId,
                        targetId: targetUserId,
                        data: { candidate: event.candidate }
                    }
                });
            }
        };

        // Handle incoming streams from the remote peer
        peerConnection.ontrack = (event) => {
            setRemoteStreams(prev => ({
                ...prev,
                [targetUserId]: event.streams[0]
            }));
        };

        // Handle connection state changes
        peerConnection.oniceconnectionstatechange = () => {
            if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed' || peerConnection.iceConnectionState === 'closed') {
                handlePeerLeft(targetUserId);
            }
        };

        peersRef.current[targetUserId] = peerConnection;
        return peerConnection;
    };

    const createOffer = async (targetUserId: string) => {
        const peerConnection = createPeerConnection(targetUserId);
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            channelRef.current?.send({
                type: 'broadcast',
                event: 'webrtc-signal',
                payload: {
                    type: 'webrtc-offer',
                    senderId: userId,
                    targetId: targetUserId,
                    data: { offer }
                }
            });
        } catch (err) {
            console.error("Error creating offer:", err);
        }
    };

    const handleReceiveOffer = async (senderId: string, offer: RTCSessionDescriptionInit) => {
        const peerConnection = createPeerConnection(senderId);
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            channelRef.current?.send({
                type: 'broadcast',
                event: 'webrtc-signal',
                payload: {
                    type: 'webrtc-answer',
                    senderId: userId,
                    targetId: senderId,
                    data: { answer }
                }
            });
        } catch (err) {
            console.error("Error handling offer:", err);
        }
    };

    const handleReceiveAnswer = async (senderId: string, answer: RTCSessionDescriptionInit) => {
        const peerConnection = peersRef.current[senderId];
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (err) {
                console.error("Error handling answer:", err);
            }
        }
    };

    const handleNewICECandidate = async (senderId: string, candidate: RTCIceCandidateInit) => {
        const peerConnection = peersRef.current[senderId];
        if (peerConnection) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("Error adding ICE candidate:", err);
            }
        }
    };

    const handlePeerLeft = (peerId: string) => {
        if (peersRef.current[peerId]) {
            peersRef.current[peerId].close();
            delete peersRef.current[peerId];
        }
        setRemoteStreams(prev => {
            const newStreams = { ...prev };
            delete newStreams[peerId];
            return newStreams;
        });
    };

    // --- Media Controls ---

    const toggleCamera = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCamOn(videoTrack.enabled);
            } else if (!isCamOn) {
                // If stream exists but no video track, request it and replace tracks
                startLocalStream(true, isMicOn).then(newStream => {
                    if (newStream) replaceTracks(newStream);
                });
            }
        } else {
            startLocalStream(true, isMicOn);
        }
    }, [startLocalStream, isMicOn, isCamOn]);

    const toggleMicrophone = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            } else if (!isMicOn) {
                startLocalStream(isCamOn, true).then(newStream => {
                    if (newStream) replaceTracks(newStream);
                });
            }
        } else {
            startLocalStream(isCamOn, true);
        }
    }, [startLocalStream, isCamOn, isMicOn]);

    // Helper to replace tracks for existing peer connections when acquiring new media
    const replaceTracks = (newStream: MediaStream) => {
        Object.values(peersRef.current).forEach(peerConnection => {
            const senders = peerConnection.getSenders();
            newStream.getTracks().forEach(track => {
                const sender = senders.find(s => s.track?.kind === track.kind);
                if (sender) {
                    sender.replaceTrack(track);
                } else {
                    peerConnection.addTrack(track, newStream);
                }
            });
        });
    };

    return {
        localStream,
        remoteStreams,
        isCamOn,
        isMicOn,
        toggleCamera,
        toggleMicrophone,
        startLocalStream,
        error
    };
};
