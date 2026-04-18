'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (!error || typeof error !== 'object') return fallbackMessage

  const maybeError = error as { message?: unknown; code?: unknown }
  const message = typeof maybeError.message === 'string' ? maybeError.message : fallbackMessage
  const code = typeof maybeError.code === 'string' ? maybeError.code : undefined

  if (code === 'email_provider_disabled') {
    return 'Email/password signups are disabled in Supabase. Enable the Email provider in Supabase Auth settings to allow registration.'
  }

  return message
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('[auth][login] signInWithPassword failed:', error)
    const message = getAuthErrorMessage(error, 'Could not authenticate user')
    return redirect(`/login?message=${encodeURIComponent(message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const headerList = await headers()
  const origin =
    headerList.get('origin') ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    'http://localhost:3000'

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('[auth][signup] signUp failed:', error)
    const message = getAuthErrorMessage(error, 'Could not create account')
    return redirect(`/signup?message=${encodeURIComponent(message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check email to continue sign in process')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
