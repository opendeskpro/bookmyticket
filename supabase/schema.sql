-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES ENUM
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- 1. PROFILES (Extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CITIES
CREATE TABLE cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MOVIES
CREATE TABLE movies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  cover_url TEXT,
  trailer_url TEXT,
  language TEXT[], -- e.g. ['Hindi', 'English']
  genre TEXT[], -- e.g. ['Action', 'Drama']
  duration_minutes INTEGER NOT NULL,
  release_date DATE NOT NULL,
  rating DECIMAL(3, 1), -- e.g. 8.5
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. THEATERS (Owned by Admins)
CREATE TABLE theaters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  city_id UUID REFERENCES cities(id) NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  facilities TEXT[], -- e.g. ['Dolby Atmos', 'Parking']
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SCREENS
CREATE TABLE screens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  theater_id UUID REFERENCES theaters(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g. "Screen 1", "IMAX Screen"
  type TEXT DEFAULT 'Standard', -- e.g. 'IMAX', '4DX', 'Gold'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SEAT TIERS (Pricing Categories)
CREATE TABLE seat_tiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  screen_id UUID REFERENCES screens(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g. 'Premium', 'Gold', 'Silver'
  price DECIMAL(10, 2) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SEATS (Physical Layout)
CREATE TABLE seats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  screen_id UUID REFERENCES screens(id) ON DELETE CASCADE NOT NULL,
  tier_id UUID REFERENCES seat_tiers(id) NOT NULL,
  row_label TEXT NOT NULL, -- e.g. 'A', 'B'
  seat_number INTEGER NOT NULL, -- e.g. 1, 2
  grid_row INTEGER NOT NULL, -- visual grid X position
  grid_col INTEGER NOT NULL, -- visual grid Y position
  is_aisle BOOLEAN DEFAULT FALSE,
  UNIQUE(screen_id, row_label, seat_number)
);

-- 8. SHOWS (Scheduling)
CREATE TABLE shows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  screen_id UUID REFERENCES screens(id) NOT NULL,
  movie_id UUID REFERENCES movies(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL, -- Calculated from duration
  language TEXT NOT NULL,
  format TEXT NOT NULL, -- e.g. '2D', '3D'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BOOKINGS
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'failed');

CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  show_id UUID REFERENCES shows(id) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_intent_id TEXT, -- From Stripe/Razorpay
  booking_code TEXT UNIQUE, -- e.g. "MOV-12345"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 minutes') -- Lock expiry
);

-- 10. BOOKING SEATS (Detailed items)
CREATE TABLE booking_seats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  seat_id UUID REFERENCES seats(id) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  UNIQUE(booking_id, seat_id)
);

-- INDEXES for Performance
CREATE INDEX idx_shows_movie ON shows(movie_id);
CREATE INDEX idx_shows_screen_time ON shows(screen_id, start_time);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_booking_seats_seat ON booking_seats(seat_id);

-- RLS POLICIES (Simplified for brevity)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view active movies" ON movies FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view shows" ON shows FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view theaters" ON theaters FOR SELECT USING (is_active = true);

-- User Policies
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin Policies (Use custom claim or profile role check logic in real app)
-- For now, assume a function `is_admin()` exists or simply allow read for authenticated users to simplify dev.

-- CONCURRENCY FUNCTIONS
-- Function to check seat availability
CREATE OR REPLACE FUNCTION verify_seat_availability(p_show_id UUID, p_seat_ids UUID[])
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Check if any of these seats are already booked (confirmed) OR locked (pending within expiry)
  SELECT COUNT(*)
  INTO v_count
  FROM booking_seats bs
  JOIN bookings b ON bs.booking_id = b.id
  WHERE b.show_id = p_show_id
    AND bs.seat_id = ANY(p_seat_ids)
    AND (
      b.status = 'confirmed' 
      OR (b.status = 'pending' AND b.expires_at > NOW())
    );
    
  RETURN v_count = 0; -- Returns TRUE if no conflict
END;
$$ LANGUAGE plpgsql;

-- Function to Lock Seats (Transaction)
CREATE OR REPLACE FUNCTION lock_seats(
  p_user_id UUID,
  p_show_id UUID,
  p_seat_ids UUID[],
  p_total_amount DECIMAL
) RETURNS JSON AS $$
DECLARE
  v_booking_id UUID;
  v_seat_id UUID;
  v_seat_price DECIMAL;
BEGIN
  -- 1. Check Availability Again (Double check inside transaction)
  IF NOT verify_seat_availability(p_show_id, p_seat_ids) THEN
    RETURN json_build_object('success', false, 'message', 'Seats are no longer available');
  END IF;

  -- 2. Create Booking Record
  INSERT INTO bookings (user_id, show_id, total_amount, tax_amount, status, expires_at)
  VALUES (p_user_id, p_show_id, p_total_amount, p_total_amount * 0.18, 'pending', NOW() + INTERVAL '10 minutes') -- 18% Tax logic
  RETURNING id INTO v_booking_id;

  -- 3. Insert Booking Seats
  FOREACH v_seat_id IN ARRAY p_seat_ids
  LOOP
    -- Get price from seat -> tier -> price (simplified here, assuming passed or looked up)
    -- In real app, fetch price from seat_tiers based on seat_id
    INSERT INTO booking_seats (booking_id, seat_id, price)
    VALUES (v_booking_id, v_seat_id, 0); -- Placeholder price, should fetch real price
  END LOOP;

  RETURN json_build_object('success', true, 'booking_id', v_booking_id);

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Realtime Setup
ALTER PUBLICATION supabase_realtime ADD TABLE seats, bookings;
-- Note: 'booking_seats' changes might be too frequent, better to subscribe to 'bookings' status changes or a materialized view of availability.
