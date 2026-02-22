-- Add breakdown columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(12, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(12, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS internet_handling_fee DECIMAL(12, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS tax DECIMAL(12, 2) DEFAULT 0.00;

-- Function to handle wallet updates
CREATE OR REPLACE FUNCTION public.handle_new_booking_wallet_update()
RETURNS TRIGGER AS $$
DECLARE
  v_organiser_id UUID;
  v_ticket_price DECIMAL(12, 2);
  v_booking_id UUID;
  v_event_id UUID;
BEGIN
  -- Get the event and organiser details
  SELECT owner_id INTO v_organiser_id
  FROM public.events
  WHERE id = NEW.event_id;

  -- Use local variable for ticket price from the NEW record
  v_ticket_price := NEW.ticket_price;
  v_booking_id := NEW.id;
  v_event_id := NEW.event_id;

  -- Update organiser's wallet balance (CREDIT ticket_price ONLY)
  UPDATE public.profiles
  SET wallet_balance = COALESCE(wallet_balance, 0) + v_ticket_price
  WHERE id = v_organiser_id;

  -- Record the transaction
  INSERT INTO public.transactions (
    organiser_id,
    type,
    amount,
    method,
    status,
    created_at
  ) VALUES (
    v_organiser_id,
    'CREDIT',
    v_ticket_price,
    'BOOKING',
    'SUCCESS',
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_booking_created ON public.bookings;
CREATE TRIGGER on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_booking_wallet_update();
