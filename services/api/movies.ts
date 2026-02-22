
import { supabase } from '../../lib/supabase';
import { Movie, Show, Theater } from '../../types';

export const MovieService = {
    // Fetch all active movies
    getAllMovies: async (): Promise<Movie[]> => {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .eq('is_active', true)
            .order('release_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get movie details
    getMovieById: async (id: string): Promise<Movie | null> => {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Get shows for a movie in a specific city
    getShowsByMovieAndCity: async (movieId: string, cityId: string, date: string): Promise<Show[]> => {
        // This requires a join across theaters -> screens -> shows
        // For simplicity in Supabase, we often filter on client or use a view. 
        // Here we'll fetch shows and filter, or assuming we have a flat structure/view.
        // Let's use a direct query assuming relations are set up.

        // Improved Query: Get shows where the screen belongs to a theater in the city
        const { data, error } = await supabase
            .from('shows')
            .select(`
        *,
        screen:screens (
          *,
          theater:theaters (
            *,
            city:cities (*)
          )
        )
      `)
            .eq('movie_id', movieId)
            .gte('start_time', `${date}T00:00:00`)
            .lt('start_time', `${date}T23:59:59`)
            .eq('is_active', true);

        if (error) throw error;

        // Filter by city client-side if deep filtering is hard in one go, 
        // but the above select should allow us to filter if we use !inner on the join.
        // For now, let's filter client side for safety and ease.
        const cityShows = data?.filter((show: any) => show.screen?.theater?.city_id === cityId) || [];

        return cityShows;
    },

    // Get seat layout for a show (via screen -> seats)
    getShowSeating: async (showId: string) => {
        // 1. Get Show info to know the screen
        const { data: show, error: showError } = await supabase
            .from('shows')
            .select('screen_id')
            .eq('id', showId)
            .single();

        if (showError || !show) throw showError || new Error("Show not found");

        // 2. Get Seats for that screen
        const { data: seats, error: seatsError } = await supabase
            .from('seats')
            .select(`
        *,
        tier:seat_tiers (*)
      `)
            .eq('screen_id', show.screen_id)
            .order('row_label')
            .order('seat_number');

        if (seatsError) throw seatsError;

        // 3. Get Booked/Locked Status
        // We can call the verify_availability function or just query booking_seats directly
        const { data: bookedSeats, error: bookingError } = await supabase
            .from('booking_seats')
            .select('seat_id')
            .eq('booking_id', showId); // This logic is wrong, booking_seats links to booking, not show. 
        // Need to find bookings for this show first.

        // Correct approach for status:
        const { data: bookings } = await supabase
            .from('bookings')
            .select('id, status, expires_at')
            .eq('show_id', showId)
            .in('status', ['confirmed', 'pending']);

        const activeBookingIds = bookings
            ?.filter(b => b.status === 'confirmed' || (b.status === 'pending' && new Date(b.expires_at) > new Date()))
            .map(b => b.id) || [];

        let occupiedSeatIds = new Set<string>();
        if (activeBookingIds.length > 0) {
            const { data: occupied } = await supabase
                .from('booking_seats')
                .select('seat_id')
                .in('booking_id', activeBookingIds);

            occupied?.forEach(s => occupiedSeatIds.add(s.seat_id));
        }

        return seats.map(seat => ({
            ...seat,
            status: occupiedSeatIds.has(seat.id) ? 'booked' : 'available',
            price: seat.tier.price,
            tier_name: seat.tier.name
        }));
    }
};
