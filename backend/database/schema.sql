-- Database schema for fitness app user profiles
-- This table stores user profile information collected during the 8-step post-signup process

-- Enable UUID extension for user IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    
    -- Signup progress tracking
    signup_completed BOOLEAN DEFAULT FALSE,
    signup_step INTEGER DEFAULT 0 CHECK (signup_step >= 0 AND signup_step <= 7),
    
    -- Step-specific data storage (JSON format for flexibility)
    step_0_data JSONB, -- Basic info (name, age, gender, etc.)
    step_1_data JSONB, -- Physical measurements (height, weight, etc.)
    step_2_data JSONB, -- Fitness goals
    step_3_data JSONB, -- Activity level and experience
    step_4_data JSONB, -- Health conditions and restrictions
    step_5_data JSONB, -- Dietary preferences
    step_6_data JSONB, -- Schedule and availability
    step_7_data JSONB, -- Final preferences and onboarding
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_signup_completed ON user_profiles(signup_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_signup_step ON user_profiles(signup_step);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Example of what step data might look like (for reference):
-- step_0_data: {"full_name": "John Doe", "age": 25, "gender": "male"}
-- step_1_data: {"height": 175, "weight": 70, "unit_system": "metric"}
-- step_2_data: {"primary_goal": "weight_loss", "secondary_goals": ["muscle_gain", "endurance"]}
-- step_3_data: {"activity_level": "moderate", "experience": "beginner", "current_routine": "none"}
-- step_4_data: {"health_conditions": [], "medications": [], "restrictions": []}
-- step_5_data: {"dietary_restrictions": [], "preferences": ["vegetarian"], "allergies": []}
-- step_6_data: {"available_days": ["monday", "wednesday", "friday"], "preferred_time": "morning"}
-- step_7_data: {"notification_preferences": true, "data_sharing": false, "onboarding_complete": true}

-- Comments for documentation
COMMENT ON TABLE user_profiles IS 'Stores user profile information collected during the 8-step post-signup process';
COMMENT ON COLUMN user_profiles.signup_step IS 'Current step in the signup process (0-7)';
COMMENT ON COLUMN user_profiles.step_0_data IS 'Basic personal information (name, age, gender)';
COMMENT ON COLUMN user_profiles.step_1_data IS 'Physical measurements and body composition';
COMMENT ON COLUMN user_profiles.step_2_data IS 'Fitness goals and objectives';
COMMENT ON COLUMN user_profiles.step_3_data IS 'Activity level and fitness experience';
COMMENT ON COLUMN user_profiles.step_4_data IS 'Health conditions and medical restrictions';
COMMENT ON COLUMN user_profiles.step_5_data IS 'Dietary preferences and restrictions';
COMMENT ON COLUMN user_profiles.step_6_data IS 'Schedule availability and workout preferences';
COMMENT ON COLUMN user_profiles.step_7_data IS 'Final preferences and onboarding completion';




