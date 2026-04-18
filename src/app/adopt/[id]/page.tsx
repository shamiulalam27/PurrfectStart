import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

export default async function PetProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: cat } = await supabase.from('cats').select('*').eq('id', id).single();

  if (!cat) {
    notFound();
  }

  return (
    <main className={styles.main}>
      {/* Profile Hero */}
      <section className={styles.profileHero}>
        <div className={styles.heroBackground}>
          <Image 
            src={cat.image_url || "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2000&auto=format&fit=crop"} 
            alt={`Photo of ${cat.name}`} 
            fill 
            className={styles.heroImage} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.glassProfile}>
            <div className={styles.profileHeader}>
              <div className={styles.breadcrumb}>
                <Link href="/adopt" className={styles.breadcrumbLink}>Adoption Directory</Link>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span>{cat.name}</span>
              </div>
              
              <h1 className={styles.catName}>
                {cat.name} <span className={styles.statusBadge}>{cat.status}</span>
              </h1>
              
              <div className={styles.catQuickView}>
                <div className={styles.quickStat}>
                  <strong>Age:</strong> {cat.age}
                </div>
                <div className={styles.quickStat}>
                  <strong>Gender:</strong> {cat.gender}
                </div>
                <div className={styles.quickStat}>
                  <strong>Breed:</strong> {cat.breed}
                </div>
              </div>
            </div>

            <div className={styles.actionArea}>
              <button className={`btn btn-primary ${styles.primaryBtn}`}>Apply to Adopt</button>
              <button className={`btn ${styles.secondaryBtn}`}>Sponsor {cat.name}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className={styles.profileDetails}>
        <div className={`container ${styles.layoutGrid}`}>
          
          {/* Main Info */}
          <div className={styles.mainInfo}>
            <div className={styles.aboutSection}>
              <h2>Meet {cat.name}</h2>
              <div className={styles.traitsGrid}>
                {cat.traits?.map((trait: string) => (
                  <span key={trait} className={styles.traitChip}>🐾 {trait}</span>
                ))}
              </div>
              
              <div className={styles.aboutText}>
                <p>
                  {cat.name} is a wonderful {cat.color} {cat.breed} with a lot of love to give. Currently looking for a loving home where they can thrive. Please review the traits above to see if this beautiful cat could be your purrfect companion.
                </p>
              </div>

              <div className={styles.detailStats}>
                <div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Ideal Home</div>
                    <div className={styles.detailValue}>Quiet to Moderate activity</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Space Requirements</div>
                    <div className={styles.detailValue}>Needs indoor access, safe garden optional</div>
                  </div>
                </div>
                <div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Grooming Needs</div>
                    <div className={styles.detailValue}>{cat.breed.includes('Longhair') || cat.breed.includes('Maine Coon') ? 'High (Daily brushing)' : 'Low-Moderate (Occasional brushing)'}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Activity Level</div>
                    <div className={styles.detailValue}>Moderate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            
            {/* Medical Info */}
            <div className={styles.infoCard}>
              <h3>Medical & Care History</h3>
              <ul className={styles.checkList}>
                <li className={styles.checkItem}>
                  <svg className={styles.checkIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Neutered / Spayed</span>
                </li>
                <li className={styles.checkItem}>
                  <svg className={styles.checkIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Microchipped</span>
                </li>
                <li className={styles.checkItem}>
                  <svg className={styles.checkIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Up to date on vaccinations</span>
                </li>
                <li className={styles.checkItem}>
                  <svg className={styles.checkIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Flea & worm treated</span>
                </li>
              </ul>
            </div>

            {/* Rescue Partner */}
            <div className={styles.infoCard}>
              <h3>Rescue Partner</h3>
              <div className={styles.rescuePartner}>
                <div className={styles.partnerLogo}>🏠</div>
                <div className={styles.partnerInfo}>
                  <h4>London Feline Rescue</h4>
                  <p>Registered Charity #123456</p>
                </div>
              </div>
              <Link href="#" style={{display: 'block', color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center'}}>
                View all cats from this rescue
              </Link>
            </div>

            {/* Preparation CTA */}
            <div className={styles.infoCard} style={{background: '#FFF9F5', borderColor: '#FF8F6A'}}>
              <h3>First Time Owner?</h3>
              <p style={{fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
                Make sure your home is ready for a new arrival.
              </p>
              <Link href="/guides" className="btn btn-outline" style={{width: '100%', borderColor: '#FF8F6A', color: '#FF8F6A'}}>
                Read Care Guides
              </Link>
            </div>

          </aside>
        </div>
      </section>
    </main>
  );
}
