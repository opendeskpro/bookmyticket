
import { MovieApiConfig } from '../contexts/SiteConfigContext';

export interface Showtime {
    time: string;
    type: string;
}

export interface Movie {
    movie_id: string;
    movie_name: string;
    images?: {
        poster?: {
            [key: string]: {
                url: string;
            };
        };
    };
    synopsis?: string;
    rating?: string;
    release_date?: string;
    runtime?: number;
    showtimes?: Showtime[];
}

const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '0.0.0.0') {
        return '/movieapi';
    }
    return 'https://api-gate2.movieglu.com';
};

const MOCK_MOVIES: Movie[] = [
    {
        movie_id: "1",
        movie_name: "Avatar: The Way of Water",
        rating: "UA",
        runtime: 192,
        images: { poster: { "1": { url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800" } } },
        showtimes: [
            { time: "10:30 AM", type: "3D" },
            { time: "02:15 PM", type: "3D" },
            { time: "06:00 PM", type: "IMAX 3D" },
            { time: "09:45 PM", type: "3D" }
        ]
    },
    {
        movie_id: "2",
        movie_name: "Oppenheimer",
        rating: "A",
        runtime: 180,
        images: { poster: { "1": { url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800" } } },
        showtimes: [
            { time: "11:00 AM", type: "2D" },
            { time: "03:30 PM", type: "2D" },
            { time: "08:00 PM", type: "IMAX 2D" }
        ]
    },
    {
        movie_id: "3",
        movie_name: "Spider-Man: Across the Spider-Verse",
        rating: "U",
        runtime: 140,
        images: { poster: { "1": { url: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800" } } },
        showtimes: [
            { time: "09:00 AM", type: "2D" },
            { time: "12:30 PM", type: "3D" },
            { time: "04:15 PM", type: "2D" },
            { time: "07:45 PM", type: "3D" }
        ]
    },
    {
        movie_id: "4",
        movie_name: "The Dark Knight",
        rating: "UA",
        runtime: 152,
        images: { poster: { "1": { url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800" } } },
        showtimes: [
            { time: "10:00 AM", type: "2D" },
            { time: "01:30 PM", type: "2D" },
            { time: "05:00 PM", type: "IMAX" },
            { time: "09:00 PM", type: "2D" }
        ]
    },
    {
        movie_id: "5",
        movie_name: "Inception",
        rating: "UA",
        runtime: 148,
        images: { poster: { "1": { url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800" } } },
        showtimes: [
            { time: "11:30 AM", type: "2D" },
            { time: "03:00 PM", type: "2D" },
            { time: "06:30 PM", type: "2D" },
            { time: "10:00 PM", type: "2D" }
        ]
    }
];

export const movieService = {
    getHeaders: (config: MovieApiConfig) => {
        return {
            'client': config.client,
            'x-api-key': config.apiKey,
            'Authorization': config.authorization,
            'territory': config.territory,
            'api-version': config.apiVersion,
            'device-datetime': new Date().toISOString(),
            'Date': new Date().toUTCString(),
            'geolocation': '12.97;77.59'
        };
    },

    getNowPlaying: async (config: MovieApiConfig): Promise<Movie[]> => {
        try {
            const response = await fetch(`${getBaseUrl()}/moviesNowPlaying/`, {
                method: 'GET',
                headers: movieService.getHeaders(config) as any
            });

            if (!response.ok) {
                console.warn(`Movieglu API returned ${response.status}. Using high-quality fallback data.`);
                return MOCK_MOVIES;
            }

            const data = await response.json();
            return data.movies && data.movies.length > 0 ? data.movies : MOCK_MOVIES;
        } catch (error) {
            console.warn("Failed to reach Movieglu API. Using fallback data.", error);
            return MOCK_MOVIES;
        }
    },

    getShowtimes: async (config: MovieApiConfig, movieId: string, date: string): Promise<any> => {
        try {
            const response = await fetch(`${getBaseUrl()}/cinemaShowtimes/?movie_id=${movieId}&date=${date}`, {
                method: 'GET',
                headers: movieService.getHeaders(config) as any
            });

            if (!response.ok) throw new Error(`Movieglu API error: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch movie showtimes:", error);
            // Return mock showtimes for the specific movie if available in MOCK_MOVIES
            const mockMovie = MOCK_MOVIES.find(m => m.movie_id === movieId);
            return mockMovie ? { cinmeas: [{ name: "Cinepolis: Nexus Shantiniketan", showtimes: { items: mockMovie.showtimes } }] } : null;
        }
    }
};
