import Navbar from '../components/Navbar';
import MeetingCard from '../components/MeetingCard';
import { useUser } from '@clerk/clerk-react';

const MOCK_MEETINGS = [
  { id: '1', title: 'Q3 sales pipeline review', date: 'Today', duration: '48 min', attendees: 5, platform: 'zoom',  status: 'done' },
  { id: '2', title: 'Product roadmap sync — Eng team', date: 'Today', duration: 'In progress', attendees: 3, platform: 'meet',  status: 'live' },
  { id: '3', title: 'Investor update call — Series A', date: 'Tomorrow 10:00 AM', duration: '—', attendees: 4, platform: 'teams', status: 'upcoming' },
  { id: '4', title: 'Customer onboarding — Acme Corp', date: 'Apr 29', duration: '32 min', attendees: 6, platform: 'zoom',  status: 'done' },
  { id: '5', title: 'Weekly design review', date: 'Apr 28', duration: '55 min', attendees: 4, platform: 'meet',  status: 'done' },
];

const STATS = [
  { label: 'This week', value: '12', sub: 'meetings recorded' },
  { label: 'Hours saved', value: '4.2', sub: 'vs manual notes' },
  { label: 'Action items', value: '27', sub: 'tracked this week' },
  { label: 'Team members', value: '8', sub: 'in your workspace' },
];

export default function Dashboard() {
  const { user } = useUser();
  const firstName = user?.firstName || 'there';

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

        {/* Connect calendar CTA — shown when no calendar connected */}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOCK_MEETINGS.map(m => <MeetingCard key={m.id} meeting={m} />)}
        </div>
      </main>
    </div>
  );
}
