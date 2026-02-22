
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkzqfjsdrrreiaitvjdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrenFmanNkcnJyZWlhaXR2amRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjcyNTQsImV4cCI6MjA4NjgwMzI1NH0.ksNhTGHU-sywyQSlTU_tOuYngtaPCLNY7RJgwBlwPKk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyMovies() {
    console.log('Verifying movies table...');
    const { data, error } = await supabase
        .from('movies')
        .select('*');

    if (error) {
        console.error('Error fetching movies:', error);
    } else {
        console.log(`Found ${data.length} movies.`);
        if (data.length > 0) {
            console.log('Sample data:', data[0]);
        } else {
            console.log('No movies found. The table is empty.');
        }
    }
}

verifyMovies();
