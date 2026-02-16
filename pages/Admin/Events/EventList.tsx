import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, Filter, Calendar, MapPin, Video, MoreVertical, Plus } from 'lucide-react';

interface EventListProps {
    type: 'all' | 'online' | 'venue';
    onAddEvent: (type?: 'online' | 'venue') => void;
}

const EventList: React.FC<EventListProps> = ({ type, onAddEvent }) => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddDropdown, setShowAddDropdown] = useState(false);

    const getTitle = () => {
        switch (type) {
            case 'online': return 'Online Events';
            case 'venue': return 'Venue Events';
            default: return 'All Events';
        }
    };

    return (
        <div className={`p-6 animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{getTitle()}</h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Manage your {type === 'all' ? '' : type} events here.
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowAddDropdown(!showAddDropdown)}
                        onBlur={() => setTimeout(() => setShowAddDropdown(false), 200)}
                        className="bg-[#2563eb] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={18} /> Add Event
                    </button>

                    {showAddDropdown && (
                        <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#1e2736] border-gray-700' : 'bg-white border-slate-200'}`}>
                            <button
                                onClick={() => onAddEvent('online')}
                                className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}
                            >
                                <span>Online Event</span>
                            </button>
                            <button
                                onClick={() => onAddEvent('venue')}
                                className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}
                            >
                                <span>Venue Event</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row gap-4 ${theme === 'dark' ? 'bg-[#1e2736] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="relative flex-1 max-w-md">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`} size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-[#2563eb] outline-none transition-all ${theme === 'dark'
                            ? 'bg-[#131922] border-gray-700 text-white placeholder:text-gray-600'
                            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                            }`}
                    />
                </div>
                <button className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-[#131922] border-gray-700 text-gray-300 hover:bg-gray-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <Filter size={16} /> Filter
                </button>
            </div>

            {/* Placeholder Content */}
            <div className={`rounded-xl border border-dashed flex flex-col items-center justify-center py-20 ${theme === 'dark' ? 'border-gray-700 bg-[#1e2736]/20' : 'border-slate-300 bg-slate-50'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-[#131922]' : 'bg-white'}`}>
                    <Calendar size={32} className="opacity-20" />
                </div>
                <h3 className="text-lg font-bold mb-2">No Events Found</h3>
                <p className="text-sm opacity-50 max-w-xs text-center mb-6">
                    You haven't created any {type === 'all' ? '' : type} events yet. Click the button above to create your first event.
                </p>
            </div>

        </div>
    );
};

export default EventList;
