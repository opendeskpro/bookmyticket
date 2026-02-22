import React from 'react';
import { Seat } from '../../types'; // Ensure Seat type is available or mock it here locally if strictly UI focused

// Mock seat layout for a single row length of 10
const ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = 10;

interface SeatMapProps {
    selectedSeats: string[];
    onSeatClick: (seatId: string) => void;
    price: number;
}

const SeatMap: React.FC<SeatMapProps> = ({ selectedSeats, onSeatClick, price }) => {
    const getSeatStatus = (seatId: string) => {
        if (selectedSeats.includes(seatId)) return 'selected';
        // Randomly mock some booked seats for demo
        if (['A5', 'B3', 'C8'].includes(seatId)) return 'booked';
        return 'available';
    };

    return (
        <div className="w-full overflow-x-auto pb-8">
            {/* Screen Visual */}
            <div className="w-3/4 mx-auto mb-12">
                <div className="h-2 bg-gray-300 rounded-lg shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] transform perspective-500 rotate-x-12"></div>
                <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-widest">Screen this way</p>
            </div>

            <div className="flex flex-col gap-3 items-center min-w-[600px]">
                {ROWS.map(row => (
                    <div key={row} className="flex items-center gap-8">
                        <span className="w-6 text-center text-gray-400 font-medium text-sm">{row}</span>
                        <div className="flex gap-2">
                            {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                                const seatNum = i + 1;
                                const seatId = `${row}${seatNum}`;
                                const status = getSeatStatus(seatId);

                                return (
                                    <button
                                        key={seatId}
                                        disabled={status === 'booked'}
                                        onClick={() => onSeatClick(seatId)}
                                        className={`
                      w-8 h-8 rounded-t-lg transition-all text-[10px] font-bold flex items-center justify-center
                      ${status === 'selected' ? 'bg-[#FF006E] text-white shadow-lg ring-2 ring-[#FF006E] ring-offset-2' : ''}
                      ${status === 'booked' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''}
                      ${status === 'available' ? 'bg-white border border-gray-300 text-gray-600 hover:border-[#FF006E] hover:text-[#FF006E]' : ''}
                    `}
                                        title={`${status === 'booked' ? 'Booked' : `Seat ${seatId} - ₹${price}`}`}
                                    >
                                        {seatNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-12 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-white border border-gray-300"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#FF006E]"></div>
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-gray-200"></div>
                    <span>Booked</span>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
