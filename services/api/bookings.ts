
import { supabase } from '../../lib/supabase';
import { Booking } from '../../types';

export const BookingService = {
    // Lock seats for 5-10 minutes
    lockSeats: async (userId: string, showId: string, seatIds: string[], totalAmount: number) => {
        // Call the RPC function 'lock_seats'
        const { data, error } = await supabase
            .rpc('lock_seats', {
                p_user_id: userId,
                p_show_id: showId,
                p_seat_ids: seatIds,
                p_total_amount: totalAmount
            });

        if (error) throw error;
        return data; // { success: true, booking_id: '...' }
    },

    // Get booking details
    getBooking: async (bookingId: string): Promise<Booking | null> => {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        show:shows (
          start_time,
          movie:movies (title, poster_url),
          screen:screens (name, theater:theaters(name, address))
        ),
        seats:booking_seats (
          price,
          seat:seats (row_label, seat_number, tier:seat_tiers(name))
        )
      `)
            .eq('id', bookingId)
            .single();

        if (error) throw error;
        return data;
    },

    // Confirm booking (Pre-payment intent or finalization)
    initializePayment: async (bookingId: string) => {
        // In a real app, this calls an Edge Function to talk to Stripe/Razorpay
        // For now, let's simulate by returning a dummy intent
        return {
            clientSecret: "mock_secret_" + bookingId,
            amount: 500 // Should fetch from booking
        };
    },

    // Finalize booking after payment success
    confirmBooking: async (bookingId: string, paymentId: string) => {
        const { data, error } = await supabase
            .from('bookings')
            .update({
                status: 'confirmed',
                payment_intent_id: paymentId,
                booking_code: `BMT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
            })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Cancel / Release seats
    cancelBooking: async (bookingId: string) => {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);

        if (error) throw error;
    }
};
