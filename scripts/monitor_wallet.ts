
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tkzqfjsdrrreiaitvjdo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrenFmanNkcnJyZWlhaXR2amRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjcyNTQsImV4cCI6MjA4NjgwMzI1NH0.ksNhTGHU-sywyQSlTU_tOuYngtaPCLNY7RJgwBlwPKk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function monitorWallet() {
    console.log('🔍 Finding an event to monitor...');

    const { data: events, error: eventError } = await supabase
        .from('events')
        .select('id, title, owner_id')
        .limit(1);

    if (eventError || !events || events.length === 0) {
        console.error('❌ No events found.');
        process.exit(1);
    }

    const event = events[0];
    const organizerId = event.owner_id;
    console.log(`✅ Event: "${event.title}"`);
    console.log(`👤 Organizer ID: ${organizerId}`);

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', organizerId)
        .single();

    if (error) {
        console.error('❌ Error fetching profile:', error.message);
        process.exit(1);
    }

    console.log(`💰 Current Wallet Balance: ₹${profile.wallet_balance || 0}`);
    console.log(`👉 Please book a ticket for "${event.title}" now.`);
}

monitorWallet().catch(console.error);
