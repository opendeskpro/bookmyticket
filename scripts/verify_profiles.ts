
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkzqfjsdrrreiaitvjdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrenFmanNkcnJyZWlhaXR2amRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjcyNTQsImV4cCI6MjA4NjgwMzI1NH0.ksNhTGHU-sywyQSlTU_tOuYngtaPCLNY7RJgwBlwPKk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyProfiles() {
    console.log('Verifying profiles table...');
    const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.log(`Profiles table exists (status: success).`);
    }
}

verifyProfiles();
