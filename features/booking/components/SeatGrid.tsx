
import React, { useState, useEffect } from 'react';
import { Seat } from '../../../types';

interface SeatGridProps {
    seats: Seat[];
    selectedSeatIds: string[];
    onSeatSelect: (seatId: string) => void;
    maxSelectable?: number;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, selectedSeatIds, onSeatSelect, maxSelectable = 6 }) => {
    // Group seats by row for rendering
    const rows = React.useMemo(() => {
        const grouped: Record<string, Seat[]> = {};
        seats.forEach(seat => {
            if (!grouped[seat.row_label]) {
                grouped[seat.row_label] = [];
            }
            grouped[seat.row_label].push(seat);
        });
        // Sort rows alphabetically
        return Object.keys(grouped).sort().map(rowLabel => ({
            label: rowLabel,
            seats: grouped[rowLabel].sort((a, b) => a.seat_number - b.seat_number)
        }));
    }, [seats]);

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'booked' || seat.status === 'locked') return;

        // Toggle selection
        onSeatSelect(seat.id);
    };

    const getSeatColor = (seat: Seat) => {
        if (seat.status === 'booked') return 'bg-gray-300 cursor-not-allowed';
        if (seat.status === 'locked') return 'bg-yellow-300 cursor-not-allowed'; // Someone else is booking
        if (selectedSeatIds.includes(seat.id)) return 'bg-green-500 text-white'; // Selected by me

        // Tier based colors
        if (seat.tier_name === 'Gold') return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
        if (seat.tier_name === 'Premier') return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
        return 'bg-white hover:bg-gray-100 border-gray-300';
    };

    return (
        <div className="flex flex-col items-center w-full overflow-x-auto p-8 bg-gray-50 rounded-xl">
            {/* Screen */}
            <div className="w-full max-w-3xl mb-12">
                <div className="h-2 bg-gray-300 w-full rounded-t-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] mb-2"></div>
                <p className="text-center text-xs text-gray-400 uppercase tracking-widest">Screen this way</p>
            </div>

            {/* Grid */}
            <div className="space-y-4">
                {rows.map(row => (
                    <div key={row.label} className="flex items-center gap-4">
                        <div className="w-6 text-sm font-bold text-gray-400">{row.label}</div>
                        <div className="flex gap-2">
                            {row.seats.map(seat => (
                                <button
                                    key={seat.id}
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={seat.status === 'booked' || seat.status === 'locked'}
                                    className={`
                    w-8 h-8 rounded-t-lg text-xs font-medium border transition-all
                    ${getSeatColor(seat)}
                    ${seat.is_aisle ? 'mr-4' : ''}
                  `}
                                >
                                    {seat.seat_number}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-12 text-sm text-gray-600">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-300 rounded"></div> Booked</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Selected</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-gray-300 rounded"></div> Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div> Gold</div>
            </div>
        </div>
    );
};

export default SeatGrid;
