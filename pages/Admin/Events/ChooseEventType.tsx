import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Cloud, MapPin } from 'lucide-react';

interface ChooseEventTypeProps {
    onSelect: (type: 'online' | 'venue') => void;
}

const ChooseEventType: React.FC<ChooseEventTypeProps> = ({ onSelect }) => {
    const { theme } = useTheme();

    return (
        <div className={`p-10 h-full flex flex-col animate-in fade-in duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>

            <div className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight">Choose Event Type</h2>
                <div className="flex items-center gap-2 text-xs font-medium opacity-50 mt-2 uppercase tracking-wider">
                    <span>Event Management</span>
                    <span>/</span>
                    <span>Choose Event Type</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full flex-1 max-h-[500px]">

                {/* Online Event Card */}
                <button
                    onClick={() => onSelect('online')}
                    className={`group relative flex flex-col items-center justify-center gap-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${theme === 'dark'
                            ? 'bg-[#1e2736] border-white/5 hover:bg-[#1e2736]/80'
                            : 'bg-white border-slate-200 shadow-xl hover:shadow-2xl'
                        }`}
                >
                    <div className="w-24 h-24 rounded-2xl bg-[#22c55e] flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                        <Cloud size={48} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-widest text-[#22c55e]">Online Event</h3>
                    <p className="text-xs font-medium opacity-50 max-w-[200px] text-center">
                        Create an event that takes place virtually via a streaming link.
                    </p>
                </button>

                {/* Venue Event Card */}
                <button
                    onClick={() => onSelect('venue')}
                    className={`group relative flex flex-col items-center justify-center gap-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${theme === 'dark'
                            ? 'bg-[#1e2736] border-white/5 hover:bg-[#1e2736]/80'
                            : 'bg-white border-slate-200 shadow-xl hover:shadow-2xl'
                        }`}
                >
                    <div className="w-24 h-24 rounded-2xl bg-[#f97316] flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                        <MapPin size={48} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-widest text-[#f97316]">Venue Event</h3>
                    <p className="text-xs font-medium opacity-50 max-w-[200px] text-center">
                        Create an event that takes place at a physical location.
                    </p>
                </button>

            </div>
        </div>
    );
};

export default ChooseEventType;
