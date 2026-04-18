import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: guide } = await supabase.from('guides').select('*').eq('slug', slug).single();

  if (!guide) {
    notFound();
  }

  return (
    <main className={styles.main}>
      {/* Article Hero */}
      <section className={styles.articleHero}>
        <div className={styles.heroBackground}>
          <Image 
            src={guide.image_url || "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=2000&auto=format&fit=crop"} 
            alt={guide.title} 
            fill 
            className={styles.heroImage} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.glassHeader}>
            <div className={styles.breadcrumb}>
              <Link href="/guides" className={styles.breadcrumbLink}>Care Guides</Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span>{guide.category_label}</span>
            </div>
            
            <h1 className={styles.articleTitle}>{guide.title}</h1>
            
            <div className={styles.articleMeta}>
              <div className={styles.authorInfo}>
                <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=100&auto=format&fit=crop" alt="Dr. Sarah Jenkins" width={30} height={30} className={styles.authorAvatar} />
                <span>By <strong>Dr. Sarah Jenkins</strong>, DVM</span>
              </div>
              <div className={styles.dateInfo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>Last updated: Oct 15, 2025</span>
              </div>
              <div className={styles.readTimeInfo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>8 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className={styles.articleBody}>
        <div className={`container ${styles.articleLayout}`}>
          
          <div className={styles.contentArea}>
            <p className={styles.leadParagraph} style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-dark)', marginBottom: '2rem' }}>
              {guide.description}
            </p>
            <p>
              Bringing a new kitten or cat into your home is an incredibly rewarding experience, but it also comes with significant responsibilities. The <strong>PurrfectStart contextual report</strong> highlights that education is the most critical factor in preventing feline abandonment. By understanding their needs—from nutrition to environmental enrichment—you ensure a long, healthy, and happy life for your companion.
            </p>

            <h2>Understanding Their Primal Instincts</h2>
            <p>
              Despite thousands of years of domestication, cats retain many of their wild ancestors' behavioral traits. They are obligate carnivores, natural hunters, and highly territorial creatures. Recognizing these innate behaviors is the first step in providing a suitable environment.
            </p>
            
            <div className={styles.infoBox}>
              <div className={styles.infoBoxTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Did you know?
              </div>
              <p style={{marginBottom: 0}}>Cats sleep an average of 12-16 hours a day. This energy conservation is a direct evolutionary link to their hunting ancestors who needed massive bursts of energy to stalk and catch prey.</p>
            </div>

            <h2>Essential Nutritional Pathways</h2>
            <p>
              Nutrition is the cornerstone of preventative health. A common debate among new owners involves the choice between wet and dry food. 
            </p>
            <ul>
              <li><strong>Wet Food:</strong> Provides crucial hydration, which is essential because cats have a naturally low thirst drive. This helps prevent urinary tract issues and kidney disease.</li>
              <li><strong>Dry Food:</strong> Convenient for free-feeding and can be put in puzzle feeders to encourage mental stimulation and physical activity.</li>
              <li><strong>Life Stages:</strong> Ensure the food you purchase is formulated specifically for your cat's life stage (kitten, adult, or senior).</li>
            </ul>

            <h2>Environmental Enrichment</h2>
            <p>
              Indoor cats are shielded from predators and traffic, significantly extending their lifespans. However, the indoors can be exceptionally boring without proper enrichment. You must proactively create opportunities for them to express natural behaviors.
            </p>
            <p>
              Provide vertical territory (cat trees, shelving) as cats naturally feel safer observing their domain from a height. Incorporate daily interactive play sessions mimicking the 'hunt-catch-kill' cycle using wand toys, followed by a meal to complete the predatory sequence.
            </p>

            <h2>When to Consult a Professional</h2>
            <p>
              While this guide provides a foundation, every cat is unique. Sudden changes in behavior, appetite, or litter box habits should always be addressed by a veterinarian. Use our <Link href="/vet-finder" style={{color: 'var(--primary-color)', fontWeight: 700}}>Vet Finder</Link> to locate a highly-rated professional near you.
            </p>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.tocCard}>
              <h3 className={styles.tocTitle}>Table of Contents</h3>
              <ul className={styles.tocList}>
                <li className={styles.tocItem}><Link href="#" className={styles.tocLink}>Understanding Their Primal Instincts</Link></li>
                <li className={styles.tocItem}><Link href="#" className={styles.tocLink}>Essential Nutritional Pathways</Link></li>
                <li className={styles.tocItem}><Link href="#" className={styles.tocLink}>Environmental Enrichment</Link></li>
                <li className={styles.tocItem}><Link href="#" className={styles.tocLink}>When to Consult a Professional</Link></li>
              </ul>
            </div>

            <div className={styles.relatedCard}>
              <h3>Got specific questions?</h3>
              <p>Our community forum is full of experienced owners ready to help.</p>
              <Link href="/community" className="btn btn-primary" style={{background: 'white', color: 'var(--secondary-color)'}}>Ask the Community</Link>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
