import { Movie } from '../../types';

export interface MovieProvider {
    id: string;
    name: string;
    icon: string; // URL or simplified name

    searchMovies(query?: string): Promise<Movie[]>;
    getMovieDetails(id: string): Promise<Movie | null>;
}

export interface AggregatedMovie extends Movie {
    source: string;
    sourceIcon: string;
    externalUrl?: string; // For deeplinking
}
