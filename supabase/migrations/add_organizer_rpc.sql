-- Function to allow admin to insert organizers bypassing RLS
CREATE OR REPLACE FUNCTION admin_create_organizer(
  org_name TEXT,
  org_email TEXT,
  org_phone TEXT,
  org_status TEXT
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Insert into organisers and return the new ID
  INSERT INTO public.organisers (name, email, phone, status)
  VALUES (org_name, org_email, org_phone, org_status)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- SECURITY DEFINER allows the function to run with the privileges of the creator (bypassing RLS)
