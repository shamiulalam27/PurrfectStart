import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)

  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  const successUrl = new URL('/signup/confirmed', requestUrl.origin)
  const errorUrl = new URL('/login', requestUrl.origin)

  // Create the response up-front so Supabase can attach cookies.
  const response = NextResponse.redirect(successUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth][callback] exchangeCodeForSession failed:', error)
      errorUrl.searchParams.set('message', error.message)
      response.headers.set('Location', errorUrl.toString())
    }

    return response
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash: tokenHash,
    })

    if (error) {
      console.error('[auth][callback] verifyOtp failed:', error)
      errorUrl.searchParams.set('message', error.message)
      response.headers.set('Location', errorUrl.toString())
    }

    return response
  }

  errorUrl.searchParams.set('message', 'Invalid or expired confirmation link')
  response.headers.set('Location', errorUrl.toString())
  return response
}
