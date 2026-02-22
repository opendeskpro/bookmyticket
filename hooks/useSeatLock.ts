
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { BookingService } from '../services/api/bookings';

export const useSeatLock = (showId: string, userId: string | undefined) => {
    const [lockedSeats, setLockedSeats] = useState<string[]>([]);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLocking, setIsLocking] = useState(false);

    // Attempt to lock seats
    const lockSeats = useCallback(async (seatIds: string[], totalAmount: number) => {
        if (!userId) {
            setError("User must be logged in to book seats");
            return false;
        }

        setIsLocking(true);
        setError(null);

        try {
            // Call RPC
            const result = await BookingService.lockSeats(userId, showId, seatIds, totalAmount);

            // Check result structure based on RPC return
            // { success: true, booking_id: '...' } OR { success: false, message: '...' }
            // Due to supabase.rpc typings, result.data is the actual return

            // Let's assume the service returns the data part directly
            if (result.success) {
                setLockedSeats(seatIds);
                setBookingId(result.booking_id);
                return true;
            } else {
                setError(result.message || "Failed to lock seats");
                return false;
            }
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsLocking(false);
        }
    }, [showId, userId]);

    return {
        lockedSeats,
        bookingId,
        error,
        isLocking,
        lockSeats
    };
};
