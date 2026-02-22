-- 0. Ensure Tables Exist & Fix Schema
CREATE TABLE IF NOT EXISTS public.organisers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  organization_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  status TEXT DEFAULT 'PENDING',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organiser_id UUID REFERENCES public.organisers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  location TEXT,
  venue TEXT,
  city TEXT,
  min_price DECIMAL,
  max_price DECIMAL,
  status TEXT DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_config (
  section_key TEXT PRIMARY KEY,
  config_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fix missing columns if table already exists (Schema Migration)
DO $$
BEGIN
    -- Add event_date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'event_date') THEN
        ALTER TABLE public.events ADD COLUMN event_date TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add start_time
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'start_time') THEN
        ALTER TABLE public.events ADD COLUMN start_time TEXT;
    END IF;

    -- Add end_time
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'end_time') THEN
        ALTER TABLE public.events ADD COLUMN end_time TEXT;
    END IF;

    -- Add category
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'category') THEN
        ALTER TABLE public.events ADD COLUMN category TEXT;
    END IF;

    -- Add location
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'location') THEN
        ALTER TABLE public.events ADD COLUMN location TEXT;
    END IF;

    -- Add venue
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'venue') THEN
        ALTER TABLE public.events ADD COLUMN venue TEXT;
    END IF;

    -- Add city
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'city') THEN
        ALTER TABLE public.events ADD COLUMN city TEXT;
    END IF;

    -- Add banner_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'banner_url') THEN
        ALTER TABLE public.events ADD COLUMN banner_url TEXT;
    END IF;

    -- Add min_price
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'min_price') THEN
        ALTER TABLE public.events ADD COLUMN min_price DECIMAL;
    END IF;

    -- Add max_price
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'max_price') THEN
        ALTER TABLE public.events ADD COLUMN max_price DECIMAL;
    END IF;

    -- Add status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status') THEN
        ALTER TABLE public.events ADD COLUMN status TEXT DEFAULT 'DRAFT';
    END IF;

    -- Add is_featured
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_featured') THEN
        ALTER TABLE public.events ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add is_virtual
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_virtual') THEN
        ALTER TABLE public.events ADD COLUMN is_virtual BOOLEAN DEFAULT FALSE;
    END IF;

    -- Fix Foreign Key Constraint
    -- The existing table might reference auth.users, but we want it to reference public.organisers
    BEGIN
        ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_organiser_id_fkey;
        ALTER TABLE public.events 
            ADD CONSTRAINT events_organiser_id_fkey 
            FOREIGN KEY (organiser_id) 
            REFERENCES public.organisers(id) 
            ON DELETE CASCADE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Constraint update failed or already correct: %', SQLERRM;
    END;
END $$;

-- Force enable RLS but allow public read for demo
ALTER TABLE public.organisers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active organisers" ON public.organisers;
CREATE POLICY "Public can view active organisers" ON public.organisers FOR SELECT USING (status = 'ACTIVE');

DROP POLICY IF EXISTS "Organisers can insert their own profile" ON public.organisers;
CREATE POLICY "Organisers can insert their own profile" ON public.organisers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Organisers can update their own profile" ON public.organisers;
CREATE POLICY "Organisers can update their own profile" ON public.organisers FOR UPDATE USING (auth.uid() = user_id);

