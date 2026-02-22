
import React from 'react';
import { useBookingTimer } from '../../../hooks/useBookingTimer';

interface BookingSummaryProps {
    selectedSeats: any[]; // Replace with Seat type
    totalAmount: number;
    onProceed: () => void;
    isProcessing: boolean;
    onTimeout: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ selectedSeats, totalAmount, onProceed, isProcessing, onTimeout }) => {
    const { formatTime } = useBookingTimer(5, onTimeout);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-fit sticky top-24">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Booking Summary</h3>
                <div className="text-red-500 font-mono font-bold bg-red-50 px-3 py-1 rounded-lg">
                    {formatTime()} left
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{selectedSeats.length} Seats Selected</span>
                    <span>{selectedSeats.map(s => `${s.row_label}${s.seat_number}`).join(', ')}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-gray-800 pt-4 border-t border-gray-100">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Convenience Fee (18%)</span>
                    <span>₹{(totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 pt-4 border-t border-dashed border-gray-300">
                    <span>Total Payable</span>
                    <span>₹{(totalAmount * 1.18).toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onProceed}
                disabled={isProcessing || selectedSeats.length === 0}
                className={`
          w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all
          ${isProcessing || selectedSeats.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#FF006E] hover:bg-[#ff385c] hover:shadow-[#FF006E]/30 active:scale-95'}
        `}
            >
                {isProcessing ? 'Processing...' : 'Proceed to Pay'}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
                By proceeding, you agree to our Terms & Conditions
            </p>
        </div>
    );
};

export default BookingSummary;
