import React, { useState } from 'react';
import { X, Search, Target, ChevronDown } from 'lucide-react';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (city: string) => void;
    currentCity: string;
}

const countries = [
    { name: 'India', flag: '🇮🇳' },
    { name: 'UAE', flag: '🇦🇪' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'Malaysia', flag: '🇲🇾' },
    { name: 'Thailand', flag: '🇹🇭' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'United States', flag: '🇺🇸' },
];

const cities = [
    { name: 'Bengaluru', icon: '🏛️' },
    { name: 'Chennai', icon: '🕍' },
    { name: 'Coimbatore', icon: '🏘️' },
    { name: 'Hyderabad', icon: '🕌' },
    { name: 'Kochi', icon: '🛶' },
    { name: 'Kolkata', icon: '🌉' },
    { name: 'New Delhi', icon: '🏛️' },
    { name: 'Mumbai', icon: '🏙️' },
];

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSelect, currentCity }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCountry, setActiveCountry] = useState('India');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between relative">
                        <h2 className="text-2xl font-bold text-[#484848] w-full text-center">Select Your Location to Continue</h2>
                        <button
                            onClick={onClose}
                            className="absolute right-0 text-[#767676] hover:text-[#ff5862] transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#767676] group-focus-within:text-[#ff5862] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search city"
                            value={searchTerm || currentCity}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-20 py-5 bg-[#f9fafb] border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff5862]/10 focus:bg-white transition-all text-lg font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="text-[#767676] hover:text-[#484848]">
                                    <X size={18} />
                                </button>
                            )}
                            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-black/5 text-[#ff5862] font-semibold text-sm hover:bg-[#ff5862]/5 transition-colors">
                                <Target size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Countries */}
                    <div className="flex flex-wrap gap-3">
                        {countries.map((country) => (
                            <button
                                key={country.name}
                                onClick={() => setActiveCountry(country.name)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all font-semibold text-sm ${activeCountry === country.name
                                        ? 'bg-[#ff5862]/10 border-[#ff5862] text-[#ff5862]'
                                        : 'border-black/5 text-[#767676] hover:border-[#ff5862]/30'
                                    }`}
                            >
                                <span>{country.flag}</span>
                                {country.name}
                            </button>
                        ))}
                    </div>

                    {/* Cities Grid */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-[#767676] uppercase tracking-wider">Popular Cities</h3>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                            {cities.map((city) => (
                                <button
                                    key={city.name}
                                    onClick={() => {
                                        onSelect(city.name);
                                        onClose();
                                    }}
                                    className="flex flex-col items-center gap-3 group"
                                >
                                    <div className={`w-full aspect-square rounded-2xl border flex items-center justify-center text-3xl transition-all group-hover:scale-110 shadow-sm ${currentCity === city.name
                                            ? 'border-[#ff5862] bg-[#ff5862]/5 ring-4 ring-[#ff5862]/10'
                                            : 'border-black/5 bg-[#f9fafb] group-hover:bg-white group-hover:border-[#ff5862]/30'
                                        }`}>
                                        {city.icon}
                                    </div>
                                    <span className={`text-[13px] font-bold text-center transition-colors ${currentCity === city.name ? 'text-[#ff5862]' : 'text-[#767676] group-hover:text-[#484848]'
                                        }`}>{city.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex justify-center">
                        <button className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-[#f9fafb] border border-black/5 text-[#767676] font-bold text-sm hover:bg-white hover:border-[#ff5862]/30 transition-all">
                            <Target size={18} className="text-[#ff5862]" />
                            Events in other cities
                            <ChevronDown size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
