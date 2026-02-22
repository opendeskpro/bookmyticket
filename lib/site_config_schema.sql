-- Create site_config table to store homepage settings
CREATE TABLE IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL, -- e.g., 'homepage'
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access" ON site_config
    FOR SELECT USING (true);

-- Policy: Allow authenticated users (admins) to update
-- In a real app, you'd check for admin role. For now, we allow authenticated updates.
CREATE POLICY "Allow authenticated update" ON site_config
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert (only if not exists, practically)
CREATE POLICY "Allow authenticated insert" ON site_config
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default homepage config if not exists
INSERT INTO site_config (key, config)
VALUES ('homepage', '{
    "hero": {
        "title1": "Discover Your Next",
        "title2": "Unforgettable Experience",
        "subtitle": "Explore concerts, shows, nightlife, and exclusive experiences happening around you.",
        "searchPlaceholder": "Search events, concerts, shows...",
        "bgVideo": "https://www.youtube.com/embed/XeaAT-wTLuM?autoplay=1&mute=1&loop=1&playlist=XeaAT-wTLuM&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1",
        "stats": [
            { "label": "Concert", "value": "" },
            { "label": "Sports", "value": "" },
            { "label": "Musics", "value": "" },
            { "label": "Live Shows", "value": "" },
            { "label": "Comedy Show", "value": "" }
        ]
    },
    "features": {
        "visible": true,
        "title": "Evento Features ✨",
        "subtitle": "Explore the powerful features that make Evento the best choice for your events.",
        "items": [
            { "id": "1", "title": "Online Events", "description": "Global reach with seamless online event hosting.", "icon": "Globe" },
            { "id": "2", "title": "Venue Events", "description": "Discover best venues for your offline events.", "icon": "MapPin" },
            { "id": "3", "title": "Ticket Variations", "description": "Multiple ticket types for flexible pricing.", "icon": "Ticket" },
            { "id": "4", "title": "Low Commission Rate", "description": "Maximize earnings with our competitive fees.", "icon": "Percent" },
            { "id": "5", "title": "PWA Ticket Scanner", "description": "Easy entry management with our mobile scanner.", "icon": "ScanLine" },
            { "id": "6", "title": "Support Tickets", "description": "24/7 dedicated support for all your needs.", "icon": "Headphones" }
        ]
    },
    "appDownload": {
        "visible": true,
        "title1": "JOIN OUR",
        "title2": "NEWSLETTER! 📬",
        "subtitle": "We get it — spam is no one''s friend! That''s why our newsletter is different. Pure value, zero clutter.",
        "image": "/newsletter_illustration_premium.png"
    },
    "footer": {
        "visible": true,
        "aboutText": "BookMyTicket is India''s premier high-end event discovery portal. We bridge the gap between imagination and live experience.",
        "socialLinks": {
            "facebook": "#",
            "twitter": "#",
            "instagram": "#",
            "linkedin": "#"
        },
        "sections": [
            {
                "title": "Marketplace",
                "links": [
                    { "label": "All Events", "url": "#" },
                    { "label": "Concerts", "url": "#" },
                    { "label": "Comedy Shows", "url": "#" },
                    { "label": "Workshops", "url": "#" },
                    { "label": "Free Events", "url": "#" }
                ]
            },
            {
                "title": "Support",
                "links": [
                    { "label": "Help Center", "url": "#" },
                    { "label": "Privacy Policy", "url": "#" },
                    { "label": "Terms of Use", "url": "#" },
                    { "label": "Refund Policy", "url": "#" },
                    { "label": "Contact Us", "url": "#" }
                ]
            }
        ],
        "copyrightText": "© 2026 bookmyticket. all rights reserved."
    }
}')
ON CONFLICT (key) DO NOTHING;