-- 1. Create Demo Data (Organizers -> Events -> Site Config)
WITH org_ids AS (
  INSERT INTO organisers (id, user_id, organization_name, description, status, is_verified, created_at, updated_at)
  VALUES 
    (uuid_generate_v4(), (SELECT id FROM auth.users LIMIT 1), 'Pro Events India', 'Leading event organizers in South India', 'ACTIVE', true, NOW(), NOW()), 
    (uuid_generate_v4(), (SELECT id FROM auth.users LIMIT 1), 'Music Vibes', 'Bringing the best beats to your city', 'ACTIVE', true, NOW(), NOW()),
    (uuid_generate_v4(), (SELECT id FROM auth.users LIMIT 1), 'Comedy Club Official', 'Laughter is the best medicine', 'ACTIVE', true, NOW(), NOW())
  RETURNING id, organization_name
),
new_events AS (
  INSERT INTO events (id, organiser_id, title, description, event_date, start_time, end_time, location, venue, city, category, banner_url, min_price, max_price, status, created_at)
  VALUES
    -- Spotlight Event (Holi Blast)
    (uuid_generate_v4(), (SELECT id FROM org_ids LIMIT 1), 'Holi Blast 2026', 'The biggest Holi celebration in the city with organic colors, DJ, and rain dance.', '2026-03-08', '09:00', '16:00', 'G Square City 2.0', 'G Square City 2.0', 'Coimbatore', 'Festival', 'https://images.unsplash.com/photo-1590823330107-55099307372e?auto=format&fit=crop&w=1200', 499, 1499, 'PUBLISHED', NOW()),
    
    -- Featured Events
    (uuid_generate_v4(), (SELECT id FROM org_ids OFFSET 1 LIMIT 1), 'Sunburn Arena', 'Experience the electric atmosphere with top global DJs.', '2026-04-15', '18:00', '23:00', 'Codissia Trade Fair Complex', 'Codissia', 'Coimbatore', 'Concert', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', 999, 4999, 'PUBLISHED', NOW()),
    (uuid_generate_v4(), (SELECT id FROM org_ids OFFSET 2 LIMIT 1), 'Standup Special: Just Kidding', 'A night of non-stop laughter with top comedians.', '2026-03-20', '19:00', '21:00', 'Hindustan College Auditorium', 'Hindustan College', 'Chennai', 'Comedy Show', 'https://images.unsplash.com/photo-1514525253361-b83f85df0f5c?auto=format&fit=crop&q=80&w=800', 299, 999, 'PUBLISHED', NOW()),
    
    -- Venue Events
    (uuid_generate_v4(), (SELECT id FROM org_ids LIMIT 1), 'Tech Summit 2026', 'The biggest tech conference in the region.', '2026-05-10', '09:00', '17:00', 'Le Meridien', 'Le Meridien', 'Bangalore', 'Conference', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', 1999, 9999, 'PUBLISHED', NOW()),

    -- Virtual Events
    (uuid_generate_v4(), (SELECT id FROM org_ids OFFSET 1 LIMIT 1), 'Digital Marketing Masterclass', 'Learn from the pros from the comfort of your home.', '2026-03-25', '10:00', '13:00', 'Online', 'Zoom', 'Online', 'Workshop', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800', 0, 499, 'PUBLISHED', NOW())
  RETURNING id, title
)
INSERT INTO site_config (section_key, config_value)
VALUES ('homepage', jsonb_build_object(
    'hero', jsonb_build_object(
        'title1', 'Discover Your Next',
        'title2', 'Unforgettable Experience',
        'subtitle', 'Explore concerts, shows, nightlife, and exclusive experiences happening around you.',
        'searchPlaceholder', 'Search events, concerts, shows...',
        'bgVideo', 'https://www.youtube.com/embed/XeaAT-wTLuM?autoplay=1&mute=1&loop=1&playlist=XeaAT-wTLuM&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1',
        'stats', jsonb_build_array(
            jsonb_build_object('label', 'Concert', 'value', ''),
            jsonb_build_object('label', 'Sports', 'value', ''),
            jsonb_build_object('label', 'Musics', 'value', ''),
            jsonb_build_object('label', 'Live Shows', 'value', ''),
            jsonb_build_object('label', 'Comedy Show', 'value', '')
        )
    ),
    'spotlight', jsonb_build_object(
        'visible', true,
        'title', 'Spotlight 🎯',
        'subtitle', 'Handpicked experiences and standout events you won''t want to miss!',
        'eventId', (SELECT id FROM new_events WHERE title = 'Holi Blast 2026' LIMIT 1),
        'image', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200'
    ),
    'cities', jsonb_build_object(
        'visible', true,
        'title', 'Popular Cities 📍',
        'subtitle', 'Upcoming events in the trending destinations!'
    ),
    'organizers', jsonb_build_object(
        'visible', true,
        'title', 'Featured Organizers 🌟',
        'subtitle', 'Discover events from our trusted organizers worldwide'
    ),
    'whyBookWithUs', jsonb_build_object(
        'visible', true,
        'title', 'Why Book with BookMyTicket? 🎟️',
        'subtitle', 'We make your booking experience smooth, secure, and hassle-free.',
        'image', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=1000',
        'items', jsonb_build_array(
            jsonb_build_object('id', '1', 'title', 'Curated Events for You', 'description', 'Discover handpicked experiences, tailored to your interests and city.', 'icon', 'Sparkles', 'color', 'bg-purple-100 text-purple-600'),
            jsonb_build_object('id', '2', 'title', 'Safe & Secure Checkout', 'description', 'Fast, encrypted payments with top-grade security—your transactions are safe.', 'icon', 'ShieldCheck', 'color', 'bg-blue-100 text-blue-600'),
            jsonb_build_object('id', '3', 'title', 'Instant Confirmation', 'description', 'Get your tickets instantly via email & app – no waiting, no worries.', 'icon', 'Zap', 'color', 'bg-emerald-100 text-emerald-600')
        )
    ),
    'appDownload', jsonb_build_object(
        'visible', true,
        'title1', 'JOIN OUR',
        'title2', 'NEWSLETTER! 📬',
        'subtitle', 'We get it — spam is no one''s friend! That''s why our newsletter is different. Pure value, zero clutter.',
        'image', '/newsletter_illustration_premium.png'
    ),
    'footer', jsonb_build_object(
        'visible', true,
        'aboutText', 'BookMyTicket is India''s premier high-end event discovery portal. We bridge the gap between imagination and live experience.',
        'socialLinks', jsonb_build_object(
            'facebook', '#',
            'twitter', '#',
            'instagram', '#',
            'linkedin', '#'
        ),
        'sections', jsonb_build_array(
            jsonb_build_object(
                'title', 'Marketplace',
                'links', jsonb_build_array(
                    jsonb_build_object('label', 'All Events', 'url', '#'),
                    jsonb_build_object('label', 'Concerts', 'url', '#'),
                    jsonb_build_object('label', 'Comedy Shows', 'url', '#'),
                    jsonb_build_object('label', 'Workshops', 'url', '#'),
                    jsonb_build_object('label', 'Free Events', 'url', '#')
                )
            ),
            jsonb_build_object(
                'title', 'Support',
                'links', jsonb_build_array(
                    jsonb_build_object('label', 'Help Center', 'url', '#'),
                    jsonb_build_object('label', 'Privacy Policy', 'url', '#'),
                    jsonb_build_object('label', 'Terms of Use', 'url', '#'),
                    jsonb_build_object('label', 'Refund Policy', 'url', '#'),
                    jsonb_build_object('label', 'Contact Us', 'url', '#')
                )
            )
        ),
        'copyrightText', '© 2026 bookmyticket. all rights reserved.'
    )
))
ON CONFLICT (section_key) DO UPDATE SET config_value = EXCLUDED.config_value;
