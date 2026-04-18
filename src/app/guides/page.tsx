import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

export default async function GuidesIndex() {
  const supabase = await createClient();
  const { data: guides } = await supabase.from('guides').select('*');
  const displayGuides = guides || [];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="https://images.unsplash.com/photo-1529778456-ccde01a61356?q=80&w=2000&auto=format&fit=crop" 
            alt="Reading about cats" 
            fill 
            className={styles.heroImage} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.glassCard}>
            <h1 className={styles.title}>Evidence-Based Care Guides</h1>
            <p className={styles.subtitle}>
              Empowering you with the knowledge to provide the best possible care. Reviewed by veterinary professionals and feline behaviorists.
            </p>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Search guides by topic or keyword..." className={styles.searchInput} />
              <button className={styles.searchButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.categoriesList}>
            <button className={`${styles.categoryBtn} ${styles.categoryBtnActive}`}>All Topics</button>
            <button className={styles.categoryBtn}>Kitten Growth</button>
            <button className={styles.categoryBtn}>Health & Diet</button>
            <button className={styles.categoryBtn}>Behavior</button>
            <button className={styles.categoryBtn}>Lifestyle</button>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className={`section ${styles.contentSection}`}>
        <div className="container">
          <span className={styles.sectionTopic}>Library</span>
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          
          <div className={styles.guideGrid}>
            {displayGuides.map((guide) => (
              <Link href={`/guides/${guide.slug}`} key={guide.slug} className={styles.guideCard}>
                <div className={styles.guideImgWrapper}>
                  <div className={styles.guideBadge}>{guide.category_label}</div>
                  <Image src={guide.image_url} alt={guide.title} fill className={styles.guideImg} />
                </div>
                <div className={styles.guideInfo}>
                  <h4>{guide.title}</h4>
                  <p>{guide.description}</p>
                  <div className={styles.readMore}>
                    Read Full Guide 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.ctaBox}>
            <h3>Can&apos;t find what you&apos;re looking for?</h3>
            <p>Our community forum is active 24/7. Ask questions and get answers from experienced cat owners and vetted professionals.</p>
            <Link href="/community" className="btn btn-secondary">Visit the Community Forum</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
