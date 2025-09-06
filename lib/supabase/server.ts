import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Use server-side vars first, fallback to client-side vars
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Handle base64 encoded cookies properly
              if (value && typeof value === 'string' && value.startsWith('base64-')) {
                // Decode base64 cookies before storing
                const decodedValue = Buffer.from(value.slice(7), 'base64').toString('utf-8')
                cookieStore.set(name, decodedValue, options)
              } else {
                cookieStore.set(name, value, options)
              }
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
            // Ignore if called from Server Component
          }
        },
      },
    }
  )
}