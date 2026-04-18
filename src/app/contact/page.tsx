'use client';

export default function ContactPage() {
  return (
    <main style={{background: 'var(--background-bg)', minHeight: '100vh', padding: '8rem 0 6rem 0'}}>
      <div className="container" style={{maxWidth: '1000px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem'}}>
        
        <div>
          <span style={{color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem'}}>Get in Touch</span>
          <h1 style={{fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1}}>We'd love to hear from you.</h1>
          <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6}}>
            Whether you have a question about our care guides, want to register your veterinary practice, or are a rescue center looking to list adoptable cats, our team is here to help.
          </p>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
              <div style={{background: '#FFF9F5', color: 'var(--primary-color)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h4 style={{margin: '0 0 0.2rem 0', fontSize: '1.1rem'}}>Email Us</h4>
                <p style={{margin: 0, color: 'var(--text-muted)'}}>support@purrfectstart.co.uk</p>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
               <div style={{background: '#F3E5F5', color: 'var(--secondary-color)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               </div>
               <div>
                 <h4 style={{margin: '0 0 0.2rem 0', fontSize: '1.1rem'}}>Visit Us (Academic Project HQ)</h4>
                 <p style={{margin: 0, color: 'var(--text-muted)'}}>University of Hertfordshire<br/>College Lane, Hatfield<br/>AL10 9AB, UK</p>
               </div>
            </div>
          </div>
        </div>

        <div style={{background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)'}}>
          <h3 style={{fontSize: '1.5rem', marginBottom: '2rem'}}>Send us a message</h3>
          <form style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)'}}>Full Name</label>
              <input type="text" placeholder="John Doe" style={{padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-body)'}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)'}}>Email Address</label>
              <input type="email" placeholder="john@example.com" style={{padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-body)'}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
               <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)'}}>Topic</label>
               <select style={{padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-body)'}}>
                 <option>General Inquiry</option>
                 <option>Clinic Registration</option>
                 <option>Rescue Centre Partnership</option>
                 <option>Report Community Issue</option>
               </select>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)'}}>Message</label>
              <textarea rows={5} placeholder="How can we help?" style={{padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'var(--font-body)', resize: 'vertical'}}></textarea>
            </div>
            <button className="btn btn-primary" type="button" style={{width: '100%', marginTop: '1rem', padding: '1rem'}}>Send Message</button>
          </form>
        </div>

      </div>
    </main>
  );
}
