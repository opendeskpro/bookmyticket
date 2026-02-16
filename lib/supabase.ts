
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

// Ticket Validation
export const validateTicket = async (code: string) => {
    // Mock logic updated to look for a real booking/ticket once DB is ready
    console.log('Validating ticket:', code);
    return {
        success: true,
        eventName: 'Exclusive Music Festival',
        attendee: 'John Doe',
        ticketType: 'VIP ELITE',
        checkInTime: new Date().toISOString()
    };
};
