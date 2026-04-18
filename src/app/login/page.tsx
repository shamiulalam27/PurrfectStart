import Image from 'next/image';
import Link from 'next/link';
import { login } from './actions';
import styles from './page.module.css';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage(props: Props) {
  const searchParams = await props.searchParams
  const message = searchParams?.message

  return (
    <main className={styles.main}>
      <div className={styles.heroBackground}>
        <Image 
          src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=2000&auto=format&fit=crop" 
          alt="Cat sleeping peacefully" 
          fill 
          className={styles.heroImage} 
          priority 
        />
        <div className={styles.heroOverlay}></div>
      </div>
      
      <div className={styles.glassCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to join the community.</p>

        <form>
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
            />
          </div>

          <button formAction={login} className={`btn btn-primary ${styles.submitBtn}`}>
            Log In
          </button>

          {message && (
            <div className={styles.message}>
              {message}
            </div>
          )}

          <div className={styles.linkText}>
            Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
