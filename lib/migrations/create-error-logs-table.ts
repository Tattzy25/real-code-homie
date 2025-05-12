import { createClient } from "@supabase/supabase-js"

// This script is meant to be run manually to create the error_logs table
// You can run it with: npx tsx lib/migrations/create-error-logs-table.ts

async function createErrorLogsTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log("Creating error_logs table...")

    // Create error_logs table
    const { error } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.error_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        message TEXT NOT NULL,
        user_id UUID REFERENCES public.users(id),
        path TEXT,
        component TEXT,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        stack_trace TEXT,
        context JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Add index for faster queries
      CREATE INDEX IF NOT EXISTS error_logs_timestamp_idx ON public.error_logs (timestamp);
      CREATE INDEX IF NOT EXISTS error_logs_severity_idx ON public.error_logs (severity);
      CREATE INDEX IF NOT EXISTS error_logs_user_id_idx ON public.error_logs (user_id);
    `)

    if (error) throw error
    console.log("Error logs table created successfully!")
  } catch (error) {
    console.error("Error creating error_logs table:", error)
  }
}

createErrorLogsTable()
