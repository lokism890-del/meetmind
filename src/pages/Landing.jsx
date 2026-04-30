import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid var(--border-soft)',
        background: 'rgba(15,13,26,0.85)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--purple), var(--teal))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}>⚡</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>MeetMind</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'var(--purple)', color: '#fff',
            border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 500
          }}>
          Get started
        </button>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{
          position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(108,92,231,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', maxWidth: 680 }}>
          <div className="badge badge-purple" style={{ marginBottom: '1.5rem', fontSize: 12 }}>
            ✦ AI-powered meeting intelligence
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            Your meetings,<br />
            <span style={{ color: 'var(--purple-light)' }}>remembered perfectly.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            MeetMind joins your calls, transcribes everything, and delivers clear summaries with action items — directly to your inbox.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'var(--purple)', color: '#fff', border: 'none',
                borderRadius: 10, padding: '14px 32px', fontSize: 16, fontWeight: 600,
                boxShadow: '0 0 32px rgba(108,92,231,0.35)'
              }}>
              Get started free →
            </button>
            <button style={{
              background: 'transparent', color: 'var(--text-muted)',
              border: '1px solid var(--border-soft)',
              borderRadius: 10, padding: '14px 28px', fontSize: 15
            }}>
              See how it works
            </button>
          </div>
          <p style={{ marginTop: '2rem', fontSize: 13, color: 'var(--text-dim)' }}>
            No credit card required · Free for 5 meetings/month
          </p>
        </div>

        {/* Feature cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16, marginTop: '5rem', width: '100%', maxWidth: 780, position: 'relative'
        }}>
          {[
            { icon: '🤖', title: 'Auto-joins calls', desc: 'Zoom, Meet & Teams — no setup per meeting' },
            { icon: '📝', title: 'Full transcript', desc: 'Speaker-labeled, searchable, always accurate' },
            { icon: '⚡', title: 'Instant summary', desc: 'Decisions & action items in your inbox in minutes' },
            { icon: '🔗', title: 'CRM sync', desc: 'Push notes to HubSpot, Salesforce, Notion' },
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', fontSize: 12, color: 'var(--text-dim)', borderTop: '1px solid var(--border-soft)' }}>
        © 2026 MeetMind · Built with ⚡
      </footer>
    </div>
  );
}