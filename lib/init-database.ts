import { getSupabaseServiceClient } from "@/lib/supabase/client"

// This script is meant to be run manually to initialize the database
// You can run it with: npx tsx lib/init-database.ts

async function initDatabase() {
  try {
    console.log("Starting database initialization...")

    const supabase = getSupabaseServiceClient()

    // Create users table if it doesn't exist
    const { error: usersTableError } = await supabase.rpc("create_users_table_if_not_exists", {})

    if (usersTableError) {
      // If RPC doesn't exist, create the table directly
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          subscription_tier TEXT NOT NULL DEFAULT 'free',
          subscription_status TEXT DEFAULT 'active',
          subscription_id TEXT,
          payment_provider TEXT,
          usage_count INTEGER DEFAULT 0,
          daily_limit INTEGER DEFAULT 3,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)

      if (error) throw error
      console.log("Users table created")
    } else {
      console.log("Users table exists")
    }

    // Create conversations table if it doesn't exist
    const { error: convoError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) NOT NULL,
        title TEXT NOT NULL DEFAULT 'New Conversation',
        model TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_pinned BOOLEAN DEFAULT FALSE,
        last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    if (convoError) throw convoError
    console.log("Conversations table created")

    // Create messages table if it doesn't exist
    const { error: msgError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tokens_used INTEGER DEFAULT 0,
        model TEXT
      );
    `)

    if (msgError) throw msgError
    console.log("Messages table created")

    // Create subscriptions table if it doesn't exist
    const { error: subError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) NOT NULL,
        subscription_id TEXT NOT NULL,
        provider TEXT NOT NULL,
        status TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        current_period_start TIMESTAMP WITH TIME ZONE,
        current_period_end TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        cancel_at_period_end BOOLEAN DEFAULT FALSE
      );
    `)

    if (subError) throw subError
    console.log("Subscriptions table created")

    // Create usage_logs table if it doesn't exist
    const { error: usageError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.usage_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.users(id) NOT NULL,
        action_type TEXT NOT NULL,
        tokens_used INTEGER DEFAULT 0,
        model TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    if (usageError) throw usageError
    console.log("Usage logs table created")

    // Create newsletter_subscribers table if it doesn't exist
    const { error: newsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        unsubscribed_at TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT TRUE
      );
    `)

    if (newsError) throw newsError
    console.log("Newsletter subscribers table created")

    // Create demo user if it doesn't exist
    const { data: existingDemo, error: demoCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("email", "demo@codehomie.com")
      .maybeSingle()

    if (demoCheckError) throw demoCheckError

    if (!existingDemo) {
      // Create demo user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: "demo@codehomie.com",
        password: "demo123",
        email_confirm: true,
      })

      if (authError) throw authError
      console.log("Demo user created in auth:", authData.user.id)

      // Create user record
      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: "demo@codehomie.com",
        subscription_tier: "pro", // Give demo users pro access
      })

      if (userError) throw userError
      console.log("Demo user record created")
    } else {
      console.log("Demo user already exists")
    }

    console.log("Database initialization complete!")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

initDatabase()
