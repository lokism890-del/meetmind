import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const STEPS = [
  { num: 1, title: 'Connect your calendar', desc: 'MeetMind reads your upcoming meetings from Google Calendar or Outlook.' },
  { num: 2, title: 'Bot joins your calls', desc: 'A silent bot joins each video call — Zoom, Google Meet, or Teams.' },
  { num: 3, title: 'Get your summary', desc: 'Decisions, action items, and transcript emailed within 5 minutes of the call ending.' },
];

export default function Onboarding() {
  const navigate = useNavigate();

  const connectGoogle = () => {
    // This will trigger your backend OAuth flow
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 560, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(108,92,231,0.3), rgba(0,206,201,0.2))',
          border: '1px solid rgba(108,92,231,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, margin: '0 auto 1.5rem'
        }}>📅</div>

        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}>
          Connect your calendar
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: '2.5rem', lineHeight: 1.7 }}>
          MeetMind joins your meetings automatically — no manual recording needed.
        </p>

        {/* Steps */}
        <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', gap: 14, marginBottom: i < STEPS.length - 1 ? 20 : 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(108,92,231,0.2)', border: '1px solid rgba(108,92,231,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'var(--purple-light)'
              }}>{s.num}</div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={connectGoogle}
          style={{
            width: '100%', background: 'var(--purple)', color: '#fff', border: 'none',
            borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 600,
            marginBottom: 10, boxShadow: '0 0 28px rgba(108,92,231,0.3)'
          }}
        >
          Connect Google Calendar
        </button>

        <button style={{
          width: '100%', background: 'var(--bg3)', color: 'var(--text-muted)',
          border: '1px solid var(--border-soft)', borderRadius: 10, padding: '13px',
          fontSize: 14, marginBottom: 20
        }}>
          Connect Outlook instead
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 13, cursor: 'pointer' }}
        >
          Skip for now — I'll connect later
        </button>

        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: '1.5rem' }}>
          We only request read access to your calendar. We never modify or delete events.
        </p>
      </main>
    </div>
  );
}
