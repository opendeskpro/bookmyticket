import { supabase } from '../supabase';
import { Movie } from '../../types';
import { MovieProvider } from './types';

export class LocalProvider implements MovieProvider {
    id = 'local';
    name = 'BookMyTicket';
    icon = '/logo.png'; // Local app logo

    async searchMovies(query?: string): Promise<Movie[]> {
        let queryBuilder = supabase
            .from('movies')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (query) {
            queryBuilder = queryBuilder.ilike('title', `%${query}%`);
        }

        const { data, error } = await queryBuilder;
        if (error) {
            console.error('Local movie fetch failed:', error);
            return [];
        }
        return data || [];
    }

    async getMovieDetails(id: string): Promise<Movie | null> {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    }
}
