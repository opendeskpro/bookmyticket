import { Movie } from '../../types';
import { MovieProvider } from './types';

// Mock Data for BookMyShow
const BMS_MOVIES: Movie[] = [
    {
        id: 'bms_1',
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
        poster_url: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        duration_minutes: 166,
        language: ['English', 'Hindi'],
        genre: ['Sci-Fi', 'Adventure'],
        release_date: '2024-03-01',
        is_active: true,
        rating: 4.8
    },
    {
        id: 'bms_2',
        title: 'Kung Fu Panda 4',
        description: 'Po is gearing up to become the Spiritual Leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.',
        poster_url: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
        duration_minutes: 94,
        language: ['English'],
        genre: ['Animation', 'Action'],
        release_date: '2024-03-08',
        is_active: true,
        rating: 4.5
    }
];

// Mock Data for Paytm
const PAYTM_MOVIES: Movie[] = [
    {
        id: 'paytm_1',
        title: 'Shaitaan',
        description: 'A timeless battle between good and evil with a family embodying the forces of righteousness while a man symbolizes malevolence.',
        poster_url: 'https://upload.wikimedia.org/wikipedia/en/3/35/Shaitaan_2024_film_poster.jpg',
        duration_minutes: 132,
        language: ['Hindi'],
        genre: ['Horror', 'Thriller'],
        release_date: '2024-03-08',
        is_active: true,
        rating: 4.2
    }
];

export class BookMyShowProvider implements MovieProvider {
    id = 'bookmyshow';
    name = 'BookMyShow';
    icon = 'https://in.bmscdn.com/webin/common/icons/bms.svg'; // Placeholder or local asset

    async searchMovies(query?: string): Promise<Movie[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return BMS_MOVIES;
    }

    async getMovieDetails(id: string): Promise<Movie | null> {
        return BMS_MOVIES.find(m => m.id === id) || null;
    }
}

export class PaytmProvider implements MovieProvider {
    id = 'paytm';
    name = 'Paytm Movies';
    icon = 'https://assetscdn1.paytm.com/images/catalog/view/310944/1697527183231.png';

    async searchMovies(query?: string): Promise<Movie[]> {
        await new Promise(resolve => setTimeout(resolve, 600));
        return PAYTM_MOVIES;
    }

    async getMovieDetails(id: string): Promise<Movie | null> {
        return PAYTM_MOVIES.find(m => m.id === id) || null;
    }
}
