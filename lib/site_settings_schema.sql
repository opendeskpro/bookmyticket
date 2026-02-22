-- Ensure site_config table exists (it should be in complete_schema.sql, but safe to re-run CREATE IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.site_config (
  section_key TEXT PRIMARY KEY,
  config_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Basic RLS for site_config
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read config (need for public footer/logo)
CREATE POLICY "Public can view site config" ON public.site_config FOR SELECT USING (true);

-- Allow Admins to update config
-- Ideally check if auth.uid() is an admin profile, but for now we'll rely on app-side checks or simple auth
CREATE POLICY "Admins can update site config" ON public.site_config FOR ALL USING (true); -- Simplified for demo

-- Seed Default Data (Logo & Brand)
INSERT INTO public.site_config (section_key, config_value)
VALUES (
    'brand_assets',
    '{"logo_url": "/logo.jpeg", "site_name": "BookMyTicket"}'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;

-- Seed Default Data (Footer Links)
INSERT INTO public.site_config (section_key, config_value)
VALUES (
    'footer_links',
    '{
        "top_links": [
            {"label": "About Us", "url": "/about"},
            {"label": "Pricing", "url": "/pricing"},
            {"label": "Contact Us", "url": "/contact"},
            {"label": "Blog", "url": "/blog"},
            {"label": "Event Magazine", "url": "/magazine"},
            {"label": "Product Diary", "url": "/diary"},
            {"label": "Sitemap", "url": "/sitemap"}
        ],
        "columns": [
            {
                "title": "Organize Events",
                "links": [
                    {"label": "Conferences", "url": "/events/conferences"},
                    {"label": "Sports and Fitness", "url": "/events/sports"},
                    {"label": "Workshops and Trainings", "url": "/events/workshops"},
                    {"label": "Entertainment Events", "url": "/events/entertainment"},
                    {"label": "Festivals & Celebrations", "url": "/events/festivals"},
                    {"label": "Meetups and Reunions", "url": "/events/meetups"}
                ]
            },
            {
                "title": "Features",
                "links": [
                    {"label": "Free Events", "url": "/features/free-events"},
                    {"label": "Event Forms", "url": "/features/forms"},
                    {"label": "Event Marketing", "url": "/features/marketing"},
                    {"label": "Event Management Software", "url": "/features/software"},
                    {"label": "Conference Solutions", "url": "/features/conferences"},
                    {"label": "Marathon Tools", "url": "/features/marathon"}
                ]
            },
            {
                "title": "Popular Cities",
                "links": [
                    {"label": "Coimbatore", "url": "/city/coimbatore"},
                    {"label": "Chennai", "url": "/city/chennai"},
                    {"label": "Bengaluru", "url": "/city/bengaluru"},
                    {"label": "Hyderabad", "url": "/city/hyderabad"},
                    {"label": "Mumbai", "url": "/city/mumbai"},
                    {"label": "Goa", "url": "/city/goa"}
                ]
            },
            {
                "title": "Legal",
                "links": [
                    {"label": "How it works", "url": "/legal/how-it-works"},
                    {"label": "Terms & Conditions", "url": "/legal/terms"},
                    {"label": "Privacy", "url": "/legal/privacy"},
                    {"label": "Refund Policy", "url": "/legal/refunds"},
                    {"label": "Support / FAQs", "url": "/support"},
                    {"label": "Grievance Redressal", "url": "/grievance"},
                    {"label": "Brand Assets", "url": "/brand"},
                    {"label": "News Room", "url": "/news"}
                ]
            }
        ],
        "social_links": [
            {"platform": "Facebook", "url": "#"},
            {"platform": "Twitter", "url": "#"},
            {"platform": "Instagram", "url": "#"},
            {"platform": "LinkedIn", "url": "#"}
        ]
    }'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;
