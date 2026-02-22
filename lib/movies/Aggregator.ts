import { MovieProvider, AggregatedMovie } from './types';
import { LocalProvider } from './LocalProvider';
import { BookMyShowProvider, PaytmProvider } from './MockProviders';

class MovieAggregatorService {
    private providers: MovieProvider[] = [];

    constructor() {
        // Register providers here
        this.providers.push(new LocalProvider());
        this.providers.push(new BookMyShowProvider());
        this.providers.push(new PaytmProvider());
    }

    async getAllMovies(query?: string): Promise<AggregatedMovie[]> {
        const promises = this.providers.map(async (provider) => {
            try {
                const movies = await provider.searchMovies(query);
                return movies.map(movie => ({
                    ...movie,
                    source: provider.name,
                    sourceIcon: provider.icon,
                    // Mock deeplink for external providers
                    externalUrl: provider.id !== 'local' ? `https://example.com/${provider.id}/movie/${movie.id}` : undefined
                }));
            } catch (error) {
                console.error(`Failed to fetch from ${provider.name}:`, error);
                return [];
            }
        });

        const results = await Promise.all(promises);
        // Flatten results
        return results.flat();
    }
}

export const movieAggregator = new MovieAggregatorService();
