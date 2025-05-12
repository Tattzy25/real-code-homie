import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createUsersTable() {
  try {
    // Check if the table exists
    const { error: checkError } = await supabase.from("users").select("id").limit(1)

    if (checkError) {
      console.log("Users table does not exist, creating it...")

      // Create the users table
      const { error } = await supabase.rpc("create_users_table", {})

      if (error) {
        throw error
      }

      console.log("Users table created successfully")
    } else {
      console.log("Users table already exists")
    }

    // Create RLS policies
    await setupRLS()

    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
  }
}

async function setupRLS() {
  try {
    // Enable RLS on the users table
    const { error: rlsError } = await supabase.rpc("enable_rls_on_users", {})

    if (rlsError) {
      throw rlsError
    }

    console.log("RLS enabled on users table")

    // Create policies
    const { error: policyError } = await supabase.rpc("create_users_policies", {})

    if (policyError) {
      throw policyError
    }

    console.log("RLS policies created successfully")
  } catch (error) {
    console.error("Error setting up RLS:", error)
  }
}

// Run the migration
createUsersTable()
