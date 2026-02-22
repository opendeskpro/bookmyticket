-- Seed Mobile Bottom Navigation Config
INSERT INTO public.site_config (section_key, config_value)
VALUES (
    'mobile_menu',
    '[
        {"label": "Home", "icon": "Home", "url": "/"},
        {"label": "Search", "icon": "Search", "url": "/events"},
        {"label": "Bookings", "icon": "Ticket", "url": "/my-tickets"},
        {"label": "Wallet", "icon": "Wallet", "url": "/organizer/wallet"},
        {"label": "Profile", "icon": "User", "url": "/profile"}
    ]'::jsonb
)
ON CONFLICT (section_key) DO NOTHING;
