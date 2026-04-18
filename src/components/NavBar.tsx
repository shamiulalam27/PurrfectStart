'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { logout } from '@/app/login/actions';
import styles from './NavBar.module.css';

export default function NavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const supabase = useMemo(() => createClient(), []);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        // Server Actions / redirects can update cookies without triggering onAuthStateChange.
        // Re-fetch user whenever the route changes so the NavBar updates instantly.
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        fetchUser();
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }, [pathname, supabase]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const getInitial = () => {
        if (!user) return '';
        const name = user.user_metadata?.full_name || user.email || 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    Purrfect<span className={styles.logoHighlight}>Start</span>
                </Link>
                
                {/* Mobile Menu Toggle */}
                <button 
                    className={`${styles.mobileToggle} ${isMobileMenuOpen ? styles.mobileToggleActive : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <span className={styles.hamburgerLine}></span>
                    <span className={styles.hamburgerLine}></span>
                    <span className={styles.hamburgerLine}></span>
                </button>

                <nav className={`${styles.navigation} ${isMobileMenuOpen ? styles.navActive : ''}`}>
                    <ul className={styles.navList}>
                        <li><Link href="/" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                        <li><Link href="/guides" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Care Guides</Link></li>
                        <li><Link href="/adopt" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Adoption</Link></li>
                        <li><Link href="/vet-finder" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Vets</Link></li>
                        <li><Link href="/community" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Community</Link></li>
                    </ul>
                    
                    <div className={styles.actions}>
                        {user ? (
                            <div className={styles.profileMenuContainer}>
                                <button 
                                    className={styles.avatarBtn} 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className={styles.avatarInitial}>
                                        {getInitial()}
                                    </div>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className={styles.dropdownMenu}>
                                        <div className={styles.dropdownHeader}>
                                            <p className={styles.dropdownName}>{user.user_metadata?.full_name || 'User'}</p>
                                            <p className={styles.dropdownEmail}>{user.email}</p>
                                        </div>
                                        <div className={styles.dropdownLinks}>
                                            <Link 
                                                href="/profile" 
                                                className={styles.dropdownItem}
                                                onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                                            >
                                                My Profile
                                            </Link>
                                            <button 
                                                className={styles.dropdownItem}
                                                onClick={async () => {
                                                    setIsDropdownOpen(false);
                                                    setIsMobileMenuOpen(false);
                                                    // Optimistically update UI in case the logout redirect
                                                    // keeps us on the same route (e.g. logging out from '/').
                                                    setUser(null);
                                                    router.refresh();
                                                    await logout();
                                                }}
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className={styles.loginBtn}>Log In</Link>
                                <Link href="/signup" className={`btn btn-primary ${styles.signupBtn}`}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
