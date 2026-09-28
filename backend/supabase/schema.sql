-- =============================================================================
-- Orbit Notes — Personal Observatory Database Schema
-- Run this in the Supabase SQL editor to initialize tables, RLS, and indexes.
-- =============================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SKY EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'Meteor Shower', 'Planetary Conjunction', 'Lunar Eclipse', 'Solar Eclipse', 'Comet', 'Auroral Activity', 'Occultation', 'Deep Sky Transit'
    event_date TIMESTAMPTZ NOT NULL,
    peak_time TIMESTAMPTZ,
    visibility_notes TEXT,
    location_notes TEXT,
    equipment TEXT DEFAULT 'Naked Eye', -- 'Naked Eye', 'Binoculars (7x50+)', 'Refractor Telescope', 'Reflector Telescope', 'Astrophotography Rig'
    status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'observed', 'missed'
    notes TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. SPACE SCIENCE DISCOVERIES TABLE
CREATE TABLE IF NOT EXISTS discoveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    source_name TEXT NOT NULL, -- e.g. 'NASA / JPL', 'ESA Space Science', 'Nature Astronomy', 'arXiv Astrophysics'
    source_url TEXT,
    category TEXT NOT NULL DEFAULT 'Astrophysics', -- 'Exoplanets', 'Cosmology', 'Solar System', 'Deep Sky', 'Space Missions', 'Gravitational Waves'
    image_url TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    is_official_feed BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. DATED OBSERVATORY DAILY REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    discoveries_count INT NOT NULL DEFAULT 0,
    events_count INT NOT NULL DEFAULT 0,
    highlights JSONB DEFAULT '[]'::jsonb,
    seeing_conditions JSONB DEFAULT '{"bortleClass": 4, "seeing": "Good (1.2 arcsec)", "transparency": "High", "cloudCover": "10%"}'::jsonb,
    notes TEXT,
    is_auto_generated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_discoveries_published_at ON discoveries(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_discoveries_category ON discoveries(category);
CREATE INDEX IF NOT EXISTS idx_discoveries_user_id ON discoveries(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_date ON reports(user_id, report_date DESC);

-- Unique constraint to avoid duplicate RSS feed items by URL
CREATE UNIQUE INDEX IF NOT EXISTS idx_discoveries_source_url ON discoveries(source_url) WHERE source_url IS NOT NULL;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Enabled on all tables. Supabase Service Role Key bypasses RLS on backend,
-- while client anon key respects ownership.
-- =============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Users can view own events"
    ON events FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
    ON events FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
    ON events FOR DELETE
    USING (auth.uid() = user_id);

-- Discoveries policies
CREATE POLICY "Public discoveries visible to all"
    ON discoveries FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert discoveries"
    ON discoveries FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own discoveries"
    ON discoveries FOR DELETE
    USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can view own reports"
    ON reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
    ON reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
    ON reports FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
    ON reports FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================================
-- SEED DATA (Curated Starter Sky Events & Discoveries)
-- =============================================================================
INSERT INTO discoveries (title, summary, source_name, source_url, category, is_official_feed, published_at, tags)
VALUES
(
    'James Webb Space Telescope Uncovers Ancient Galaxy Cluster from Cosmic Dawn',
    'Astronomers utilizing the NIRCam instrument on JWST have identified an exceptionally dense proto-cluster of galaxies dating to just 400 million years after the Big Bang, challenging standard hierarchical structure formation models.',
    'NASA / JPL',
    'https://www.nasa.gov/missions/webb/webb-uncovers-ancient-galaxy-cluster/',
    'Cosmology',
    true,
    NOW() - INTERVAL '1 day',
    ARRAY['JWST', 'Early Universe', 'Cosmology', 'Galaxies']
),
(
    'ESA Euclid Mission Delivers First Full Color Deep-Sky Survey of the Perseus Cluster',
    'The European Space Agency Euclid telescope has published its landmark 260-million-pixel mosaic of the Perseus cluster, mapping the influence of dark matter across 100,000 galaxies with unprecedented optical and near-infrared precision.',
    'ESA Space Science',
    'https://www.esa.int/Science_Exploration/Space_Science/Euclid/Euclid_s_first_images_the_dazzling_edge_of_darkness',
    'Deep Sky',
    true,
    NOW() - INTERVAL '2 days',
    ARRAY['Euclid', 'Dark Matter', 'ESA', 'Deep Space']
),
(
    'Atmospheric Characterization of Temperate Sub-Neptune K2-18 b Reveals Carbon Molecules',
    'Spectroscopic transmission observations from space observatories confirm methane and carbon dioxide in the hydrogen-rich atmosphere of exoplanet K2-18 b located in the habitable zone of its red dwarf host.',
    'NASA / JPL',
    'https://www.nasa.gov/universe/exoplanets/webb-discovers-methane-carbon-dioxide-in-atmosphere-of-k2-18b/',
    'Exoplanets',
    true,
    NOW() - INTERVAL '3 days',
    ARRAY['Exoplanets', 'Habitable Zone', 'Spectroscopy', 'Sub-Neptunes']
)
ON CONFLICT (source_url) DO NOTHING;
