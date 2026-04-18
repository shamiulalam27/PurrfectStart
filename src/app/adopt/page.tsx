import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

export default async function AdoptIndex() {
  const supabase = await createClient();
  const { data: cats } = await supabase.from('cats').select('*');
  const displayCats = cats || [];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="https://images.unsplash.com/photo-1615336049448-9da64fbbbcaf?q=80&w=2000&auto=format&fit=crop" 
            alt="Adorable kittens playing" 
            fill 
            className={styles.heroImage} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.glassCard}>
            <h1 className={styles.title}>Find Your Companion</h1>
            <p className={styles.subtitle}>
              Every cat deserves a loving home. Browse our verified adoption listings from trusted local rescue partners and find the perfect match for your family.
            </p>
          </div>
        </div>
      </section>

      {/* Adoption Directory */}
      <section className={styles.adoptionSection}>
        <div className={`container ${styles.layout}`}>
          
          {/* Sidebar */}
          <aside className={styles.filtersSidebar}>
            <div className={styles.filterHeader}>
              <h3>Filters</h3>
              <button className={styles.clearBtn}>Clear All</button>
            </div>
            
            <div className={styles.filterGroup}>
              <h4>Age</h4>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Kitten (0-6 months)
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Young (6m-3 years)
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Adult (3-7 years)
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Senior (7+ years)
              </label>
            </div>

            <div className={styles.filterGroup}>
              <h4>Gender</h4>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Male
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Female
              </label>
            </div>

            <div className={styles.filterGroup}>
              <h4>Good With</h4>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Children
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Other Cats
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Dogs
              </label>
            </div>
          </aside>

          {/* Results Grid */}
          <div className={styles.resultsArea}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsCount}>Showing <strong>{displayCats.length}</strong> available cats</div>
              <div className={styles.sortOptions}>
                <select style={{padding: '0.4rem', borderRadius: '4px', border: '1px solid #E2E8F0', outline: 'none'}}>
                  <option>Newest Additions</option>
                  <option>Age: Young to Old</option>
                  <option>Age: Old to Young</option>
                </select>
              </div>
            </div>

            <div className={styles.catGrid}>
              {displayCats.map((cat) => (
                <div key={cat.id} className={styles.catCard}>
                  <div className={styles.catImgWrapper}>
                    <div className={styles.statusBadge} style={{background: cat.status === 'Pending' ? '#F6AD55' : 'rgba(45, 55, 72, 0.8)'}}>
                      {cat.status}
                    </div>
                    <Image src={cat.image_url} alt={cat.name} fill className={styles.catImg} />
                  </div>
                  <div className={styles.catInfo}>
                    <div className={styles.catHeaderRow}>
                      <h4>{cat.name}</h4>
                      {cat.gender === 'Female' ? (
                        <svg className={styles.genderIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="6"></circle><line x1="12" y1="16" x2="12" y2="22"></line><line x1="9" y1="19" x2="15" y2="19"></line></svg>
                      ) : (
                        <svg className={styles.genderIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="14" r="6"></circle><line x1="14.24" y1="9.76" x2="21" y2="3"></line><line x1="16" y1="3" x2="21" y2="3"></line><line x1="21" y1="8" x2="21" y2="3"></line></svg>
                      )}
                    </div>
                    <div className={styles.catMeta}>
                      {cat.breed} • {cat.age} • {cat.color}
                    </div>
                    <div className={styles.catAttributes}>
                      {cat.traits?.map((trait: string) => (
                        <span key={trait} className={styles.attrChip}>{trait}</span>
                      ))}
                    </div>
                    <Link href={`/adopt/${cat.id}`} className={`btn btn-outline ${styles.meetBtn}`}>Meet {cat.name}</Link>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.ctaBox}>
              <h3>Not ready to adopt? Consider fostering.</h3>
              <p>Fostering saves lives by providing a temporary, safe environment for cats awaiting their forever homes.</p>
              <button className="btn" style={{backgroundColor: 'white', color: 'var(--primary-color)'}}>Learn About Fostering</button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
