'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from '@/app/login/page.module.css'

export default function SignupConfirmedPage() {
  const router = useRouter()
  const [secondsRemaining, setSecondsRemaining] = useState(5)

  useEffect(() => {
    if (secondsRemaining <= 0) {
      router.replace('/')
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsRemaining((current) => current - 1)
    }, 1000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [secondsRemaining, router])

  return (
    <main className={styles.main}>
      <div className={styles.heroBackground}>
        <Image
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000&auto=format&fit=crop"
          alt="Cat background"
          fill
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay}></div>
      </div>

      <div className={styles.glassCard}>
        <h1 className={styles.title}>Thank you for signing up!</h1>
        <p className={styles.subtitle}>Your account is confirmed.</p>

        <div className={styles.message}>
          Redirecting to the homepage in {secondsRemaining} seconds...
        </div>
      </div>
    </main>
  )
}
