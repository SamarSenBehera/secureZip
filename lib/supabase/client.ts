import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

// Create a single supabase client for the entire client-side application
export const createClient = () => {
  return createClientComponentClient<Database>()
}
