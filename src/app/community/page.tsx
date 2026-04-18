import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

const getCategoryClass = (category: string) => {
  switch(category) {
    case 'Health': return styles.tagHealth;
    case 'Behavior': return styles.tagBehavior;
    case 'Diet': return styles.tagDiet;
    default: return styles.tagGeneral;
  }
};

export default async function CommunityIndex() {
  const supabase = await createClient();
  const { data: threads } = await supabase.from('threads').select('*').order('created_at', { ascending: false });
  const displayThreads = threads || [];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=2000&auto=format&fit=crop" 
            alt="Cats sitting together" 
            fill 
            className={styles.heroImage} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.glassCard}>
            <h1 className={styles.title}>PurrfectStart Community</h1>
            <p className={styles.subtitle}>
              A moderated, safe space to share experiences, ask questions, and support fellow cat owners.
            </p>
            
            <div className={styles.searchForm}>
              <input type="text" placeholder="Search the forums for discussions..." className={styles.searchInput} />
              <button className={`btn btn-primary ${styles.searchBtn}`}>Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Content */}
      <section className={styles.forumSection}>
        <div className={`container ${styles.layout}`}>
          
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <button className={`btn btn-primary ${styles.newThreadBtn}`} style={{marginBottom: '2rem'}}>
               Start a New Discussion
            </button>
            
            <h3 className={styles.sidebarTitle}>Categories</h3>
            <ul className={styles.navMenu}>
              <li className={styles.navItem}>
                <Link href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
                  All Discussions <span className={styles.navCount}>{displayThreads.length}</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="#" className={styles.navLink}>
                  Health & Wellness <span className={styles.navCount}>432</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="#" className={styles.navLink}>
                  Behavior & Training <span className={styles.navCount}>512</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="#" className={styles.navLink}>
                  Diet & Nutrition <span className={styles.navCount}>256</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="#" className={styles.navLink}>
                  General Chat <span className={styles.navCount}>89</span>
                </Link>
              </li>
            </ul>

            <div style={{background: '#FFF9F5', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #FF8F6A'}}>
              <h4 style={{margin: '0 0 0.5rem 0', color: '#FF8F6A'}}>Guidelines</h4>
              <p style={{fontSize: '0.85rem', color: '#718096', margin: 0, lineHeight: 1.5}}>
                Be respectful. No medical diagnosing—always consult a vet. Protect privacy.
              </p>
            </div>
          </aside>

          {/* Board Area */}
          <div className={styles.boardArea}>
            <div className={styles.boardHeader}>
              <h2>Recent Discussions</h2>
              <select className={styles.sortSelect}>
                <option>Newest Replies</option>
                <option>Newest Posts</option>
                <option>Most Viewed</option>
              </select>
            </div>

            <div className={styles.threadList}>
              {displayThreads.map(thread => (
                <div key={thread.id} className={styles.threadCard}>
                  <div className={styles.threadContent}>
                    <div className={styles.threadTop}>
                      <span className={`${styles.categoryTag} ${getCategoryClass(thread.category)}`}>
                        {thread.category}
                      </span>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>• {new Date(thread.created_at).toLocaleDateString()}</span>
                    </div>
                    <Link href={`#`}>
                      <h3 className={styles.threadTitle}>{thread.title}</h3>
                    </Link>
                    <p className={styles.threadPreview}>{thread.content.substring(0, 150)}...</p>
                    
                    <div className={styles.threadMeta}>
                      <div className={styles.authorAvatar}>{thread.author_name.charAt(0).toUpperCase()}</div>
                      <span>Posted by <strong>{thread.author_name}</strong></span>
                    </div>
                  </div>

                  <div className={styles.threadStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{thread.replies_count}</span>
                      <span className={styles.statLabel}>Replies</span>
                    </div>
                    <div className={styles.statItem} style={{marginTop: '0.5rem'}}>
                      <span className={styles.statValue} style={{fontSize: '0.9rem', fontWeight: 400}}>{thread.views_count}</span>
                      <span className={styles.statLabel}>Views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{textAlign: 'center', marginTop: '3rem'}}>
              <button className="btn btn-outline">Load More Discussions</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
