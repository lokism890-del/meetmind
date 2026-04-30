import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MeetingCard from '../components/MeetingCard';

const STATS = [
  { label: 'This week', value: '12', sub: 'meetings recorded' },
  { label: 'Hours saved', value: '4.2', sub: 'vs manual notes' },
  { label: 'Action items', value: '27', sub: 'tracked this week' },
  { label: 'Team members', value: '8', sub: 'in your workspace' },
];

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const firstName = user?.firstName || 'there';
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMeetings() {
      try {
        console.log('API URL:', import.meta.env.VITE_API_URL);
        const token = await getToken();
        console.log('Token obtained:', token ? 'yes' : 'no');
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/meetings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Meetings loaded:', data.length);
        setMeetings(data);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMeetings();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            Good morning, {firstName} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Here's what happened in your meetings this week.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12, marginBottom: '2.5rem'
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border-soft)',
              borderRadius: 12, padding: '1rem 1.25rem'
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontFamily: 'Syne', fontWeight: 700, marginBottom: 3 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Connect calendar CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,92,231,0.12), rgba(0,206,201,0.06))',
          border: '1px solid rgba(108,92,231,0.25)',
          borderRadius: 14, padding: '1.25rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, marginBottom: '2rem', flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
              📅 Connect your calendar to start recording
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              MeetMind will automatically join your scheduled video calls.
            </div>
          </div>
          <button style={{
            background: 'var(--purple)', color: '#fff', border: 'none',
            borderRadius: 9, padding: '10px 22px', fontSize: 14, fontWeight: 500,
            flexShrink: 0
          }}>
            Connect Google Calendar →
          </button>
        </div>

        {/* Meetings list */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Recent meetings</h2>
          <span style={{ fontSize: 13, color: 'var(--purple-light)', cursor: 'pointer' }}>View all</span>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
            Loading meetings...
          </div>
        )}

        {error && (
          <div style={{
            textAlign: 'center', color: '#ff6b6b',
            padding: '2rem', background: 'rgba(255,80,80,0.05)',
            borderRadius: 12, border: '1px solid rgba(255,80,80,0.15)'
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Failed to load meetings</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Error: {error}</div>
          </div>
        )}

        {!loading && !error && meetings.length === 0 && (
          <div style={{
            textAlign: 'center', color: 'var(--text-muted)',
            padding: '3rem', background: 'var(--surface)',
            borderRadius: 12, border: '1px solid var(--border-soft)'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎙️</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 600, marginBottom: 8 }}>No meetings yet</div>
            <div style={{ fontSize: 13 }}>Connect your calendar to start recording meetings automatically.</div>
          </div>
        )}

        {!loading && !error && meetings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {meetings.map(m => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        )}

      </main>
    </div>
  );
}