import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the extended profile from public.profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const joinDate = new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const getInitial = () => {
      const name = profile?.full_name || user.email || 'U';
      return name.charAt(0).toUpperCase();
  };

  return (
    <main className={styles.main}>
      <div className={styles.heroBackground}>
        <div className={styles.heroGradient}></div>
      </div>

      <div className={`container ${styles.profileContainer}`}>
        <div className={styles.glassCard}>
          <div className={styles.headerArea}>
            <div className={styles.avatarLarge}>
               {getInitial()}
            </div>
            <div className={styles.titleInfo}>
              <h1 className={styles.name}>{profile?.full_name || 'Anonymous User'}</h1>
              <p className={styles.joinDate}>Member since {joinDate}</p>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailBox}>
              <span className={styles.label}>Email Address</span>
              <p className={styles.value}>{user.email}</p>
            </div>
            <div className={styles.detailBox}>
              <span className={styles.label}>Account Status</span>
              <p className={styles.value}>
                <span className={styles.statusBadge}>Active</span>
              </p>
            </div>
          </div>
          
          <div className={styles.comingSoonBox}>
            <h3>More coming soon!</h3>
            <p>Soon you'll be able to view your saved guides, tracked cats for adoption, and your community forum posts right here.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
