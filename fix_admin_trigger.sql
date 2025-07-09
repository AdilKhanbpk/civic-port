-- Fix the admin trigger issue
-- This script updates the existing trigger to handle admin users properly

-- First, drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Update the function to handle admin users differently
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

-- Recreate the trigger with the updated function
CREATE TRIGGER on_auth_user_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
