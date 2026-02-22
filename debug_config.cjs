
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env manually to avoid dotenv dependency issues in one-liners
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase
        .from('site_config')
        .select('*');

    if (error) {
        console.error('Error fetching:', error);
    } else {
        console.log('SITE_CONFIG_DATA_START');
        console.log(JSON.stringify(data, null, 2));
        console.log('SITE_CONFIG_DATA_END');
    }
}

check();
