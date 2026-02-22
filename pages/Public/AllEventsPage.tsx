import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar, Filter, Mic2, Trophy, Music, Tv, PartyPopper } from 'lucide-react';
import { Event } from '../../types';
import { Logo } from '../../components/Layout';

interface AllEventsPageProps {
    events: Event[];
}

const AllEventsPage: React.FC<AllEventsPageProps> = ({ events }) => {
    const [searchParams] = useSearchParams();
    const initialCity = searchParams.get('city') || '';
    const initialSearch = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedCity, setSelectedCity] = useState(initialCity);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Sync state with URL params if they change
    useEffect(() => {
        const cityParam = searchParams.get('city');
        const searchParam = searchParams.get('search');
        if (cityParam !== null) setSelectedCity(cityParam);
        if (searchParam !== null) setSearchTerm(searchParam);
    }, [searchParams]);

    const categories = ['All', 'Concert', 'Sports', 'Arts', 'Theatre', 'Comedy'];

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.organizer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = selectedCity ? event.city.toLowerCase() === selectedCity.toLowerCase() : true;
            const matchesCategory = selectedCategory === 'All' ? true : event.category === selectedCategory;

            return matchesSearch && matchesCity && matchesCategory;
        });
    }, [events, searchTerm, selectedCity, selectedCategory]);

    return (
        <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-20">

            {/* Header / Filter Bar */}
            <div className="bg-[#111111]/90 backdrop-blur-md border-b border-white/5 sticky top-[72px] z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="max-w-[1440px] w-[95%] mx-auto py-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <h1 className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">All Events</h1>
                            <span className="text-sm font-bold text-gray-300 bg-white/10 border border-white/5 px-3 py-1 rounded-full shadow-inner">{filteredEvents.length} results</span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1 justify-end">
                            {/* Search */}
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FBB040] transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search events, organizers..."
                                    className="w-full pl-12 pr-4 py-2.5 bg-[#151515] border border-white/5 text-white font-semibold rounded-full outline-none focus:ring-2 focus:ring-[#FBB040] focus:shadow-[0_0_15px_rgba(251,176,64,0.3)] transition-all placeholder:text-gray-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* City Filter */}
                            <div className="relative min-w-[200px] group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF006E] transition-colors" size={18} />
                                <select
                                    className="w-full pl-12 pr-8 py-2.5 bg-[#151515] border border-white/5 text-white font-semibold rounded-full outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#FF006E] focus:shadow-[0_0_15px_rgba(255,0,110,0.3)] transition-all"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                >
                                    <option value="">All Cities</option>
                                    <option value="Coimbatore">Coimbatore</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Kochi">Kochi</option>
                                </select>
                                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>

                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-md ${selectedCategory === cat
                                    ? 'bg-gradient-to-r from-[#FF006E] to-[#FB426E] text-white shadow-[0_0_15px_rgba(255,0,110,0.5)] border border-transparent'
                                    : 'bg-[#151515] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-[1440px] w-[95%] mx-auto mt-10">
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredEvents.map(event => (
                            <Link key={event.id} to={`/event/${event.id}`} className="group bg-[#151515] rounded-[2rem] overflow-hidden border border-white/5 hover:shadow-[0_15px_40px_rgba(251,176,64,0.3)] transition-all duration-500 hover:-translate-y-3 hover:scale-105">
                                <div className="relative h-60 overflow-hidden border-b border-white/5">
                                    <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-[#FBB040] shadow-[0_0_15px_rgba(251,176,64,0.3)] border border-[#FBB040]/30 uppercase">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-extrabold text-white text-xl mb-2 line-clamp-1 group-hover:text-[#FBB040] transition-colors drop-shadow-md">{event.title}</h3>
                                    <p className="text-sm font-medium text-gray-400 line-clamp-2 mb-4 h-10">{event.description}</p>

                                    <div className="flex items-center justify-between text-xs font-bold text-gray-400 border-t border-white/10 pt-4 mt-2">
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                            <Calendar size={14} className="text-[#FF006E]" />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                            <MapPin size={14} className="text-[#FBB040]" />
                                            <span className="truncate max-w-[80px]">{event.city}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-[#151515] rounded-[2rem] border border-white/5 shadow-xl mt-8">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500 shadow-inner border border-white/5">
                            <Search size={40} className="drop-shadow-md" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">No events found</h3>
                        <p className="text-gray-400 font-medium max-w-md">We couldn't find any events matching your current filters. Try adjusting your search or city.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCity(''); setSelectedCategory('All'); }}
                            className="mt-8 text-[#FF006E] font-bold tracking-wide hover:text-[#FBB040] transition-colors border-b-2 border-transparent hover:border-[#FBB040] pb-1 uppercase"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AllEventsPage;
