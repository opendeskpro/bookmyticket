import { Event, User, Ticket, Organizer } from '../types';
import { supabase, createEvent, createBooking, getUserBookings, getBookedSeats, getHomepageSections, updateHomepageSection } from './supabase';

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

            return {
                ...data,
                banner: data.banner_url || data.banner,
                date: data.event_date || data.date,
                time: data.start_time || data.time,
                tickets: data.ticket_types || []
            };
        },
        getSeats: async (id: string) => {
            return await getBookedSeats(id);
        },
        create: async (data: any) => {
            return await createEvent(data); // Import this from supabase.ts
        }
    },
    bookings: {
        create: async (eventId: string, seats: any[], totalAmount: number, bookingTime?: string) => {
            // Calculate breakdown
            const pricePerTicket = seats[0]?.price || 0; // Assuming all same price for simplicity of this calc
            const quantity = seats.length;
            const subtotal = pricePerTicket * quantity;

            // Fees configuration (should match BookingPage logic or be fetched from backend config)
            const BOOKING_FEE_PERCENT = 0.05; // 5%

            const platformFee = Math.round(subtotal * BOOKING_FEE_PERCENT);
            const internetHandlingFee = quantity * 10; // Fixed 10 per ticket
            const tax = Math.round((platformFee + internetHandlingFee) * 0.18); // 18% GST on fees

            const breakdown = {
                ticketPrice: subtotal,
                platformFee,
                internetHandlingFee,
                tax
            };

            return await createBooking(eventId, seats, totalAmount, bookingTime, breakdown);
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
                        full_name: data.full_name,
                        role: data.role // Pass role to trigger
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
        logout: async (): Promise<void> => {
            await supabase.auth.signOut();
        },
    },
    siteConfig: {
        get: async (key: string) => {
            const { data, error } = await supabase
                .from('site_config')
                .select('config_value')
                .eq('section_key', key)
                .single();

            if (error) {
                console.error(`Error fetching config ${key}:`, error);
                return null;
            }
            return data?.config_value;
        },
        update: async (key: string, value: any) => {
            const { error } = await supabase
                .from('site_config')
                .upsert({ section_key: key, config_value: value }, { onConflict: 'section_key' });

            if (error) throw error;
            return { success: true };
        },
        uploadLogo: async (file: File) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `logo-${Date.now()}.${fileExt}`;
            const filePath = `brand-assets/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('public-assets') // Assuming 'public-assets' bucket exists or similar
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('public-assets')
                .getPublicUrl(filePath);

            return publicUrl;
        }
    },
    withdrawals: {
        request: async (amount: number, method: string, bankDetails?: any) => {
            const { data, error } = await supabase.rpc('request_withdrawal', {
                p_amount: amount,
                p_method: method,
                p_bank_details: bankDetails
            });
            if (error) throw error;
            return data;
        },
        listPending: async () => {
            const { data, error } = await supabase
                .from('withdrawals')
                .select('*, profiles(full_name, email, organisation_name)') // Adjust based on actual profile schema
                .eq('status', 'PENDING')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        },
        approve: async (id: string) => {
            const { data, error } = await supabase.rpc('approve_withdrawal', { p_withdrawal_id: id });
            if (error) throw error;
            return data;
        },
        reject: async (id: string) => {
            const { data, error } = await supabase.rpc('reject_withdrawal', { p_withdrawal_id: id });
            if (error) throw error;
            return data;
        }
    },
    cms: {
        getHomepage: async () => {
            return await getHomepageSections();
        },
        updateSection: async (key: string, content: any, title?: string) => {
            return await updateHomepageSection(key, content, title);
        }
    }
};
