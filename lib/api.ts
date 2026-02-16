
import { Event, User, Ticket, Organizer } from '../types';
import { supabase } from './supabase';

export const api = {
    events: {
        list: async (): Promise<Event[]> => {
            const { data, error } = await supabase
                .from('events')
                .select('*, ticket_types(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(event => ({
                ...event,
                banner: event.banner_url || event.banner,
                date: event.event_date || event.date,
                time: event.start_time || event.time,
                tickets: event.ticket_types || []
            }));
        },
        get: async (id: string): Promise<Event | null> => {
            const { data, error } = await supabase
                .from('events')
                .select('*, ticket_types(*)')
                .eq('id', id)
                .single();

            if (error) return null;
            return data;
        },
    },
    bookings: {
        create: async (data: any): Promise<any> => {
            const { data: booking, error } = await supabase
                .from('bookings')
                .insert([data])
                .select()
                .single();

            if (error) throw error;
            return { success: true, booking };
        },
        list: async (): Promise<Ticket[]> => {
            const { data, error } = await supabase
                .from('tickets')
                .select('*, events(title)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        },
        cancel: async (id: string, token: string): Promise<any> => {
            const { error } = await supabase
                .from('tickets')
                .update({ status: 'REFUNDED' }) // Matches TicketStatus.REFUNDED
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        },
    },
    organizers: {
        get: async (id: string): Promise<Organizer | null> => {
            const { data, error } = await supabase
                .from('organisers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) return null;
            return data;
        },
        update: async (data: any): Promise<any> => {
            const { error } = await supabase
                .from('organisers')
                .update(data)
                .eq('id', data.id);

            if (error) throw error;
            return { success: true };
        },
    },
    auth: {
        login: async (credentials: any): Promise<any> => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });
            if (error) throw error;
            return data;
        },
        register: async (data: any): Promise<any> => {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.name,
                    }
                }
            });
            if (error) throw error;
            return authData;
        },
        me: async (): Promise<User | null> => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            return profile;
        },
    }
};
