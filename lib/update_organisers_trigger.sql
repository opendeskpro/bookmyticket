-- Fix the trigger to automatically insert into organisers table for ORGANISER roles

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'PUBLIC')
  );

  -- If role is ORGANISER, automatically insert into organisers
  IF new.raw_user_meta_data->>'role' = 'ORGANISER' THEN
    INSERT INTO public.organisers (user_id, org_name, status)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'full_name', 'My Organization'),
      'ACTIVE'
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Add missing RLS policies for the organisers table
ALTER TABLE public.organisers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active organisers (needed for UI features like featured organisers)
CREATE POLICY "Public organisers viewable by everyone" ON public.organisers 
FOR SELECT USING (true);

-- Allow organisers to update their own profile
CREATE POLICY "Organisers can update own profile" ON public.organisers 
FOR UPDATE USING (auth.uid() = user_id);
