import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <main style={{background: 'var(--background-bg)', minHeight: '100vh', padding: '8rem 0 6rem 0'}}>
      <div className="container" style={{maxWidth: '800px', background: 'white', padding: '4rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)'}}>
        <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>Terms of Service</h1>
        <p style={{color: 'var(--text-muted)', marginBottom: '3rem'}}>Last Updated: October 12, 2025</p>

        <div style={{fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-dark)'}}>
          <p>
            Welcome to PurrfectStart. By accessing or using our platform, you agree to be bound by these Terms of Service.
            Please read them carefully. If you do not agree with any part of these terms, you must not use the platform.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>1. Use of the Platform</h2>
          <p>
            PurrfectStart provides evidence-based cat care education, adoption connections, a community forum, and a vet-finder tool.
            You agree to use these services lawfully, respectfully, and in accordance with any guidance we publish. You are responsible
            for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>2. Educational Content Only</h2>
          <p>
            All care guides, articles, and community discussions are for informational and educational purposes only.
            They do not constitute veterinary advice and must not be used as a substitute for professional consultation.
            Always seek the advice of a qualified veterinarian regarding the health of your cat.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>3. Adoption and Third Parties</h2>
          <p>
            PurrfectStart facilitates introductions between potential adopters and independent rescue organisations.
            We do not rehome animals ourselves and are not a party to any adoption agreement. <strong>PurrfectStart is not responsible
            for adoption outcomes</strong>, the conduct of rescues or adopters, or the experiences you have with any veterinary
            practice listed in the Vet Finder.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>4. User-Generated Content</h2>
          <p>
            You retain ownership of content you post to community forums and reviews, but grant us a non-exclusive licence to
            display and moderate it on the platform. You must not post content that is unlawful, harmful, defamatory, or infringes
            the rights of others. We reserve the right to remove content and suspend accounts that breach these terms.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, PurrfectStart is not liable for any indirect, incidental, or consequential
            loss arising from your use of the platform, reliance on educational content, or interactions with third parties
            introduced through the service.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>6. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be reflected by updating the &ldquo;Last Updated&rdquo;
            date above. Continued use of the platform after changes take effect constitutes acceptance of the revised terms.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>7. Governing Law</h2>
          <p>
            These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction
            of the courts of England and Wales.
          </p>

          <div style={{marginTop: '4rem', padding: '2rem', background: '#F4F6F9', borderRadius: 'var(--radius-md)', textAlign: 'center'}}>
            <h3 style={{marginBottom: '1rem'}}>Questions about these terms?</h3>
            <p style={{marginBottom: '1.5rem'}}>If anything is unclear, we&apos;re happy to help clarify.</p>
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
