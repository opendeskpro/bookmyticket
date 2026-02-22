import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Manual env parsing
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.join('=').trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLogo() {
    console.log('Updating logo URL in site_config...');

    const { data, error } = await supabase
        .from('site_config')
        .upsert({
            section_key: 'brand_assets',
            config_value: { logo_url: '/logo.jpeg', site_name: 'BookMyTicket' }
        }, { onConflict: 'section_key' });

    if (error) {
        console.error('Error updating config:', error);
        process.exit(1);
    }

    console.log('Logo URL updated successfully!');
}

updateLogo();
