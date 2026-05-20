import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MeetingCard from "../components/MeetingCard";
const STATS = [
  { label: 'This week', value: '12', sub: 'meetings recorded', icon: '🎙️', color: '#7c3aed', glow: 'rgba(124,58,237,0.4)' },
  { label: 'Hours saved', value: '4.2', sub: 'vs manual notes', icon: '⏱️', color: '#06b6d4', glow: 'rgba(6,182,212,0.4)' },
  { label: 'Action items', value: '27', sub: 'tracked this week', icon: '✅', color: '#10b981', glow: 'rgba(16,185,129,0.4)' },
  { label: 'Team members', value: '8', sub: 'in your workspace', icon: '👥', color: '#ec4899', glow: 'rgba(236,72,153,0.4)' },
];

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  body {
    background: #0a0a0f !important;
    font-family: 'Inter', sans-serif !important;
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
    filter: blur(100px);
    animation: orb-float 12s ease-in-out infinite;
  }

  .orb-1 {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
    top: -250px; left: -150px;
    animation-delay: 0s;
  }

  .orb-2 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%);
    top: 50%; right: -200px;
    animation-delay: -4s;
  }

  .orb-3 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%);
    bottom: -150px; left: 40%;
    animation-delay: -7s;
  }

  .orb-4 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
    top: -100px; right: 30%;
    animation-delay: -10s;
  }

  @keyframes orb-float {
    0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.6; }
    25% { transform: translateY(-40px) scale(1.08) rotate(5deg); opacity: 0.9; }
    50% { transform: translateY(-20px) scale(0.95) rotate(-3deg); opacity: 0.7; }
    75% { transform: translateY(20px) scale(1.02) rotate(2deg); opacity: 0.8; }
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 90%);
  }

  .stat-card {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    cursor: pointer;
    transform-style: preserve-3d;
    perspective: 1000px;
    position: relative;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(6,182,212,0.3), rgba(236,72,153,0.3));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .stat-card:hover {
    transform: translateY(-12px) scale(1.05) rotateX(5deg) !important;
    box-shadow: 0 20px 60px rgba(124,58,237,0.3), 0 10px 20px rgba(0,0,0,0.4) !important;
  }

  .stat-card:hover::before {
    opacity: 1;
  }

  .stat-icon-wrapper {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }

  .stat-card:hover .stat-icon-wrapper {
    transform: scale(1.15) rotate(-5deg);
  }

  .stat-card:active {
    transform: translateY(-4px) scale(0.98) !important;
  }

  .meeting-row {
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    cursor: pointer;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .meeting-row:hover {
    transform: translateX(8px) translateY(-4px) rotateX(2deg) !important;
    box-shadow: 0 15px 40px rgba(124,58,237,0.2), 0 5px 15px rgba(0,0,0,0.3) !important;
    border-color: rgba(124,58,237,0.3) !important;
  }

  .meeting-row:active {
    transform: translateX(4px) translateY(-2px) scale(0.99) !important;
  }

  .connect-btn {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    position: relative;
    overflow: hidden;
    transform-style: preserve-3d;
  }

  .connect-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s ease;
  }

  .connect-btn::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 14px;
    background: linear-gradient(135deg, #7c3aed, #06b6d4, #ec4899);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    filter: blur(10px);
  }

  .connect-btn:hover {
    transform: translateY(-4px) scale(1.05) rotateX(3deg) !important;
    box-shadow: 0 20px 40px rgba(124,58,237,0.5), 0 10px 20px rgba(0,0,0,0.3) !important;
  }

  .connect-btn:hover::before { left: 100%; }
  .connect-btn:hover::after { opacity: 0.5; }
  .connect-btn:active { transform: translateY(-2px) scale(0.98) !important; }

  .gradient-text {
    background: linear-gradient(135deg, #f1f0ff 0%, #c4b5fd 40%, #a78bfa 70%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(124,58,237,0.3));
  }

  .stat-value-text {
    background: linear-gradient(135deg, #ffffff 0%, #e0d9ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 4px rgba(255,255,255,0.2));
  }

  .badge-pulse {
    animation: badge-glow 2s ease-in-out infinite;
  }

  @keyframes badge-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
    50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
  }

  .page-enter {
    animation: page-slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes page-slide-in {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .stat-enter {
    animation: stat-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .stat-enter:nth-child(1) { animation-delay: 0.1s; }
  .stat-enter:nth-child(2) { animation-delay: 0.2s; }
  .stat-enter:nth-child(3) { animation-delay: 0.3s; }
  .stat-enter:nth-child(4) { animation-delay: 0.4s; }

  @keyframes stat-pop {
    from { opacity: 0; transform: translateY(40px) scale(0.8) rotateX(-10deg); }
    to { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
  }

  .view-all-link {
    transition: all 0.3s ease;
    position: relative;
  }

  .view-all-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #a78bfa, #06b6d4);
    transition: width 0.3s ease;
  }

  .view-all-link:hover::after {
    width: 100%;
  }

  .floating-particles {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(124,58,237,0.3);
    border-radius: 50%;
    animation: float-up 8s ease-in infinite;
  }

  @keyframes float-up {
    0% { transform: translateY(100vh) scale(0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-10vh) scale(1); opacity: 0; }
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div style={{ minHeight: '100vh', background: '#0a0a0f', position: 'relative' }}>

      {/* Floating particles */}
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: `rgba(${Math.random() > 0.5 ? '124,58,237' : '6,182,212'}, ${0.2 + Math.random() * 0.3})`
            }}
          />
        ))}
      </div>

      {/* Animated background orbs */}
      <div className="meetmind-bg">
        <div className="orb orb-1" style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
        }} />
        <div className="orb orb-2" style={{
          transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`
        }} />
        <div className="orb orb-3" style={{
          transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`
        }} />
        <div className="orb orb-4" style={{
          transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`
        }} />
      </div>

      {/* Grid overlay */}
      <div className="grid-bg" />

      <Navbar />

      <main className="page-enter" style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '2.5rem 2rem 4rem',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Header with 3D perspective */}
        <div style={{
          marginBottom: '3rem',
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
          transition: 'transform 0.3s ease',
          transformStyle: 'preserve-3d'
        }}>
          <h1 className="gradient-text" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: '-0.03em',
            lineHeight: 1.2
          }}>
            {getGreeting()}, {firstName} 👋
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 15,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            letterSpacing: '-0.01em'
          }}>
            Here's what happened in your meetings this week.
          </p>
        </div>

        {/* Stats Grid with 3D hover effects */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: '2.5rem'
        }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="stat-card stat-enter"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Glow effect on hover */}
              <div style={{
                position: 'absolute',
                top: -30, right: -30,
                width: 100, height: 100,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`,
                pointerEvents: 'none',
                transition: 'all 0.4s ease',
                opacity: 0.7
              }} />

              {/* Top gradient bar */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${s.color}80, ${s.color}, transparent)`,
                borderRadius: '20px 20px 0 0',
                opacity: 0.8
              }} />

              <div className="stat-icon-wrapper" style={{
                fontSize: 28,
                marginBottom: 12,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                {s.icon}
              </div>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500
              }}>
                {s.label}
              </div>
              <div className="stat-value-text" style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: 6,
                letterSpacing: '-0.02em'
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.35)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400
              }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Connect Calendar CTA with 3D effect */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.15) 50%, rgba(236,72,153,0.1) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 24,
          padding: '2rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          transformStyle: 'preserve-3d',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 40px rgba(124,58,237,0.15), 0 0 0 1px rgba(124,58,237,0.1) inset'
        }}>
          {/* Shimmer effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            animation: 'shimmer 3s ease-in-out infinite',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 6,
              color: '#f1f0ff',
              letterSpacing: '-0.01em'
            }}>
              📅 Connect your calendar to start recording
            </div>
            <div style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400
            }}>
              MeetMind will automatically join your scheduled video calls.
            </div>
          </div>

          <button
            className="connect-btn"
            onClick={() => navigate('/connect-calendar')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 14,
              padding: '14px 32px',
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              flexShrink: 0,
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(124,58,237,0.4), 0 2px 0 rgba(255,255,255,0.1) inset',
              position: 'relative',
              zIndex: 1,
              letterSpacing: '-0.01em',
              transformStyle: 'preserve-3d'
            }}
          >
            Connect Google Calendar →
          </button>
        </div>

        {/* Meetings Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: '#f1f0ff',
              letterSpacing: '-0.02em',
              marginBottom: 4
            }}>
              Recent meetings
            </h2>
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400
            }}>
              Your latest recorded and upcoming meetings
            </p>
          </div>
          <span className="view-all-link" style={{
            fontSize: 14,
            color: '#a78bfa',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            textDecoration: 'none',
            padding: '4px 8px'
          }}>
            View all →
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            padding: '4rem',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(124,58,237,0.1)',
            backdropFilter: 'blur(10px)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div style={{
              fontSize: 15,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500
            }}>
              Loading your meetings...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            textAlign: 'center',
            color: '#f87171',
            padding: '3rem',
            background: 'linear-gradient(145deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.02) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(239,68,68,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{
              fontWeight: 600,
              marginBottom: 8,
              fontFamily: "'Inter', sans-serif",
              fontSize: 15
            }}>
              Failed to load meetings
            </div>
            <div style={{
              fontSize: 13,
              color: 'rgba(248,113,113,0.7)',
              fontFamily: "'Inter', sans-serif"
            }}>
              {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && meetings.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            padding: '4rem',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(124,58,237,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎙️</div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              marginBottom: 8,
              fontSize: 16,
              color: '#f1f0ff'
            }}>
              No meetings yet
            </div>
            <div style={{
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.5
            }}>
              Connect your calendar to start recording meetings automatically.
            </div>
          </div>
        )}

        {/* Meetings List with enhanced 3D effects */}
        {!loading && !error && meetings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {meetings.map((m, i) => (
              <div
                key={m.id}
                className="meeting-row"
                onClick={() => navigate(`/meeting/${m.id}`)}
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  backdropFilter: 'blur(10px)',
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Hover glow effect */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 30% 50%, rgba(124,58,237,0.1) 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  borderRadius: 16
                }}
                className="meeting-row-glow"
                />

                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.2) 100%)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.2)'
                }}>
                  🎙️
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#f1f0ff',
                    marginBottom: 4,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-0.01em'
                  }}>
                    {m.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {m.attendees?.join(', ') || '·· attendees'}
                  </div>
                </div>
                <span className={m.status === 'done' ? 'badge-pulse' : ''} style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  background: m.status === 'done'
                    ? 'rgba(16,185,129,0.2)'
                    : m.status === 'processing'
                    ? 'rgba(245,158,11,0.2)'
                    : 'rgba(124,58,237,0.2)',
                  color: m.status === 'done'
                    ? '#10b981'
                    : m.status === 'processing'
                    ? '#f59e0b'
                    : '#a78bfa',
                  border: `1px solid ${m.status === 'done'
                    ? 'rgba(16,185,129,0.4)'
                    : m.status === 'processing'
                    ? 'rgba(245,158,11,0.4)'
                    : 'rgba(124,58,237,0.4)'}`,
                  textTransform: 'capitalize',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.3s ease'
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