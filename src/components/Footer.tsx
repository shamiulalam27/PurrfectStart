import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerGrid}`}>
                <div className={styles.brandCol}>
                    <Link href="/" className={styles.logo}>
                        Purrfect<span className={styles.logoHighlight}>Start</span>
                    </Link>
                    <p className={styles.brandDesc}>
                        Empowering cat owners, reducing abandonment, and ensuring every feline gets the purrfect start they deserve through evidence-based education and community support.
                    </p>
                    <p className={styles.academicNote}>
                        Designed for COMP1682 Final Year Project.
                    </p>
                </div>

                <div className={styles.linksCol}>
                    <h3 className={styles.colTitle}>Platform</h3>
                    <ul className={styles.linkList}>
                        <li><Link href="/" className={styles.footerLink}>Home</Link></li>
                        <li><Link href="/guides" className={styles.footerLink}>Care Guides</Link></li>
                        <li><Link href="/adopt" className={styles.footerLink}>Adoption Portal</Link></li>
                        <li><Link href="/vet-finder" className={styles.footerLink}>Vet Finder</Link></li>
                        <li><Link href="/community" className={styles.footerLink}>Community Forum</Link></li>
                    </ul>
                </div>

                <div className={styles.linksCol}>
                    <h3 className={styles.colTitle}>Support & Legal</h3>
                    <ul className={styles.linkList}>
                        <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>
                        <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
                        <li><Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link></li>
                        <li><Link href="/terms" className={styles.footerLink}>Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className={styles.bottomBar}>
                <div className={`container ${styles.bottomContent}`}>
                    <p>&copy; {new Date().getFullYear()} PurrfectStart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
