import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tkzqfjsdrrreiaitvjdo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrenFmanNkcnJyZWlhaXR2amRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjcyNTQsImV4cCI6MjA4NjgwMzI1NH0.ksNhTGHU-sywyQSlTU_tOuYngtaPCLNY7RJgwBlwPKk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log('Checking connection to Supabase...');

    // 1. Check Organizers Table
    try {
        const { data: organizers, error: orgError } = await supabase.from('organisers').select('id').limit(1);

        if (orgError) {
            console.error('❌ ERROR: Table "organisers" does not exist or not accessible.');
            console.error('👉 ACTION REQUIRED: Run "lib/seed_demo_data.sql" in Supabase SQL Editor.');
        } else {
            console.log('✅ Table "organisers" exists.');
            if (organizers && organizers.length > 0) {
                console.log('ℹ️ Data already exists in "organisers".');
            } else {
                console.warn('⚠️ Table exists but is empty. Run SQL script to seed data.');
            }
        }
    } catch (e) {
        console.error('Unexpected warning checking organizers (proceeding anyway):', e);
    }

    // 3. Update Site Config (This usually doesn't require foreign keys to auth)
    console.log('🔄 Updating Site Config...');
    const { error: configError } = await supabase.from('site_config').upsert({
        section_key: 'homepage',
        config_value: {
            hero: {
                title1: 'Experience the',
                title2: 'Best Events',
                subtitle: 'Discover and book tickets for the hottest events in town.',
                bgVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ', // Placeholder
                searchPlaceholder: 'Search for movies, events, sports...',
                stats: [{ label: 'Concert', value: '20+' }]
            },
            whyBookWithUs: {
                visible: true,
                title: 'Why Book with BookMyTicket? 🎟️',
                subtitle: 'We make your booking experience smooth, secure, and hassle-free.',
                image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=1000',
                items: [
                    { id: '1', title: 'Curated Events', description: 'Handpicked experiences.', icon: 'Sparkles', color: 'bg-purple-100 text-purple-600' },
                    { id: '2', title: 'Safe & Secure', description: 'Encrypted payments.', icon: 'ShieldCheck', color: 'bg-blue-100 text-blue-600' },
                    { id: '3', title: 'Instant Confirmation', description: 'No waiting.', icon: 'Zap', color: 'bg-emerald-100 text-emerald-600' }
                ]
            },
            features: { visible: false } // Disable old features
        }
    });

    if (configError) {
        console.error('❌ Error updating site_config:', configError.message);
    } else {
        console.log('✅ Site Config updated successfully! Refresh your homepage.');
    }
}

main().catch(console.error);
