-- ClickAndFix Civic Portal Database Schema with Supabase Auth Integration
-- This SQL file updates the database structure to work with Supabase Authentication
-- Compatible with Supabase PostgreSQL

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table 1: usersdb (Updated for Supabase Auth)
-- Stores additional user profile information
-- The auth.users table is managed by Supabase automatically
-- =============================================
DROP TABLE IF EXISTS usersdb CASCADE;
CREATE TABLE usersdb (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    tehsil VARCHAR(100) NOT NULL,
    location TEXT NOT NULL,
    user_type VARCHAR(20) DEFAULT 'citizen' CHECK (user_type IN ('citizen', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table 2: adminsdb (Updated for Supabase Auth)
-- Stores admin-specific information
-- =============================================
DROP TABLE IF EXISTS adminsdb CASCADE;
CREATE TABLE adminsdb (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    tehsil VARCHAR(100) NOT NULL,
    admin_level VARCHAR(50) DEFAULT 'local' CHECK (admin_level IN ('local', 'regional', 'super')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table 3: tehsils (No changes needed)
-- Stores list of administrative divisions/tehsils
-- =============================================
DROP TABLE IF EXISTS tehsils CASCADE;
CREATE TABLE tehsils (
    id SERIAL PRIMARY KEY,
    tehsil VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table 4: requests (Updated foreign key for Supabase Auth)
-- Stores citizen requests/complaints
-- =============================================
DROP TABLE IF EXISTS requests CASCADE;
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    issue VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT, -- File path for uploaded image
    document TEXT, -- File path for uploaded document (optional)
    name VARCHAR(200) NOT NULL, -- Name of the person reporting
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Closed', 'Dropped')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    schedule DATE, -- Scheduled date for addressing the issue
    tehsil VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Indexes for better performance
-- =============================================
CREATE INDEX idx_usersdb_tehsil ON usersdb(tehsil);
CREATE INDEX idx_adminsdb_tehsil ON adminsdb(tehsil);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_tehsil ON requests(tehsil);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);

-- =============================================
-- Function to handle new user registration
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create profile when email is confirmed AND user is not an admin
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        -- Check if user has admin role in metadata
        IF COALESCE(NEW.raw_user_meta_data->>'role', '') != 'admin' THEN
            -- Insert into usersdb when email is verified (only for regular users)
            INSERT INTO public.usersdb (id, first_name, last_name, contact_number, tehsil, location)
            VALUES (
                NEW.id,
                COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
                COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
                COALESCE(NEW.raw_user_meta_data->>'contact_number', ''),
                COALESCE(NEW.raw_user_meta_data->>'tehsil', ''),
                COALESCE(NEW.raw_user_meta_data->>'location', '')
            )
            ON CONFLICT (id) DO NOTHING; -- Prevent duplicate entries
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile when email is confirmed
-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Sample data for tehsils (you can modify as needed)
-- =============================================
INSERT INTO tehsils (tehsil) VALUES
    ('Lahore City'),
    ('Karachi Central'),
    ('Islamabad'),
    ('Rawalpindi'),
    ('Faisalabad'),
    ('Multan'),
    ('Peshawar'),
    ('Quetta'),
    ('Sialkot'),
    ('Gujranwala')
ON CONFLICT (tehsil) DO NOTHING;

-- =============================================
-- Functions for automatic timestamp updates
-- =============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at timestamps
CREATE TRIGGER update_usersdb_updated_at 
    BEFORE UPDATE ON usersdb 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adminsdb_updated_at 
    BEFORE UPDATE ON adminsdb 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS) Policies for Supabase
-- =============================================

-- Enable RLS on all tables
ALTER TABLE usersdb ENABLE ROW LEVEL SECURITY;
ALTER TABLE adminsdb ENABLE ROW LEVEL SECURITY;
ALTER TABLE tehsils ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usersdb
CREATE POLICY "Users can view own profile" ON usersdb
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON usersdb
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON usersdb
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for adminsdb
CREATE POLICY "Admins can view own profile" ON adminsdb
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can update own profile" ON adminsdb
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can insert own profile" ON adminsdb
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for requests
CREATE POLICY "Anyone can view requests" ON requests
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own requests" ON requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests" ON requests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update requests in their tehsil" ON requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM adminsdb
            WHERE adminsdb.id = auth.uid()
            AND adminsdb.tehsil = requests.tehsil
        )
    );

-- RLS Policies for tehsils
CREATE POLICY "Anyone can view tehsils" ON tehsils
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify tehsils" ON tehsils
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM adminsdb
            WHERE adminsdb.id = auth.uid()
        )
    );

-- =============================================
-- Comments for documentation
-- =============================================

COMMENT ON TABLE usersdb IS 'Extended user profile information linked to Supabase auth.users';
COMMENT ON TABLE adminsdb IS 'Admin-specific information linked to Supabase auth.users';
COMMENT ON TABLE tehsils IS 'Administrative divisions/regions for organizing requests';
COMMENT ON TABLE requests IS 'Citizen requests and complaints with status tracking';

COMMENT ON COLUMN requests.status IS 'Request status: Open, In Progress, Closed, Dropped';
COMMENT ON COLUMN requests.schedule IS 'Scheduled date for addressing the issue';
COMMENT ON COLUMN requests.image IS 'File path for uploaded image evidence';
COMMENT ON COLUMN requests.document IS 'File path for uploaded supporting document';
