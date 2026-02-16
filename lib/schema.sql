-- TICKET9 COMPREHENSIVE SCHEMA
-- Support for Events, Ecommerce, Financials, and CMS

-- 1. Profiles & Roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'PUBLIC' CHECK (role IN ('PUBLIC', 'ORGANISER', 'ADMIN')),
  wallet_balance DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Organisers (Vendor Management)
CREATE TABLE IF NOT EXISTS organisers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  bio TEXT,
  website TEXT,
  pan_number TEXT,
  bank_details JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Events & Tickets
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organiser_id UUID REFERENCES organisers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location TEXT,
  banner_url TEXT,
  event_date DATE,
  start_time TIME,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  sold INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Ecommerce (Shop Management)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organiser_id UUID REFERENCES organisers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  type TEXT CHECK (type IN ('PHYSICAL', 'DIGITAL')),
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DEACTIVE')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Financial Ledger (Wallet & Payouts)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organiser_id UUID REFERENCES organisers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id), -- Optional for P2P or Purchases
  type TEXT CHECK (type IN ('CREDIT', 'DEBIT')),
  amount DECIMAL(12, 2) NOT NULL,
  method TEXT, -- 'STRIPE', 'PAYPAL', 'MANUAL_WITHDRAWAL', 'TICKET_SALE'
  pre_balance DECIMAL(12, 2),
  after_balance DECIMAL(12, 2),
  status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organiser_id UUID REFERENCES organisers(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  charge DECIMAL(12, 2) NOT NULL, -- Platform fee
  payable DECIMAL(12, 2) NOT NULL, -- Final amount
  method TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CMS (Blogs)
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  image_url TEXT,
  author_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Settings & Config
CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
