import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main style={{background: 'var(--background-bg)', minHeight: '100vh', padding: '8rem 0 6rem 0'}}>
      <div className="container" style={{maxWidth: '800px', background: 'white', padding: '4rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)'}}>
        <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>Privacy Policy</h1>
        <p style={{color: 'var(--text-muted)', marginBottom: '3rem'}}>Last Updated: October 12, 2025</p>

        <div style={{fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-dark)'}}>
          <p>
            Welcome to PurrfectStart. We are committed to protecting your personal information and your right to privacy. 
            This privacy policy fully complies with the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>1. What information do we collect?</h2>
          <p>
            We collect personal information that you voluntarily provide to us when registering at PurrfectStart, expressing an interest in obtaining information about us or our products and services, when participating in activities on the platform (such as posting in our community forums or reviewing veterinary practices) or otherwise contacting us.
          </p>
          <ul style={{marginLeft: '2rem', marginBottom: '1.5rem'}}>
            <li>Names</li>
            <li>Email addresses</li>
            <li>Location data (for the Vet Finder functionality)</li>
            <li>Passwords and contact preferences</li>
          </ul>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>2. How do we use your information?</h2>
          <p>
            We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. Specifically:
          </p>
          <ul style={{marginLeft: '2rem', marginBottom: '1.5rem'}}>
            <li>To facilitate account creation and logon process.</li>
            <li>To provide location-based veterinary service recommendations.</li>
            <li>To moderate community forum content and uphold safety standards.</li>
            <li>To connect potential adopters with verified rescue organisations.</li>
          </ul>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>3. Will your information be shared with anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services (e.g., passing adoption interest to a verified rescue), to protect your rights, or to fulfill business obligations. We clearly state that <strong>PurrfectStart is not responsible for adoption outcomes</strong> and merely facilitates connections.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>4. Disclaimer of Liability</h2>
          <p>
            All medical and care advice provided on PurrfectStart is educational and informational. It does not replace professional veterinary consultation. We are not liable for user-generated content or veterinary service experiences external to our platform.
          </p>

          <h2 style={{fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem'}}>5. What are your privacy rights?</h2>
          <p>
            In some regions (like the EEA and UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time. You have the right to request access, rectification, or erasure of your personal data.
          </p>

          <div style={{marginTop: '4rem', padding: '2rem', background: '#F4F6F9', borderRadius: 'var(--radius-md)', textAlign: 'center'}}>
            <h3 style={{marginBottom: '1rem'}}>Questions about this policy?</h3>
            <p style={{marginBottom: '1.5rem'}}>If you have any questions or comments about this policy, please reach out to us.</p>
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
