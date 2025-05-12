-- Create users table function
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create the users table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    subscription_tier TEXT NOT NULL DEFAULT 'free',
    subscription_id TEXT,
    subscription_status TEXT,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    monthly_credits INTEGER DEFAULT 100,
    credits_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create updated_at trigger
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create trigger for updated_at
  DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
  CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$;

-- Enable RLS function
CREATE OR REPLACE FUNCTION enable_rls_on_users()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Enable row level security
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
END;
$$;

-- Create RLS policies function
CREATE OR REPLACE FUNCTION create_users_policies()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
  DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
  DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;

  -- Create policies
  CREATE POLICY "Users can view their own data"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own data"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

  CREATE POLICY "Service role can manage all users"
    ON public.users
    USING (auth.role() = 'service_role');
END;
$$;
