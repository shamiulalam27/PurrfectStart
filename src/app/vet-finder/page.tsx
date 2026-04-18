import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

export default async function VetFinder() {
  const supabase = await createClient();
  const { data: vets } = await supabase.from('veterinarians').select('*');
  const displayVets = vets || [];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="https://images.unsplash.com/photo-1628009368231-7bb7cbcb8122?q=80&w=2000&auto=format&fit=crop" 
            alt="Veterinary clinic" 
            fill 
            className={styles.heroImage} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.glassCard}>
            <h1 className={styles.title}>Find Trusted Veterinary Care</h1>
            <p className={styles.subtitle}>
              Your cat's health is paramount. Use our community-reviewed directory to find the best veterinary practices near you, specifically graded for feline-friendly care.
            </p>
            
            <div className={styles.searchForm}>
              <div className={styles.searchInputGroup}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <input type="text" placeholder="Enter postcode or city..." />
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.searchInputGroup}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <input type="text" placeholder="Special requirements (e.g., 24/7)..." />
              </div>
              <button className={`btn btn-primary ${styles.searchBtn}`}>Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Content */}
      <section className={styles.directorySection}>
        <div className="container">
          <div className={styles.directoryHeader}>
            <h2>Top Rated Veterinarians Near London</h2>
            <div className={styles.filters}>
              <select style={{padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', background: 'white'}}>
                <option>Sort by: Nearest</option>
                <option>Sort by: Highest Rated</option>
                <option>Sort by: Most Reviewed</option>
              </select>
            </div>
          </div>

          <div className={styles.directoryGrid}>
            {displayVets.map(vet => (
              <div key={vet.id} className={styles.vetCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.vetName}>{vet.name}</h3>
                    <div className={styles.vetSpecialty}>{vet.specialty}</div>
                  </div>
                  <div className={styles.ratingBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    {vet.rating} ({vet.reviews_count})
                  </div>
                </div>

                <div className={styles.contactInfo}>
                  <div className={styles.infoRow}>
                    <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>{vet.address} <br/><strong style={{color: 'var(--text-dark)'}}>{vet.distance}</strong></span>
                  </div>
                  <div className={styles.infoRow}>
                    <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>{vet.phone}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>{vet.hours}</span>
                  </div>
                </div>

                <div className={styles.featuresList}>
                  {vet.features?.map((feature: string) => (
                    <span key={feature} className={styles.featureChip}>{feature}</span>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`#`} className="btn btn-primary">Book Appointment</Link>
                  <Link href={`#`} className="btn btn-outline" style={{borderColor: 'var(--border-color)', color: 'var(--text-dark)'}}>Read Reviews</Link>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.ctaBox}>
            <h3>Are you a registered veterinary professional?</h3>
            <p>Claim your practice profile or register your clinic to connect with thousands of responsible cat owners in your area.</p>
            <button className="btn" style={{background: 'white', color: 'var(--secondary-color)'}}>Register Clinic</button>
          </div>
        </div>
      </section>
    </main>
  );
}
