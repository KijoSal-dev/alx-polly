import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase env vars missing in middleware, continuing without auth')
      return response
    }

    const supabase = createMiddlewareClient({
      req: request,
      res: response,
      supabaseUrl,
      supabaseKey
    })
    
    // Refresh the auth session
    await supabase.auth.getSession()
    
  } catch (error) {
    console.error('Middleware auth error:', error)
    // Continue without breaking the app
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}