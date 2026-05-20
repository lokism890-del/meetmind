import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MeetingCard from '../components/MeetingCard';

const STATS = [
  { label: 'This week', value: '12', sub: 'meetings recorded', icon: '🎙️', color: '#7c3aed', glow: 'rgba(124,58,237,0.3)' },
  { label: 'Hours saved', value: '4.2', sub: 'vs manual notes', icon: '⏱️', color: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
  { label: 'Action items', value: '27', sub: 'tracked this week', icon: '✅', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
  { label: 'Team members', value: '8', sub: 'in your workspace', icon: '👥', color: '#ec4899', glow: 'rgba(236,72,153,0.3)' },
];

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  body {
    background: #07050f !important;
    font-family: 'DM Sans', sans-serif !important;
  }

  .meetmind-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: orb-float 8s ease-in-out infinite;
  }

  .orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%);
    top: -200px; left: -100px;
    animation-delay: 0s;
  }

  .orb-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%);
    top: 100px; right: -150px;
    animation-delay: -3s;
  }

  .orb-3 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%);
    bottom: 0; left: 30%;
    animation-delay: -5s;
  }

  .orb-4 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
    bottom: 100px; right: 20%;
    animation-delay: -2s;
  }

  @keyframes orb-float {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
    33% { transform: translateY(-30px) scale(1.05); opacity: 1; }
    66% { transform: translateY(15px) scale(0.95); opacity: 0.7; }
  }

  .stat-card {
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    cursor: pointer;
  }

  .stat-card:hover {
    transform: translateY(-8px) scale(1.03) !important;
  }

  .meeting-row {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    cursor: pointer;
  }

  .meeting-row:hover {
    transform: translateX(6px) !important;
  }

  .connect-btn {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    position: relative;
    overflow: hidden;
  }

  .connect-btn::after {
    content: '';
    position: absolute;
    top: -50%; left: -60%;
    width: 40%; height: 200%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
    transform: skewX(-20deg);
    transition: left 0.5s ease;
  }

  .connect-btn:hover::after { left: 130%; }
  .connect-btn:hover { transform: translateY(-3px) scale(1.02) !important; }
  .connect-btn:active { transform: translateY(0) scale(0.98) !important; }

  .gradient-text {
    background: linear-gradient(135deg, #f1f0ff 0%, #c4b5fd 40%, #a78bfa 70%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-value-text {
    background: linear-gradient(135deg, #ffffff 0%, #e0d9ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .badge-pulse {
    animation: badge-glow 2s ease-in-out infinite;
  }

  @keyframes badge-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
    50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }

  .page-enter {
    animation: page-slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes page-slide-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .stat-enter {
    animation: stat-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .stat-enter:nth-child(1) { animation-delay: 0.05s; }
  .stat-enter:nth-child(2) { animation-delay: 0.1s; }
  .stat-enter:nth-child(3) { animation-delay: 0.15s; }
  .stat-enter:nth-child(4) { animation-delay: 0.2s; }

  @keyframes stat-pop {
    from { opacity: 0; transform: translateY(20px) scale(0.9); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
`;
if (!document.querySelector('#meetmind-styles')) {
  style.id = 'meetmind-styles';
  document.head.appendChild(style);
}

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.firstName || 'there';
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/meetings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMeetings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMeetings();
  }, [getToken]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07050f', position: 'relative' }}>

      {/* Animated background orbs */}
      <div className="meetmind-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* Grid overlay */}
      <div className="grid-bg" />

      <Navbar />

      <main className="page-enter" style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="gradient-text" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 6,
            letterSpacing: '-0.02em'
          }}>
            {getGreeting()}, {firstName} 👋
          </h1>
          <p style={{ color: 'rgba(139,133,168,0.8)', fontSize: 14 }}>
            Here's what happened in your meetings this week.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          marginBottom: '2rem'
        }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="stat-card stat-enter"
              style={{
                background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${s.color}25`,
                borderRadius: 18,
                padding: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Glow accent */}
              <div style={{
                position: 'absolute',
                top: -20, right: -20,
                width: 80, height: 80,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />

              {/* Top border accent */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                borderRadius: '18px 18px 0 0'
              }} />

              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: 'rgba(139,133,168,0.7)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {s.label}
              </div>
              <div className="stat-value-text" style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1,
                marginBottom: 4
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(74,69,104,0.9)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Connect Calendar CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 50%, rgba(236,72,153,0.08) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 20,
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: '2rem',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Shimmer overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(6,182,212,0.05) 100%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 5,
              color: '#f1f0ff'
            }}>
              📅 Connect your calendar to start recording
            </div>
            <div style={{ fontSize: 13, color: 'rgba(139,133,168,0.8)' }}>
              MeetMind will automatically join your scheduled video calls.
            </div>
          </div>

          <button
            className="connect-btn"
            onClick={() => navigate('/connect-calendar')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '11px 24px',
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              flexShrink: 0,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
              position: 'relative',
              zIndex: 1,
              letterSpacing: '0.01em'
            }}
          >
            Connect Google Calendar →
          </button>
        </div>

        {/* Meetings Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: '#f1f0ff'
          }}>
            Recent meetings
          </h2>
          <span style={{
            fontSize: 13,
            color: '#a78bfa',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}>
            View all →
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            textAlign: 'center',
            color: 'rgba(139,133,168,0.7)',
            padding: '3rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 16,
            border: '1px solid rgba(124,58,237,0.1)'
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
            <div style={{ fontSize: 14 }}>Loading meetings...</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            textAlign: 'center',
            color: '#f87171',
            padding: '2rem',
            background: 'rgba(239,68,68,0.05)',
            borderRadius: 16,
            border: '1px solid rgba(239,68,68,0.15)'
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Failed to load meetings</div>
            <div style={{ fontSize: 12, color: 'rgba(139,133,168,0.7)' }}>{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && meetings.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'rgba(139,133,168,0.7)',
            padding: '3rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 16,
            border: '1px solid rgba(124,58,237,0.1)'
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎙️</div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              marginBottom: 8,
              fontSize: 15,
              color: '#f1f0ff'
            }}>
              No meetings yet
            </div>
            <div style={{ fontSize: 13 }}>
              Connect your calendar to start recording meetings automatically.
            </div>
          </div>
        )}

        {/* Meetings List */}
        {!loading && !error && meetings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meetings.map((m, i) => (
              <div
                key={m.id}
                className="meeting-row"
                onClick={() => navigate(`/meeting/${m.id}`)}
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(124,58,237,0.12)',
                  borderRadius: 14,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  backdropFilter: 'blur(10px)',
                  animationDelay: `${i * 0.05}s`
                }}
              >
                <div style={{
                  width: 38, height: 38,
                  borderRadius: 10,
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0
                }}>
                  🎙️
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f0ff', marginBottom: 2 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(139,133,168,0.7)' }}>
                    {m.attendees?.join(', ') || '·· attendees'}
                  </div>
                </div>
                <span className={m.status === 'done' ? 'badge-pulse' : ''} style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: m.status === 'done'
                    ? 'rgba(16,185,129,0.15)'
                    : m.status === 'processing'
                    ? 'rgba(245,158,11,0.15)'
                    : 'rgba(124,58,237,0.15)',
                  color: m.status === 'done'
                    ? '#10b981'
                    : m.status === 'processing'
                    ? '#f59e0b'
                    : '#a78bfa',
                  border: `1px solid ${m.status === 'done'
                    ? 'rgba(16,185,129,0.3)'
                    : m.status === 'processing'
                    ? 'rgba(245,158,11,0.3)'
                    : 'rgba(124,58,237,0.3)'}`,
                  textTransform: 'capitalize'
                }}>
                  {m.status === 'done' ? '✨ Summarized' : m.status === 'processing' ? '⏳ Processing' : '📅 Upcoming'}
                </span>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
