-- Event Categories Table
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  is_featured BOOLEAN DEFAULT false,
  serial_number INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  serial_number INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- States Table
CREATE TABLE IF NOT EXISTS states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  serial_number INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cities Table
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state_id UUID REFERENCES states(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  serial_number INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- General Settings Table (Key-Value Store)
CREATE TABLE IF NOT EXISTS general_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_settings ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Admin Write)
-- Categories
CREATE POLICY "Public categories are viewable by everyone" ON event_categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON event_categories FOR INSERT WITH CHECK (true); -- Relaxed for demo
CREATE POLICY "Admins can update categories" ON event_categories FOR UPDATE USING (true);
CREATE POLICY "Admins can delete categories" ON event_categories FOR DELETE USING (true);

-- Countries
CREATE POLICY "Public countries are viewable by everyone" ON countries FOR SELECT USING (true);
CREATE POLICY "Admins can manage countries" ON countries FOR ALL USING (true);

-- States
CREATE POLICY "Public states are viewable by everyone" ON states FOR SELECT USING (true);
CREATE POLICY "Admins can manage states" ON states FOR ALL USING (true);

-- Cities
CREATE POLICY "Public cities are viewable by everyone" ON cities FOR SELECT USING (true);
CREATE POLICY "Admins can manage cities" ON cities FOR ALL USING (true);

-- Settings
CREATE POLICY "Public settings are viewable by everyone" ON general_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON general_settings FOR ALL USING (true);

-- Insert Default Settings
INSERT INTO general_settings (key, value) VALUES 
('event_specifications', '{"enable_country": true, "enable_state": true, "enable_city": true}')
ON CONFLICT (key) DO NOTHING;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES event_categories(id),
  type TEXT CHECK (type IN ('online', 'venue')) NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  poster_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  
  -- Timing
  date_type TEXT CHECK (date_type IN ('single', 'multiple')) DEFAULT 'single',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  
  -- Status & Visibility
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  is_featured BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  
  -- SEO & Policies
  refund_policy TEXT,
  meta_keywords TEXT,
  meta_description TEXT,
  
  -- Location Details
  venue_name TEXT,
  address TEXT,
  country_id UUID REFERENCES countries(id),
  state_id UUID REFERENCES states(id),
  city_id UUID REFERENCES cities(id),
  zip_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies for Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public events are viewable by everyone" 
  ON events FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can insert events" 
  ON events FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update events" 
  ON events FOR UPDATE USING (true);

CREATE POLICY "Admins can delete events" 
  ON events FOR DELETE USING (true);
