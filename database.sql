
-- ==========================================
-- 1. ENUMS & EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('PUBLIC', 'ORGANISER', 'ADMIN');
CREATE TYPE org_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
CREATE TYPE event_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TYPE booking_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- ==========================================
-- 2. CORE TABLES
-- ==========================================

-- Profiles (Linked to Auth.Users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'PUBLIC',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizers (Requires Admin Approval)
CREATE TABLE public.organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) UNIQUE,
  org_name TEXT NOT NULL,
  bio TEXT,
  status org_status DEFAULT 'PENDING',
  is_verified BOOLEAN DEFAULT FALSE,
  pan_number TEXT,
  bank_details JSONB, -- { account_no, ifsc, bank_name }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organiser_id UUID NOT NULL REFERENCES public.organizers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  venue TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  capacity INTEGER NOT NULL,
  status event_status DEFAULT 'PENDING',
  banner_url TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  country TEXT,
  zip_code TEXT,
  refund_policy TEXT,
  meta_keywords TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket Types & Internal Pricing Breakup
CREATE TABLE public.ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'General Admission',
  final_price DECIMAL(10,2) NOT NULL DEFAULT 500.00, -- What the user sees
  base_price DECIMAL(10,2) NOT NULL, -- Organizer share
  gst_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  internet_charge DECIMAL(10,2) NOT NULL,
  total_quantity INTEGER NOT NULL,
  sold_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT inventory_check CHECK (sold_count <= total_quantity)
);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  event_id UUID NOT NULL REFERENCES public.events(id),
  total_paid DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  status booking_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual Tickets (QR Generation Flag)
CREATE TABLE public.booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES public.ticket_types(id),
  qr_code TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settlements (Payout Tracking)
CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organiser_id UUID NOT NULL REFERENCES public.organizers(id),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  amount_to_pay DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'PROCESSED'
  processed_at TIMESTAMPTZ
);

-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can see their own
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Organizers: Can only manage their own data
CREATE POLICY "Organizers manage own record" ON public.organizers FOR ALL USING (user_id = auth.uid());

-- Events: Public can see approved, Organizers manage their own
CREATE POLICY "Approved events public" ON public.events FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Organizers manage own events" ON public.events FOR ALL USING (
  organiser_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid())
);

-- Ticket Types: Organizers manage own
CREATE POLICY "Organizers manage own tickets" ON public.ticket_types FOR ALL USING (
  event_id IN (SELECT id FROM public.events WHERE organiser_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()))
);

-- Bookings: User views own, Organizer views their event bookings
CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Organizers view event bookings" ON public.bookings FOR SELECT USING (
  event_id IN (SELECT id FROM public.events WHERE organiser_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()))
);

-- ==========================================
-- 4. TRIGGERS
-- ==========================================

-- Auto-sync Auth metadata to Profile (Ensures Original Username persistence)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'PUBLIC')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
