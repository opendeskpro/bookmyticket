-- MeetSphere Database Schema
-- Run this in your Supabase SQL Editor

-- 1-3. Create ENUMs (handling if they already exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'meeting_status') THEN
        CREATE TYPE meeting_status AS ENUM ('scheduled', 'active', 'ended');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'participant_status') THEN
        CREATE TYPE participant_status AS ENUM ('waiting', 'admitted', 'left', 'kicked');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'participant_role') THEN
        CREATE TYPE participant_role AS ENUM ('host', 'guest');
    END IF;
END $$;

-- 4. Create Meetings Table
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status meeting_status DEFAULT 'active'::meeting_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Participants Table
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role participant_role DEFAULT 'guest'::participant_role,
    status participant_status DEFAULT 'waiting'::participant_status,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(meeting_id, user_id) -- A user can only have one participant record per meeting
);

-- 6. Create Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- RLS POLICIES FOR MEETINGS
-- ----------------------------------------------------

-- Anyone can read a meeting (needed to check if it exists before joining)
DROP POLICY IF EXISTS "Meetings are readable by everyone" ON public.meetings;
CREATE POLICY "Meetings are readable by everyone" 
ON public.meetings FOR SELECT 
USING (true);

-- Only authenticated users can create meetings
DROP POLICY IF EXISTS "Users can create meetings" ON public.meetings;
CREATE POLICY "Users can create meetings" 
ON public.meetings FOR INSERT 
WITH CHECK (auth.uid() = host_id);

-- Only the host can update the meeting
DROP POLICY IF EXISTS "Host can update their meetings" ON public.meetings;
CREATE POLICY "Host can update their meetings" 
ON public.meetings FOR UPDATE 
USING (auth.uid() = host_id);


-- ----------------------------------------------------
-- RLS POLICIES FOR PARTICIPANTS
-- ----------------------------------------------------

-- Participants of a meeting can see other participants of that meeting
DROP POLICY IF EXISTS "Authenticated users can see participants" ON public.participants;
CREATE POLICY "Authenticated users can see participants" 
ON public.participants FOR SELECT 
USING (auth.role() = 'authenticated');

-- Users can insert themselves as participants (join a meeting)
DROP POLICY IF EXISTS "Users can join a meeting" ON public.participants;
CREATE POLICY "Users can join a meeting" 
ON public.participants FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own status (e.g., leave the meeting) OR the host can update anyone's status (admit/kick)
DROP POLICY IF EXISTS "Users can update own status or host can update anyone" ON public.participants;
CREATE POLICY "Users can update own status or host can update anyone" 
ON public.participants FOR UPDATE 
USING (
    auth.uid() = user_id 
    OR 
    EXISTS (SELECT 1 FROM public.meetings WHERE id = meeting_id AND host_id = auth.uid())
);


-- ----------------------------------------------------
-- RLS POLICIES FOR CHAT MESSAGES
-- ----------------------------------------------------

-- Authenticated users can read chat for a meeting they are in
DROP POLICY IF EXISTS "Anyone can read chat" ON public.chat_messages;
CREATE POLICY "Anyone can read chat" 
ON public.chat_messages FOR SELECT 
USING (auth.role() = 'authenticated');

-- Authenticated users can send messages
DROP POLICY IF EXISTS "Users can send messages" ON public.chat_messages;
CREATE POLICY "Users can send messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- Enable Realtime for the tables so we can listen to chat & participant changes
-- Drop publication table first to avoid errors if it exists
DO $$ 
BEGIN
  IF EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename IN ('meetings', 'participants', 'chat_messages')
  ) THEN
      ALTER PUBLICATION supabase_realtime DROP TABLE public.meetings, public.participants, public.chat_messages;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Catch if supabase_realtime doesn't exist or other errors
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings, public.participants, public.chat_messages;
