-- Add showtimes column to events table
-- Stores an array of time strings e.g., ["10:00", "14:00", "18:00"]
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS showtimes JSONB DEFAULT '[]'::jsonb;

-- Add booking_time column to bookings table
-- Stores the specific time selected for the booking e.g., "14:00"
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS booking_time TEXT;

-- Update bookings query policy to allow reading new column (if strict RLS was used, though standard SELECT * covers it)
-- No action needed for SELECT * policies.
