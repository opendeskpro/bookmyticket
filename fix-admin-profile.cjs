const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Manually parse .env
const env = fs.readFileSync('.env', 'utf8')
    .split('\n')
    .reduce((acc, line) => {
        const [key, ...vals] = line.split('=');
        if (key && vals.length > 0) acc[key.trim()] = vals.join('=').trim();
        return acc;
    }, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing env vars in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function ensureAdminProfile() {
    console.log("Signing in as admin...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'v.raja2mail@gmail.com',
        password: 'A@123b@123'
    });

    if (authError) {
        console.error("Auth Error:", authError);
        return;
    }

    const userId = authData.user.id;
    console.log("Logged in. User ID:", userId);

    // Upsert profile
    console.log("Upserting profile...");
    const { data, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            full_name: 'Admin User',
            email: 'v.raja2mail@gmail.com',
            role: 'ADMIN'
        })
        .select();

    if (upsertError) {
        console.error("Upsert Error:", upsertError);
    } else {
        console.log("Profile ensured:", data);
    }
}

ensureAdminProfile();
