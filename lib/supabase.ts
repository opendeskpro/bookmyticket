
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Organiser Management
export const getOrganizersForAdmin = async () => {
    const { data, error } = await supabase
        .from('organisers')
        .select(`
      *,
      profiles:user_id (full_name, email)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching organizers:', error);
        throw error;
    }
    return data;
};

export const approveOrganizer = async (orgId: string, userId: string) => {
    const { error: orgError } = await supabase
        .from('organisers')
        .update({ status: 'ACTIVE', is_verified: true })
        .eq('id', orgId);

    if (orgError) throw orgError;

    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'ORGANISER' })
        .eq('id', userId);

    if (profileError) throw profileError;
};

export const rejectOrganizer = async (orgId: string) => {
    const { error } = await supabase
        .from('organisers')
        .update({ status: 'SUSPENDED' })
        .eq('id', orgId);

    if (error) throw error;
};

export const getFeaturedOrganizers = async () => {
    const { data, error } = await supabase
        .from('organisers')
        .select('*')
        .eq('status', 'ACTIVE')
        .limit(4);

    if (error) {
        console.error('Error fetching featured organizers:', error);
        return [];
    }
    return data;
};

export const getOrganiserPublicProfile = async (orgId: string) => {
    const { data, error } = await supabase
        .from('organisers')
        .select('*')
        .eq('id', orgId)
        .single();

    if (error) {
        console.error('Error fetching organizer profile:', error);
        return null;
    }
    return data;
};

// Ecommerce & Product Management
export const getProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const createProduct = async (productData: any) => {
    const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Financial Ledger
export const getTransactions = async () => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Profile Management
export const upsertProfile = async (userId: string, email: string, name: string) => {
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email,
            full_name: name,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

    if (error) throw error;
};

// Site Config Management
export const getSiteConfig = async (key: string) => {
    const { data, error } = await supabase
        .from('site_config')
        .select('config_value')
        .eq('section_key', key)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'row not found' error
        console.error('Error fetching site config:', error);
        return null;
    }
    return data?.config_value || null;
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

// Event Categories Management
export const getEventCategories = async () => {
    const { data, error } = await supabase
        .from('event_categories')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
};

export const createEventCategory = async (name: string, icon: string) => {
    const { data, error } = await supabase
        .from('event_categories')
        .insert([{ name, icon, status: 'ACTIVE' }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateEventCategory = async (id: string, updates: any) => {
    const { data, error } = await supabase
        .from('event_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteEventCategory = async (id: string) => {
    const { error } = await supabase
        .from('event_categories')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Events Management
export const getEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(event => ({
        ...event,
        banner: event.banner_url || event.banner,
        date: event.event_date || event.date
    }));
};

export const createEvent = async (eventData: any) => {
    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Fetch the organiser record for this user
    const { data: organiser, error: orgError } = await supabase
        .from('organisers')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (orgError || !organiser) throw new Error("User is not an active organizer");

    // 2. Prepare data
    const payload = {
        ...eventData,
        organiser_id: organiser.id,
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- Bookings & Tickets ---

export const createBooking = async (
    eventId: string,
    seats: any[],
    totalAmount: number,
    bookingTime?: string, // New parameter
    breakdown?: {
        ticketPrice: number,
        platformFee: number,
        internetHandlingFee: number,
        tax: number
    }
) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // 1. Create Booking Record
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
            user_id: user.id,
            event_id: eventId,
            total_amount: totalAmount,
            quantity: seats.length,
            status: 'CONFIRMED',
            booking_time: bookingTime, // Save selected time
            // Add breakdown if provided, otherwise assume totalAmount is ticketPrice (legacy compat)
            ticket_price: breakdown?.ticketPrice || totalAmount,
            platform_fee: breakdown?.platformFee || 0,
            internet_handling_fee: breakdown?.internetHandlingFee || 0,
            tax: breakdown?.tax || 0
        }])
        .select()
        .single();

    if (bookingError) throw bookingError;

    // 2. Create Ticket Records
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

export const getBookedSeats = async (eventId: string) => {
    const { data, error } = await supabase
        .from('tickets')
        .select('seat_row, seat_number')
        .eq('event_id', eventId)
        .eq('status', 'VALID');

    if (error) throw error;
    return data;
};

export const getUserBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            events ( title, event_date, venue, banner_url ),
            tickets ( * )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(booking => ({
        ...booking,
        events: booking.events ? {
            ...booking.events,
            banner: booking.events.banner_url,
            date: booking.events.event_date
        } : null
    }));
};

// --- Profiles ---

export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) return null;
    return data;
};

// Ticket Validation
export const validateTicket = async (code: string) => {
    // 1. Try to find ticket by ID (if code is UUID) or QR code field
    // Assuming code is the ticket ID for simplicity as per current mock usage, 
    // or we might need a specific 'qr_code' column lookup if the code is different.

    // Check if code is a valid UUID
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(code);

    let query = supabase
        .from('tickets')
        .select(`
            *,
            events ( title, start_time, banner_url, venue ),
            bookings ( user_id, profiles:user_id ( full_name ) )
        `)
        .eq('status', 'VALID');

    if (isUuid) {
        query = query.eq('id', code);
    } else {
        query = query.eq('qr_code', code);
    }

    const { data, error } = await query.single();

    if (error || !data) {
        console.error("Ticket validation failed:", error);
        return {
            success: false,
            message: "Invalid or expired ticket"
        };
    }

    // Transform to expected format
    return {
        success: true,
        eventName: data.events?.title || 'Unknown Event',
        attendee: data.bookings?.profiles?.full_name || 'Guest',
        ticketType: data.type || 'Standard',
        checkInTime: new Date().toISOString(),
        venue: data.events?.venue,
        banner: data.events?.banner_url
    };
};
