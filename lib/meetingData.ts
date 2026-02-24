import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export type MeetingStatus = 'scheduled' | 'active' | 'ended';

export interface Meeting {
    id: string;
    title: string;
    host_id: string;
    scheduled_at: string | null;
    status: MeetingStatus;
    created_at: string;
}

// Helper to get the current user (Supabase or Demo)
const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;

    const demoUser = localStorage.getItem('demo_user');
    if (demoUser) return JSON.parse(demoUser);

    return null;
};

export const createMeeting = async (title: string, scheduledAt?: Date): Promise<Meeting | null> => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Must be logged in to create a meeting");

    const meetingId = uuidv4();

    const { data, error } = await supabase
        .from('meetings')
        .insert([
            {
                id: meetingId,
                title,
                host_id: user.id,
                scheduled_at: scheduledAt ? scheduledAt.toISOString() : null,
                status: scheduledAt ? 'scheduled' : 'active'
            }
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating meeting:", error);
        throw error;
    }

    return data as Meeting;
};

export const getMeeting = async (meetingId: string): Promise<Meeting | null> => {
    const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .single();

    if (error) {
        console.error("Error fetching meeting:", error);
        return null;
    }

    return data as Meeting;
};

export const getUserMeetings = async (): Promise<Meeting[]> => {
    const user = await getCurrentUser();
    if (!user) return [];

    // Get meetings where user is host OR participant
    const { data: participatedMeetingIds, error: partErr } = await supabase
        .from('participants')
        .select('meeting_id')
        .eq('user_id', user.id);

    if (partErr) {
        console.error(partErr);
        // Fallback to just host meetings if participants table check fails (e.g. for demo users)
    }

    const ids = participatedMeetingIds?.map(p => p.meeting_id) || [];

    let query = supabase.from('meetings').select('*');

    if (ids.length > 0) {
        query = query.or(`host_id.eq.${user.id},id.in.(${ids.join(',')})`);
    } else {
        query = query.eq('host_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching user meetings:", error);
        return [];
    }

    return data as Meeting[];
};
