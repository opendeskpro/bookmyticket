const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid missing 'dotenv' dependency
const envPath = path.resolve(process.cwd(), '.env.local');
const envVars = {};

if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        if (!line.trim() || line.startsWith('#')) continue;
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            let val = valueParts.join('=').trim();
            // Remove surrounding quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.substring(1, val.length - 1);
            }
            envVars[key.trim()] = val;
        }
    }
}

const supabaseUrl = envVars.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local or environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdminOrganizer() {
    console.log("Adding TEST organizer bypassing RLS...");
    try {
        const { data, error } = await supabase
            .from('organisers')
            .insert([{
                name: "Test Admin Added Org",
                email: "admin.added@example.com",
                phone: "+1 555 123 4567",
                status: "ACTIVE"
            }]);

        if (error) {
            console.error("Error inserting organizer:", error.message);
        } else {
            console.log("Successfully inserted organizer:", data);
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

addAdminOrganizer();
