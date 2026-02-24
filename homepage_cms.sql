-- Homepage CMS Schema
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE, -- 'hero_banners', 'category_pins', 'spotlight'
    title TEXT,
    content JSONB NOT NULL, -- Section-specific data (arrays of objects)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Public read homepage_sections" ON public.homepage_sections FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can modify homepage_sections" ON public.homepage_sections FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Initial Mock Data to match current hardcoded content
INSERT INTO public.homepage_sections (section_key, title, content)
VALUES 
('hero_banners', 'Hero Banners', '[
    {
      "title": "Experience the Magic of Cinema",
      "subtitle": "Book tickets for the latest Hollywood and Bollywood blockbusters. Experience the big screen like never before.",
      "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop",
      "cta": "Book Movies"
    },
    {
      "title": "Live Music, Unforgettable Nights",
      "subtitle": "Join thousands of fans for the biggest rock, pop, and electronic concerts in your city.",
      "image": "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2670&auto=format&fit=crop",
      "cta": "Find Concerts"
    },
    {
      "title": "Laughter is the Best Medicine",
      "subtitle": "Catch the funniest stand-up comedians and improv shows. Book your seats for a night of pure joy.",
      "image": "https://images.unsplash.com/photo-1514525253361-b83f85dfd75c?q=80&w=2670&auto=format&fit=crop",
      "cta": "Join Shows"
    }
]'::JSONB)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.homepage_sections (section_key, title, content)
VALUES 
('category_pins', 'Categories', '[
    {"name": "Movies", "icon": "Film", "route": "/events?category=Movies", "color": "#F84464"},
    {"name": "Events", "icon": "Calendar", "route": "/events?category=Events", "color": "#4ADE80"},
    {"name": "Plays", "icon": "Theater", "route": "/events?category=Plays", "color": "#60A5FA"},
    {"name": "Sports", "icon": "Trophy", "route": "/events?category=Sports", "color": "#FBBF24"}
]'::JSONB)
ON CONFLICT (section_key) DO NOTHING;
