
import { createClient } from '@supabase/supabase-js';
import { Event, User, Ticket } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Events ---

export const getEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
        .from('events')
        .select('*, ticket_types(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }

    return (data || []).map(event => ({
        ...event,
        banner: event.banner_url || event.banner,
        date: event.event_date || event.date,
        time: event.start_time || event.time,
        tickets: event.ticket_types || []
    }));
};

export const createEvent = async (eventData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get organiser id for this user
    const { data: organiser } = await supabase
        .from('organisers')
        .select('id')
        .eq('user_id', user.id)
        .single();

    const payload = {
        organiser_id: organiser?.id || user.id,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        city: eventData.city,
        venue: eventData.venue,
        event_date: eventData.date,
        start_time: eventData.time,
        banner_url: eventData.banner,
        status: 'PUBLISHED'
    };

    const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- Bookings ---

export const createBooking = async (
    eventId: string,
    seats: any[],
    totalAmount: number,
    bookingTime?: string,
    breakdown?: any
) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // 1. Create Booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
            user_id: user.id,
            event_id: eventId,
            total_amount: totalAmount,
            quantity: seats.length,
            status: 'CONFIRMED',
            booking_time: bookingTime,
            ticket_price: breakdown?.ticketPrice || totalAmount,
            platform_fee: breakdown?.platformFee || 0,
            internet_handling_fee: breakdown?.internetHandlingFee || 0,
            tax: breakdown?.tax || 0
        }])
        .select()
        .single();

    if (bookingError) throw bookingError;

    // 2. Create Tickets
    const tickets = seats.map(seat => ({
        booking_id: booking.id,
        event_id: eventId,
        seat_row: seat.row,
        seat_number: seat.number,
        price: seat.price,
        type: seat.category,
        status: 'VALID'
    }));

    const { error: ticketError } = await supabase
        .from('tickets')
        .insert(tickets);

    if (ticketError) throw ticketError;

    return booking;
};

export const getUserBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      events (
        title,
        event_date,
        venue,
        banner_url
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((b: any) => ({
        ...b,
        eventTitle: b.events?.title,
        eventDate: b.events?.event_date,
        eventVenue: b.events?.venue,
        banner: b.events?.banner_url
    }));
};

export const getBookedSeats = async (eventId: string) => {
    const { data, error } = await supabase
        .from('tickets')
        .select('seat_row, seat_number')
        .eq('event_id', eventId)
        .eq('status', 'VALID');

    if (error) throw error;
    return data || [];
};

// --- Organiser helpers (used in dashboards, orders, wallet, etc.) ---

export const getOrganiserIdForUser = async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase
        .from('organisers')
        .select('id')
        .eq('user_id', userId)
        .single();
    if (error || !data) return null;
    return data.id as string;
};

export const getEventsForOrganiser = async (organiserId: string): Promise<Event[]> => {
    const { data, error } = await supabase
        .from('events')
        .select('*, ticket_types(*)')
        .eq('organiser_id', organiserId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching organiser events:', error);
        return [];
    }

    return (data || []).map((event: any) => ({
        ...event,
        banner: event.banner_url || event.banner,
        date: event.event_date || event.date,
        time: event.start_time || event.time,
        tickets: event.ticket_types || []
    }));
};

export const getBookingsForOrganiser = async (organiserId: string) => {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            id,
            user_id,
            event_id,
            total_amount,
            quantity,
            status,
            created_at,
            booking_time,
            events!inner (
                id,
                title,
                event_date,
                venue,
                organiser_id
            ),
            profiles:user_id (
                full_name,
                email
            ),
            tickets (*)
        `)
        .eq('events.organiser_id', organiserId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching organiser bookings:', error);
        return [];
    }

    return (data || []).map((b: any) => ({
        ...b,
        eventTitle: b.events?.title,
        eventDate: b.events?.event_date,
        eventVenue: b.events?.venue,
        buyerName: b.profiles?.full_name,
        buyerEmail: b.profiles?.email,
    }));
};

export const getWithdrawalsForOrganiser = async (organiserId: string) => {
    const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('organiser_id', organiserId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching organiser withdrawals:', error);
        return [];
    }
    return data || [];
};

export const getTransactionsForOrganiser = async (organiserId: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('organiser_id', organiserId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching organiser transactions:', error);
        return [];
    }
    return data || [];
};

// --- Event Categories Management ---

export const getEventCategories = async () => {
    const { data, error } = await supabase
        .from('event_categories')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching event categories:', error);
        return [];
    }
    return data || [];
};

// --- Admin: organisers list ---

export const getOrganizersForAdmin = async () => {
    const { data, error } = await supabase
        .from('organisers')
        .select(`
            *,
            profiles:user_id ( full_name, email )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching organisers for admin:', error);
        return [];
    }
    return data || [];
};

// --- Site Config Management ---

export const getSiteConfig = async (key: string) => {
    const { data, error } = await supabase
        .from('site_config')
        .select('config_value')
        .eq('section_key', key);

    if (error) {
        console.error('Error fetching site config:', error);
        return null;
    }
    return data && data.length > 0 ? data[0].config_value : null;
};

export const updateSiteConfig = async (key: string, value: any) => {
    const { error } = await supabase
        .from('site_config')
        .upsert({ section_key: key, config_value: value }, { onConflict: 'section_key' });

    if (error) {
        console.error('Error updating site config:', error);
        throw error;
    }
};

// --- Dashboard Stats ---

export const getOrganizerStats = async (userId: string) => {
    // 1. Get Organiser ID
    const { data: organiser } = await supabase
        .from('organisers')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!organiser) return { totalEvents: 0, ticketsSold: 0, totalRevenue: 0 };

    // 2. Total Events
    const { count: totalEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('organiser_id', organiser.id);

    // 3. Tickets Sold
    const { count: ticketsSold } = await supabase
        .from('tickets')
        .select('*, events!inner(*)', { count: 'exact', head: true })
        .eq('events.organiser_id', organiser.id);

    // 4. Total Revenue
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('total_amount, events!inner(*)')
        .eq('events.organiser_id', organiser.id);

    const totalRevenue = (bookings || []).reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

    return {
        totalEvents: totalEvents || 0,
        ticketsSold: ticketsSold || 0,
        totalRevenue: totalRevenue || 0
    };
};

export const getCityEventCounts = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('city');

    if (error) return {};

    const counts: Record<string, number> = {};
    (data || []).forEach((e: any) => {
        if (e.city) {
            counts[e.city] = (counts[e.city] || 0) + 1;
        }
    });
    return counts;
};

export const getFeaturedOrganizers = async () => {
    const { data, error } = await supabase
        .from('organisers')
        .select('name, logo_url, status')
        .eq('status', 'ACTIVE')
        .limit(6);

    if (error) return [];

    return (data || []).map((org: any) => ({
        name: org.name,
        logo: org.logo_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=200&auto=format&fit=crop',
        count: 'Featured'
    }));
};

// --- Homepage CMS ---

export const getHomepageSections = async () => {
    const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching homepage sections:', error);
        return [];
    }
    return data || [];
};

export const updateHomepageSection = async (key: string, content: any, title?: string) => {
    const { error } = await supabase
        .from('homepage_sections')
        .upsert({
            section_key: key,
            content: content,
            title: title,
            updated_at: new RegExp('now()').test('now()') ? new Date().toISOString() : new Date().toISOString()
        }, { onConflict: 'section_key' });

    if (error) {
        console.error('Error updating homepage section:', error);
        throw error;
    }
};
