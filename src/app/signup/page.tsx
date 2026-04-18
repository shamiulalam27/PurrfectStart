import Image from 'next/image';
import Link from 'next/link';
import { signup } from '@/app/login/actions';
import styles from '@/app/login/page.module.css';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SignupPage(props: Props) {
  const searchParams = await props.searchParams
  const message = searchParams?.message

  return (
    <main className={styles.main}>
      <div className={styles.heroBackground}>
        <Image 
          src="https://images.unsplash.com/photo-1615336049448-9da64fbbbcaf?q=80&w=2000&auto=format&fit=crop" 
          alt="Adorable kitten" 
          fill 
          className={styles.heroImage} 
          priority 
        />
        <div className={styles.heroOverlay}></div>
      </div>
      
      <div className={styles.glassCard}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join PurrfectStart to connect and learn.</p>

        <form>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">Full Name</label>
            <input 
              className={styles.input}
              id="name" 
              name="name" 
              type="text" 
              placeholder="John Doe"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input 
              className={styles.input}
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input 
              className={styles.input}
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>

          <button formAction={signup} className={`btn btn-primary ${styles.submitBtn}`}>
            Sign Up
          </button>

          {message && (
            <div className={styles.message}>
              {message}
            </div>
          )}

          <div className={styles.linkText}>
            Already have an account? <Link href="/login">Log In</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
