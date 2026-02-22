-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Roles (Links to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'PUBLIC' CHECK (role IN ('PUBLIC', 'ORGANISER', 'ADMIN')),
  wallet_balance DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'PUBLIC')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Organisers
CREATE TABLE IF NOT EXISTS public.organisers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  bio TEXT,
  website TEXT,
  pan_number TEXT,
  bank_details JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Event Categories
CREATE TABLE IF NOT EXISTS public.event_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organiser_id UUID REFERENCES public.organisers(id) ON DELETE CASCADE, -- Optional constraint, code uses user.id sometimes, assume organiser profile links to user
  -- Note: existing code passes 'organiser_id' as user.id in createEvent. 
  -- We'll adjust the foreign key to profiles(id) if the code treats it that way, 
  -- BUT 'organisers' table exists. Let's keep it loose or link to profiles for now to avoid FK errors if logic is mixed.
  -- Better: link to profiles(id) as 'organiser_id' since one user = one organiser profile usually.
  -- actually the code says: organiser_id: user.id. So it references auth.users/profiles.
  -- Let's reference profiles(id) to be safe.
  -- However, stricter schema would reference organisers(user_id).
  -- Let's stick to referencing profiles(id) as the code sends user.id.
  owner_id UUID REFERENCES public.profiles(id), 
  
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  vehicle_type TEXT, -- specific to some event types?
  
  -- Location
  venue TEXT,
  city TEXT,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  country TEXT,
  zip_code TEXT,
  
  -- Media
  banner_url TEXT,
  
  -- Timing
  event_date DATE,
  start_time TIME,
  end_time TIME,
  
  -- Meta
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_virtual BOOLEAN DEFAULT FALSE,
  is_exclusive BOOLEAN DEFAULT FALSE,
  
  refund_policy TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Ticket Types (Definitions)
CREATE TABLE IF NOT EXISTS public.ticket_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  sold INTEGER DEFAULT 0,
  type TEXT, -- 'VIP', 'GA', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Bookings (Orders)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id),
  total_amount DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED', 'PENDING')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Individual Tickets (Generated from Bookings)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id),
  seat_row TEXT,
  seat_number TEXT,
  price DECIMAL(10, 2),
  type TEXT,
  qr_code TEXT, -- Can be generated ID
  status TEXT DEFAULT 'VALID' CHECK (status IN ('VALID', 'USED', 'REFUNDED', 'CANCELLED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Site Config
CREATE TABLE IF NOT EXISTS public.site_config (
  section_key TEXT PRIMARY KEY,
  config_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Products (Ecommerce)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organiser_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  image TEXT,
  type TEXT CHECK (type IN ('PHYSICAL', 'DIGITAL')),
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Transactions (Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organiser_id UUID REFERENCES public.profiles(id),
  type TEXT CHECK (type IN ('CREDIT', 'DEBIT')),
  amount DECIMAL(12, 2) NOT NULL,
  method TEXT,
  pre_balance DECIMAL(12, 2),
  after_balance DECIMAL(12, 2),
  status TEXT DEFAULT 'SUCCESS',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Withdrawals
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organiser_id UUID REFERENCES public.profiles(id),
  amount DECIMAL(12, 2) NOT NULL,
  charge DECIMAL(12, 2) NOT NULL,
  payable DECIMAL(12, 2) NOT NULL,
  method TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Blogs / CMS
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  image TEXT,
  author_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Permissive for demo, tighten for production)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Organisers can insert events" ON public.events FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Organisers can update own events" ON public.events FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON public.tickets FOR SELECT USING (
  booking_id IN (SELECT id FROM public.bookings WHERE user_id = auth.uid())
);
