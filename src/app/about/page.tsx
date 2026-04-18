import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main style={{background: 'var(--background-bg)', minHeight: '100vh', padding: '8rem 0 6rem 0'}}>
      <div className="container" style={{maxWidth: '800px'}}>
        <span style={{color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem'}}>About The Project</span>
        <h1 style={{fontSize: '3.5rem', marginBottom: '2rem'}}>The PurrfectStart Mission</h1>
        
        <div style={{position: 'relative', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '3rem'}}>
           <Image src="https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=1200&auto=format&fit=crop" alt="Cat looking thoughtful" fill style={{objectFit: 'cover'}} />
        </div>

        <div style={{fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-dark)'}}>
          <p>
            The issue of the welfare and adequate treatment of domestic cats and kittens is of great concern to new pet owners. Many are often unable to find reliable information and help in a centralized environment. Taking cats without proper knowledge of their needs causes possible health risks, behavioral problems, and unfortunately, cases of abandonment.
          </p>
          <h2 style={{fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem'}}>An Academic Endeavour</h2>
          <p>
            PurrfectStart was developed as part of the COMP1682 Final Year Project by Shamiul Alam (Business Computing BSc Hons). This interactive web-based platform was designed to act as an all-in-one resource center for potential and existing cat owners.
          </p>
          <p>
            The platform encompasses educational information, adoption facilitation, community involvement mechanisms, and veterinary services discovery. By providing step-by-step instructions on care, searchable listings of local veterinarians, an adoption portal, and a peer-to-peer support community forum, PurrfectStart aims to significantly decrease the rates of cat abandonment.
          </p>
          
          <h2 style={{fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem'}}>Our Four Pillars</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem'}}>
            <div style={{background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'}}>
               <h3 style={{color: 'var(--primary-color)', marginBottom: '0.5rem'}}>Education</h3>
               <p style={{fontSize: '0.95rem', color: 'var(--text-muted)'}}>Evidence-based, accessible care guides reviewed by professionals to ensure your cat thrives.</p>
            </div>
            <div style={{background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'}}>
               <h3 style={{color: 'var(--primary-color)', marginBottom: '0.5rem'}}>Adoption</h3>
               <p style={{fontSize: '0.95rem', color: 'var(--text-muted)'}}>Ethical matching with local rescue partners to provide forever homes for cats in need.</p>
            </div>
            <div style={{background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'}}>
               <h3 style={{color: 'var(--primary-color)', marginBottom: '0.5rem'}}>Vet Services</h3>
               <p style={{fontSize: '0.95rem', color: 'var(--text-muted)'}}>A trusted, community-reviewed directory of feline-friendly veterinary practices.</p>
            </div>
            <div style={{background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'}}>
               <h3 style={{color: 'var(--primary-color)', marginBottom: '0.5rem'}}>Community</h3>
               <p style={{fontSize: '0.95rem', color: 'var(--text-muted)'}}>A moderated, safe forum for peer peer support, sharing advice, and celebrating feline companionship.</p>
            </div>
          </div>
        </div>
        
        <div style={{marginTop: '4rem', textAlign: 'center'}}>
          <Link href="/" className="btn btn-primary" style={{padding: '1rem 3rem'}}>Return Home</Link>
        </div>
      </div>
    </main>
  );
}
