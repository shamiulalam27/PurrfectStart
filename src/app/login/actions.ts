'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

const DUPLICATE_SIGNUP_MESSAGE = 'Account already exists with this email.'
const ACCOUNT_DOES_NOT_EXIST_MESSAGE =
  "Account doesn't exist with such email. Please open one with that email."

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') return undefined
  const maybeError = error as { message?: unknown }
  return typeof maybeError.message === 'string' ? maybeError.message : undefined
}

function getErrorCode(error: unknown) {
  if (!error || typeof error !== 'object') return undefined
  const maybeError = error as { code?: unknown }
  return typeof maybeError.code === 'string' ? maybeError.code : undefined
}

function isEmailAlreadyRegisteredError(error: unknown) {
  const code = (getErrorCode(error) ?? '').toLowerCase()
  const message = (getErrorMessage(error) ?? '').toLowerCase()

  return (
    code === 'user_already_exists' ||
    code === 'email_exists' ||
    code === 'email_already_in_use' ||
    message.includes('already registered') ||
    message.includes('already exists') ||
    message.includes('user already registered')
  )
}

function isInvalidLoginCredentialsError(error: unknown) {
  const code = (getErrorCode(error) ?? '').toLowerCase()
  const message = (getErrorMessage(error) ?? '').toLowerCase()

  return (
    code === 'invalid_login_credentials' ||
    code === 'invalid_credentials' ||
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials')
  )
}

async function doesAuthAccountExistByEmail(email: string): Promise<boolean | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return null

  const admin = createSupabaseAdminClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
  })

  if (!error) return true

  const code = (getErrorCode(error) ?? '').toLowerCase()
  const message = (getErrorMessage(error) ?? '').toLowerCase()

  if (code === 'user_not_found' || message.includes('user not found')) {
    return false
  }

  // If the admin check fails for any other reason, don't block login messaging.
  console.error('[auth][login] admin existence check failed:', error)
  return null
}

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

function getRequestOrigin(headerList: Headers) {
  const forwardedHost = headerList.get('x-forwarded-host')
  const host = (forwardedHost ?? headerList.get('host'))?.split(',')[0]?.trim()

  const forwardedProto =
    headerList.get('x-forwarded-proto') ?? headerList.get('x-forwarded-protocol')
  const proto = forwardedProto?.split(',')[0]?.trim()

  if (host) {
    const resolvedProto = proto ?? (host.includes('localhost') ? 'http' : 'https')
    return `${resolvedProto}://${host}`
  }

  const origin =
    headerList.get('origin') ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    process.env.DEPLOY_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    'http://localhost:3000'

  return origin.replace(/\/$/, '')
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

    if (isInvalidLoginCredentialsError(error) && typeof data.email === 'string') {
      const accountExists = await doesAuthAccountExistByEmail(data.email)
      if (accountExists === false) {
        return redirect(`/login?message=${encodeURIComponent(ACCOUNT_DOES_NOT_EXIST_MESSAGE)}`)
      }
    }

    const message = getAuthErrorMessage(error, 'Could not authenticate user')
    return redirect(`/login?message=${encodeURIComponent(message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const headerList = await headers()
  const origin = getRequestOrigin(headerList)

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

  const { data: signUpData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('[auth][signup] signUp failed:', error)
    const message = isEmailAlreadyRegisteredError(error)
      ? DUPLICATE_SIGNUP_MESSAGE
      : getAuthErrorMessage(error, 'Could not create account')
    return redirect(`/signup?message=${encodeURIComponent(message)}`)
  }

  // Supabase may return a successful response for an existing email,
  // but with no new identity created.
  const identities = signUpData?.user?.identities
  if (Array.isArray(identities) && identities.length === 0) {
    return redirect(`/signup?message=${encodeURIComponent(DUPLICATE_SIGNUP_MESSAGE)}`)
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
