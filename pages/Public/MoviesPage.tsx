import React, { useEffect, useState } from 'react';
import { Clapperboard, Star, Clock, Calendar, ChevronRight, Play, X, MapPin } from 'lucide-react';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { movieService, Movie, Showtime } from '../../lib/movieService';
import Button from '../../components/Shared/UI/Button';

const MoviesPage = () => {
    const { config } = useSiteConfig();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeCity, setActiveCity] = useState("Bangalore");
    const [showCityModal, setShowCityModal] = useState(false);

    const cities = ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Coimbatore", "Kochi"];

    useEffect(() => {
        const savedCity = localStorage.getItem('userCity');
        if (savedCity) setActiveCity(savedCity);
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!config.movieApi) return;
            setLoading(true);
            const data = await movieService.getNowPlaying(config.movieApi);
            setMovies(data);
            setLoading(false);
        };
        fetchMovies();
    }, [config.movieApi]);

    const handleViewShowtimes = (movie: Movie) => {
        setSelectedMovie(movie);
        setShowModal(true);
    };

    const handleCitySelect = (city: string) => {
        setActiveCity(city);
        localStorage.setItem('userCity', city);
        setShowCityModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#FF006E]/20 border-t-[#FF006E] rounded-full animate-spin shadow-[0_0_15px_rgba(255,0,110,0.5)]" />
                <p className="mt-4 text-gray-400 font-bold tracking-widest uppercase text-sm">Launching experience...</p>
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-md bg-[#151515] p-10 rounded-[2rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF006E]/10 blur-3xl rounded-full pointer-events-none -mt-10 -mr-10"></div>
                    <div className="bg-[#FF006E]/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-[#FF006E]/20 shadow-inner">
                        <Clapperboard className="w-10 h-10 text-[#FF006E] drop-shadow-[0_0_10px_rgba(255,0,110,0.5)]" />
                    </div>
                    <h1 className="text-3xl font-black text-white drop-shadow-md">Movies Coming Soon</h1>
                    <p className="text-gray-400 font-medium">
                        We are currently preparing the cinematic experience for you. Please check back later!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0B0B] pb-24">
            {/* Hero Section */}
            <div className="bg-[#111111]/90 backdrop-blur-md border-b border-white/5 pt-12 pb-16 shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#FF006E]/10 to-transparent blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#FF006E]/10 p-2 rounded-xl border border-[#FF006E]/20 shadow-inner">
                            <Clapperboard className="w-5 h-5 text-[#FF006E] drop-shadow-[0_0_5px_rgba(255,0,110,0.5)]" />
                        </div>
                        <span className="text-[#FBB040] font-black text-[10px] uppercase tracking-[0.3em] drop-shadow-[0_0_5px_rgba(251,176,64,0.4)]">Cinematic Discovery</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-md">
                                Now <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB426E] drop-shadow-[0_0_15px_rgba(255,0,110,0.5)]">Playing</span>
                            </h1>
                            <p className="text-gray-400 max-w-xl text-lg font-medium leading-relaxed drop-shadow-sm">
                                Discover the latest global blockbusters showing at flagship theaters in your city.
                            </p>
                        </div>
                        <div
                            onClick={() => setShowCityModal(true)}
                            className="flex items-center gap-4 bg-[#151515] p-2 rounded-2xl border border-white/5 shadow-lg hover:shadow-[0_10px_30px_rgba(251,176,64,0.2)] hover:border-[#FBB040]/30 transition-all cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#FBB040]/10 transition-colors shadow-inner border border-white/5 group-hover:border-[#FBB040]/30">
                                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-[#FBB040] transition-colors drop-shadow-[0_0_5px_rgba(251,176,64,0.3)]" />
                            </div>
                            <div className="pr-4">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active City</p>
                                <p className="text-sm font-black text-white">{activeCity}, IN</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Movies Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    {movies.map((movie) => (
                        <div key={movie.movie_id} className="group cursor-pointer" onClick={() => handleViewShowtimes(movie)}>
                            <div className="relative aspect-[2/3] rounded-[2.5rem] overflow-hidden bg-[#151515] shadow-xl border border-white/5 group-hover:shadow-[0_20px_50px_rgba(255,0,110,0.3)] group-hover:border-[#FF006E]/30 transition-all duration-500 transform group-hover:-translate-y-3">
                                <img
                                    src={movie.images?.poster?.['1']?.url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'}
                                    alt={movie.movie_name}
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/95 via-[#0B0B0B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                    <div className="flex items-center gap-3 mb-4 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                        <div className="bg-gradient-to-br from-[#FF006E] to-[#FB426E] p-4 rounded-2xl shadow-[0_0_20px_rgba(255,0,110,0.5)]">
                                            <Play size={24} className="text-white fill-white" />
                                        </div>
                                        <div className="text-white">
                                            <p className="font-black text-sm tracking-wide drop-shadow-md">VIEW SHOWS</p>
                                            <p className="text-[10px] text-white/60 font-bold tracking-widest">TAP TO EXPLORE</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.8)] border border-white/10 flex items-center gap-1.5 self-start">
                                        <Star size={14} className="text-[#FBB040] fill-[#FBB040] drop-shadow-[0_0_5px_rgba(251,176,64,0.5)]" />
                                        <span className="text-xs font-black text-white">4.8</span>
                                    </div>
                                    <div className="bg-[#FF006E]/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#FF006E]/30 shadow-[0_0_10px_rgba(255,0,110,0.3)] self-start">
                                        <span className="text-[10px] font-black text-[#FF006E] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,0,110,0.3)]">{movie.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 space-y-2 px-2">
                                <h3 className="font-black text-white group-hover:text-[#FF006E] transition-colors leading-tight tracking-tight uppercase text-sm line-clamp-1 drop-shadow-md">{movie.movie_name}</h3>
                                <div className="flex items-center gap-3 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                        <Clock size={12} className="text-[#FF006E]" />
                                        <span className="text-gray-400">{Math.floor(movie.runtime || 135 / 60)}h {movie.runtime ? movie.runtime % 60 : 15}m</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="text-gray-400">Sci-Fi</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* City Selection Modal */}
            {showCityModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowCityModal(false)} />
                    <div className="relative bg-[#151515] w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 p-8">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-[#FBB040]/10 blur-[80px] rounded-full pointer-events-none -mt-32 -ml-32"></div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase drop-shadow-md">Pick Your <span className="text-[#FBB040]">Location</span></h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Discover movies in your region</p>
                            </div>
                            <button onClick={() => setShowCityModal(false)} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            {cities.map(city => (
                                <button
                                    key={city}
                                    onClick={() => handleCitySelect(city)}
                                    className={`p-4 rounded-2xl border transition-all duration-300 text-left group shadow-sm ${activeCity === city
                                        ? 'border-[#FBB040] bg-[#FBB040]/10 shadow-[0_0_15px_rgba(251,176,64,0.2)]'
                                        : 'border-white/5 bg-white/5 hover:border-[#FBB040]/50 hover:bg-[#FBB040]/5 hover:shadow-[0_0_10px_rgba(251,176,64,0.1)]'
                                        }`}
                                >
                                    <p className={`font-black text-sm uppercase tracking-tight ${activeCity === city ? 'text-[#FBB040]' : 'text-gray-300 group-hover:text-white'}`}>{city}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">India</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Showtime Modal */}
            {showModal && selectedMovie && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[#151515] w-full max-w-2xl rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-8 right-8 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#FF006E] hover:border-[#FF006E] hover:shadow-[0_0_20px_rgba(255,0,110,0.5)] transition-all duration-300 z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                            <div className="md:col-span-2 relative aspect-[4/5] md:aspect-auto border-r border-white/5">
                                <img
                                    src={selectedMovie.images?.poster?.['1']?.url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'}
                                    alt={selectedMovie.movie_name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#151515]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent md:hidden" />
                            </div>

                            <div className="md:col-span-3 p-10 space-y-8 flex flex-col justify-center relative">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF006E]/10 blur-[60px] rounded-full pointer-events-none -mt-10 -mr-10"></div>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/5 text-gray-300 text-[10px] font-black uppercase tracking-widest shadow-inner">{selectedMovie.rating}</span>
                                        <span className="px-3 py-1 rounded-lg bg-[#FF006E]/10 border border-[#FF006E]/20 text-[#FF006E] text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(255,0,110,0.2)]">{selectedMovie.runtime || 135} MIN</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-md">{selectedMovie.movie_name}</h2>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Available Showtimes</p>
                                        <p className="text-[11px] font-bold text-[#FBB040] drop-shadow-[0_0_5px_rgba(251,176,64,0.4)]">TODAY, FEB 21</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {(selectedMovie.showtimes || [
                                            { time: "10:30 AM", type: "2D" },
                                            { time: "01:15 PM", type: "IMAX" },
                                            { time: "04:45 PM", type: "3D" },
                                            { time: "08:30 PM", type: "2D" }
                                        ]).map((show, idx) => (
                                            <button key={idx} className="group p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FF006E] hover:bg-[#FF006E]/10 hover:shadow-[0_0_15px_rgba(255,0,110,0.2)] transition-all duration-300 text-left">
                                                <p className="text-sm font-black text-white group-hover:text-[#FF006E] drop-shadow-sm">{show.time}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-gray-300">{show.type}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4 relative z-10 border-t border-white/10 mt-4">
                                    <button className="flex-1 bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,0,110,0.4)] hover:shadow-[0_0_30px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95 transition-all">
                                        Book Tickets Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoviesPage;
