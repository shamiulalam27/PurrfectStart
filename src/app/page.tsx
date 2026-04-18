import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Kittens" 
            fill 
            className={styles.heroImage} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.glassCard}>
             <span className={styles.badge}>Welcome to PurrfectStart</span>
             <h1 className={styles.title}>Giving Every Cat the Purrfect Start</h1>
             <p className={styles.subtitle}>
               The comprehensive, evidence-based platform for responsible feline ownership. Explore expert care guides, find trusted local vets, and connect with ethical adoption centres.
             </p>
             <div className={styles.heroActions}>
               <Link href="/adopt" className={`btn btn-primary ${styles.glowBtn}`}>Find a Companion</Link>
               <Link href="/guides" className={`btn btn-secondary ${styles.glowBtn}`}>Read Care Guides</Link>
             </div>
             
             <div className={styles.quickSearch}>
                <input type="text" placeholder="Search for vets, guides, or community topics..." className={styles.searchInput} />
                <button className={styles.searchButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Mission & Impact Section */}
      <section className={`section ${styles.missionSection}`}>
        <div className={`container ${styles.missionContainer}`}>
          <div className={styles.missionTextWrapper}>
            <span className={styles.sectionTopic}>Our Academic Mission</span>
            <h2 className={styles.sectionTitle}>Empowering Owners, Reducing Abandonment</h2>
            <p className={styles.missionText}>
              PurrfectStart was developed on the principle that many feline welfare issues stem from a lack of centralized, reliable information. Our goal is to unify <strong>education</strong>, <strong>community support</strong>, and <strong>trusted services</strong> into one seamless digital environment.
            </p>
            <Link href="/about" className={styles.textLink}>Learn more about our methodology &rarr;</Link>
          </div>
          <div className={styles.statsGrid}>
             <div className={styles.statCard}>
                <div className={styles.statIcon}>📚</div>
                <h3>Evidence-Based</h3>
                <p>Care Guides</p>
             </div>
             <div className={styles.statCard}>
                <div className={styles.statIcon}>🏥</div>
                <h3>Verified</h3>
                <p>Local Vet Practices</p>
             </div>
             <div className={styles.statCard}>
                <div className={styles.statIcon}>🏠</div>
                <h3>Ethical</h3>
                <p>Adoption Partners</p>
             </div>
             <div className={styles.statCard}>
                <div className={styles.statIcon}>💬</div>
                <h3>Moderated</h3>
                <p>Peer Community</p>
             </div>
          </div>
        </div>
      </section>

      {/* Pillar 1: Education */}
      <section className={`section ${styles.educationSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTopic}>Pillar 01: Education</span>
              <h2 className={styles.sectionTitle}>Master Feline Care</h2>
              <p className={styles.sectionSubtitle}>Dive into our library of expertly curated guides to ensure your cat thrives through every life stage.</p>
            </div>
            <Link href="/guides" className="btn btn-outline">View All Guides</Link>
          </div>

          <div className={styles.guideGrid}>
            {[
              { title: "Kitten Development", img: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop", desc: "Milestones from birth to 12 months." },
              { title: "Nutritional Needs", img: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600&auto=format&fit=crop", desc: "Understanding wet vs dry food and essential nutrients." },
              { title: "Behavioral Basics", img: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=600&auto=format&fit=crop", desc: "Decoding body language and preventing scratching." },
              { title: "Indoor Enrichment", img: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600&auto=format&fit=crop", desc: "Keeping your indoor cat mentally stimulated." },
            ].map((guide, idx) => (
              <div key={idx} className={styles.guideCard}>
                <div className={styles.guideImgWrapper}>
                  <Image src={guide.img} alt={guide.title} fill className={styles.guideImg} />
                  <div className={styles.guideOverlay}>
                    <button className={styles.readArticleBtn}>Read Article</button>
                  </div>
                </div>
                <div className={styles.guideInfo}>
                  <h4>{guide.title}</h4>
                  <p>{guide.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillar 2 & 3: Adoption & Vets (Split Section) */}
      <section className={`section ${styles.splitSection}`}>
        <div className="container">
          <div className={styles.splitGrid}>
            
            {/* Adoption Featured */}
            <div className={styles.splitPanel}>
              <span className={styles.sectionTopic}>Pillar 02: Adoption</span>
              <h2 className={styles.splitTitle}>Meet Your Match</h2>
              <p className={styles.splitDesc}>Connect with rescue partners to find cats in need of a loving home. We advocate for responsible, long-term adoptions.</p>
              
              <div className={styles.adoptionMiniCarousel}>
                <div className={styles.adoptCard}>
                  <div className={styles.adoptImgWrapper}>
                    <Image src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=400&auto=format&fit=crop" alt="Luna" fill className={styles.adoptImg} />
                  </div>
                  <div className={styles.adoptDetails}>
                    <h4>Luna</h4>
                    <span>2 Months • Female</span>
                  </div>
                </div>
                <div className={styles.adoptCard}>
                  <div className={styles.adoptImgWrapper}>
                    <Image src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=400&auto=format&fit=crop" alt="Oliver" fill className={styles.adoptImg} />
                  </div>
                  <div className={styles.adoptDetails}>
                    <h4>Oliver</h4>
                    <span>3 Years • Male</span>
                  </div>
                </div>
              </div>
              <Link href="/adopt" className={styles.textLink}>See more adoptable cats &rarr;</Link>
            </div>

            {/* Vet Finder */}
            <div className={`${styles.splitPanel} ${styles.vetPanel}`}>
              <div className={styles.vetPanelGlass}>
                <span className={styles.sectionTopic} style={{color: 'white'}}>Pillar 03: Vet Services</span>
                <h2 className={styles.splitTitle} style={{color: 'white'}}>Find Trusted Vets</h2>
                <p className={styles.splitDesc} style={{color: 'rgba(255,255,255,0.8)'}}>Your cat&apos;s health is paramount. Use our community-reviewed directory to find the best veterinary practices near you.</p>
                
                <div className={styles.vetSearchMock}>
                  <div className={styles.locationInputGroup}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <input type="text" placeholder="Enter postcode or city..." />
                  </div>
                  <button className="btn btn-secondary">Search Vets</button>
                </div>
              </div>
              <Image src="https://images.unsplash.com/photo-1628009368231-7bb7cbcb8122?q=80&w=1000&auto=format&fit=crop" alt="Vet Clinic" fill className={styles.vetPanelBg} />
            </div>

          </div>
        </div>
      </section>

      {/* Pillar 4: Community */}
      <section className={`section ${styles.communitySection}`}>
        <div className="container">
           <div className={styles.communityHeader}>
            <div className={styles.communityTitleWrapper}>
              <span className={styles.sectionTopic}>Pillar 04: Community</span>
              <h2 className={styles.sectionTitle}>Join the Conversation</h2>
              <p className={styles.sectionSubtitle}>A moderated, safe space to share experiences, ask questions, and support fellow cat owners.</p>
            </div>
            <Link href="/community" className="btn btn-primary">Enter Forum</Link>
          </div>

          <div className={styles.forumGrid}>
            <div className={styles.forumThread}>
              <div className={styles.threadMeta}>
                <span className={styles.tagHealth}>Health</span>
                <span className={styles.threadTime}>2 hours ago</span>
              </div>
              <h3 className={styles.threadTitle}>The First Vet Visit: What to Expect?</h3>
              <p className={styles.threadPreview}>I&apos;m taking my 8-week-old kitten to the vet tomorrow. Any tips on keeping her calm?</p>
              <div className={styles.threadAuthor}>
                <div className={styles.avatar}>A</div>
                <span>Posted by <strong>Alice_M</strong> • 12 replies</span>
              </div>
            </div>

            <div className={styles.forumThread}>
              <div className={styles.threadMeta}>
                <span className={styles.tagBehavior}>Behavior</span>
                <span className={styles.threadTime}>5 hours ago</span>
              </div>
              <h3 className={styles.threadTitle}>Introducing a new cat to a resident cat</h3>
              <p className={styles.threadPreview}>What is the best way to introduce them? I&apos;ve heard scent swapping works well...</p>
              <div className={styles.threadAuthor}>
                <div className={styles.avatar}>D</div>
                <span>Posted by <strong>DavidCatDad</strong> • 34 replies</span>
              </div>
            </div>

            <div className={styles.forumThread}>
              <div className={styles.threadMeta}>
                <span className={styles.tagDiet}>Diet</span>
                <span className={styles.threadTime}>1 day ago</span>
              </div>
              <h3 className={styles.threadTitle}>Wet food vs Dry food - Vet opinions?</h3>
              <p className={styles.threadPreview}>Our vet recommended mostly wet food for hydration. What brands do you trust?</p>
              <div className={styles.threadAuthor}>
                <div className={styles.avatar}>S</div>
                <span>Posted by <strong>SarahFeline</strong> • 89 replies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Footer Promo */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaContainer}`}>
          <h2>Ready to give a cat the Purrfect Start?</h2>
          <p>Sign up to our newsletter for weekly tips, cute stories, and latest platform updates.</p>
          <div className={styles.newsletterForm}>
            <input type="email" placeholder="Your email address..." />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>

    </main>
  );
}
