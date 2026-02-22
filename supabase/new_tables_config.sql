
-- Create site_config table for dynamic platform settings
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL, -- e.g. 'settings', 'home_hero', 'footer'
  config_value JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow public read for site config (needed for homepage etc)
CREATE POLICY "Public can view site config" ON site_config FOR SELECT USING (true);

-- Allow admins to update
CREATE POLICY "Admins can update site config" ON site_config FOR ALL USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin'))
);

-- Insert default settings
INSERT INTO site_config (section_key, config_value, description)
VALUES (
  'settings',
  '{"enable_movies_page": true}'::jsonb,
  'General platform settings'
) ON CONFLICT (section_key) DO NOTHING;
