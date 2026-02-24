const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
const envVars = {};
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        if (!line.trim() || line.startsWith('#')) continue;
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            let val = valueParts.join('=').trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.substring(1, val.length - 1);
            }
            envVars[key.trim()] = val;
        }
    }
}

const supabaseUrl = envVars.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addOrganizerWithAuth() {
    console.log("Using Anon Key with a real email format...");

    const email = "test.admin2@gmail.com";

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: "securePassword123!",
        options: {
            data: { full_name: "Test Admin Organizer 2", role: "ORGANISER" }
        }
    });

    if (authError) {
        console.error("Auth User Creation Error via signUp:", authError);
        return;
    }

    console.log("Auth User Created! ID:", authData.user?.id);

    // Give the database trigger a second to run
    await new Promise(r => setTimeout(r, 2000));

    // Check if it got into the table
    const { data: orgData, error: orgError } = await supabase.from('organisers').select('*').eq('email', email);
    if (orgError) {
        console.error("Failed to fetch organisers table:", orgError);
    } else {
        if (orgData && orgData.length > 0) {
            console.log("SUCCESS! Organiser profile found in table natively via trigger:", orgData[0]);
            return;
        }
    }

    console.log("Trigger didn't work for organisers table. Trying explicit insert...");

    if (authData.session) {
        console.log("Session obtained. Assuming user identity to insert.");
        const authedSupabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: `Bearer ${authData.session.access_token}` } }
        });
        const { error: manualOrgError } = await authedSupabase.from('organisers').insert([{
            user_id: authData.user.id,
            name: "Test Admin Organizer 2",
            email: email,
            phone: "+1234567890",
            status: "ACTIVE"
        }]);
        if (manualOrgError) {
            console.error("Manual Organization Profile Creation Error (RLS likely blocking):", manualOrgError);
        } else {
            console.log("Organizer Profile created manually with explicit session token.");
        }
    } else {
        console.log("No session returned. Email confirmation might be required.");
    }
}

addOrganizerWithAuth();
