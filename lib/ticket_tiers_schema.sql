-- Create ticket_tiers table to support multiple ticket types per event
CREATE TABLE IF NOT EXISTS public.ticket_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Early Bird', 'VIP', 'General Admission'
    description TEXT, -- e.g., 'Includes 1 drink'
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    capacity INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for ticket_tiers
ALTER TABLE public.ticket_tiers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to ticket tiers
CREATE POLICY "Public can view ticket tiers" 
ON public.ticket_tiers FOR SELECT 
USING (true);

-- Allow organizers to insert/update their own event's tiers
-- (For now, we'll allow authenticated triggers or specific organizer logic later, 
--  but focusing on public read is key for the booking flow)

COMMIT;

-- Seed some sample ticket tiers for existing events
DO $$
DECLARE
    v_event_record RECORD;
BEGIN
    FOR v_event_record IN SELECT * FROM public.events LOOP
        -- Insert Standard Ticket
        INSERT INTO public.ticket_tiers (event_id, name, description, price, capacity)
        VALUES (v_event_record.id, 'Standard Entry', 'Access to the main event area.', v_event_record.price, 100);

        -- Insert VIP Ticket (Randomly for some events)
        IF (random() > 0.5) THEN
            INSERT INTO public.ticket_tiers (event_id, name, description, price, capacity)
            VALUES (v_event_record.id, 'VIP Access', 'Front row seats + Meet & Greet.', v_event_record.price * 2, 20);
        END IF;

         -- Insert Early Bird (Randomly for others)
        IF (random() > 0.7) THEN
             INSERT INTO public.ticket_tiers (event_id, name, description, price, capacity)
            VALUES (v_event_record.id, 'Early Bird', 'Discounted entry for early bookers.', v_event_record.price * 0.8, 50);
        END IF;
    END LOOP;
END $$;
