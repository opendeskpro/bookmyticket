const { Client } = require('pg');

const connectionString = "postgresql://postgres.ncyewwhtohpfrzstcypv:h%23d8c1c%40b2aE@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

const sql = `
CREATE OR REPLACE FUNCTION admin_add_organizer_user(
  org_name TEXT,
  org_email TEXT,
  org_phone TEXT,
  org_status TEXT,
  org_password TEXT
) RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- 1. Insert into auth.users (creating the identity securely)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    org_email,
    crypt(org_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object('full_name', org_name, 'role', 'ORGANISER')
  )
  RETURNING id INTO new_user_id;

  -- 2. Insert into organisers table
  INSERT INTO public.organisers (id, user_id, name, email, phone, status)
  VALUES (gen_random_uuid(), new_user_id, org_name, org_email, org_phone, org_status);

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

async function run() {
    console.log("Connecting to PostgreSQL...");
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log("Connected successfully. Applying SQL migration...");
        await client.query(sql);
        console.log("Migration applied! The RPC function is now ready.");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await client.end();
    }
}

run();
