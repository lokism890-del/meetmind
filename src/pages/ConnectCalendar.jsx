import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  body {
    background: #0a0a0f !important;
    font-family: 'Inter', sans-serif !important;
  }

  .calendar-bg {
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
    background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
    bottom: -150px; left: 40%;
    animation-delay: -8s;
  }

  @keyframes orb-float {
    0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.5; }
    25% { transform: translateY(-40px) scale(1.08) rotate(5deg); opacity: 0.9; }
    50% { transform: translateY(-20px) scale(0.95) rotate(-3deg); opacity: 0.6; }
    75% { transform: translateY(20px) scale(1.02) rotate(2deg); opacity: 0.7; }
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

  .page-enter {
    animation: page-slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes page-slide-in {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .feature-card {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    cursor: pointer;
    transform-style: preserve-3d;
    perspective: 1000px;
    position: relative;
  }

  .feature-card::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 18px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(6,182,212,0.3), rgba(16,185,129,0.3));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .feature-card:hover {
    transform: translateY(-12px) scale(1.05) rotateX(5deg) !important;
    box-shadow: 0 20px 60px rgba(124,58,237,0.3), 0 10px 20px rgba(0,0,0,0.4) !important;
  }

  .feature-card:hover::before {
    opacity: 1;
  }

  .feature-icon {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }

  .feature-card:hover .feature-icon {
    transform: scale(1.15) rotate(-5deg);
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
    background: linear-gradient(135deg, #7c3aed, #06b6d4, #10b981);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    filter: blur(15px);
  }

  .connect-btn:hover:not(:disabled) {
    transform: translateY(-4px) scale(1.05) rotateX(3deg) !important;
    box-shadow: 0 20px 40px rgba(124,58,237,0.5), 0 10px 20px rgba(0,0,0,0.3) !important;
  }

  .connect-btn:hover:not(:disabled)::before { left: 100%; }
  .connect-btn:hover:not(:disabled)::after { opacity: 0.5; }
  .connect-btn:active:not(:disabled) { transform: translateY(-2px) scale(0.98) !important; }

  .gradient-text {
    background: linear-gradient(135deg, #f1f0ff 0%, #c4b5fd 40%, #a78bfa 70%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(124,58,237,0.3));
  }

  .success-card {
    animation: success-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes success-pop {
    from { opacity: 0; transform: scale(0.8) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .error-shake {
    animation: shake 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
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

  .step-item {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }

  .step-item:hover {
    transform: translateX(8px);
    color: #f1f0ff !important;
  }

  .step-item::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: #7c3aed;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .step-item:hover::before {
    box-shadow: 0 0 15px rgba(124,58,237,0.6);
    transform: translateY(-50%) scale(1.5);
  }

  .feature-enter {
    animation: stat-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .feature-enter:nth-child(1) { animation-delay: 0.1s; }
  .feature-enter:nth-child(2) { animation-delay: 0.2s; }
  .feature-enter:nth-child(3) { animation-delay: 0.3s; }
  .feature-enter:nth-child(4) { animation-delay: 0.4s; }

  @keyframes stat-pop {
    from { opacity: 0; transform: translateY(40px) scale(0.8) rotateX(-10deg); }
    to { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
  }

  .back-link {
    transition: all 0.3s ease;
    position: relative;
  }

  .back-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #a78bfa, #06b6d4);
    transition: width 0.3s ease;
  }

  .back-link:hover::after {
    width: 100%;
  }
`;

if (!document.querySelector('#calendar-styles')) {
  style.id = 'calendar-styles';
  document.head.appendChild(style);
}

export default function ConnectCalendar() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shakeError, setShakeError] = useState(false);

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
    if (error) {
      setShakeError(true);
      const timer = setTimeout(() => setShakeError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleConnectGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar/auth-url`
      );

      if (!response.ok) throw new Error('Failed to get Google auth URL');

      const { url } = await response.json();

      const popup = window.open(url, 'GoogleCalendar', 'width=500,height=600');

      const pollTimer = setInterval(async () => {
        try {
          if (popup && popup.closed) {
            clearInterval(pollTimer);
            setLoading(true);

            const token = await getToken();
            const checkResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/calendar/check-connection`,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (checkResponse.ok) {
              const data = await checkResponse.json();
              if (data.connected) {
                setConnected(true);
                setTimeout(() => navigate('/dashboard'), 2000);
              } else {
                setError('Calendar not connected. Please try again.');
              }
            }
            setLoading(false);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
          setLoading(false);
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(pollTimer);
        if (popup && !popup.closed) popup.close();
        setLoading(false);
      }, 5 * 60 * 1000);

    } catch (err) {
      console.error('Calendar connection error:', err);
      setError(err.message || 'Failed to connect. Please try again.');
      setLoading(false);
    }
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
              background: `rgba(${Math.random() > 0.5 ? '124,58,237' : '16,185,129'}, ${0.2 + Math.random() * 0.3})`
            }}
          />
        ))}
      </div>

      {/* Animated background orbs */}
      <div className="calendar-bg">
        <div className="orb orb-1" style={{
          transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`
        }} />
        <div className="orb orb-2" style={{
          transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`
        }} />
        <div className="orb orb-3" style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
        }} />
      </div>

      {/* Grid overlay */}
      <div className="grid-bg" />

      <Navbar />

      <main className="page-enter" style={{ 
        maxWidth: 900, 
        margin: '0 auto', 
        padding: '2.5rem 2rem 4rem',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Header with 3D perspective */}
        <div style={{ 
          marginBottom: '3.5rem', 
          textAlign: 'center',
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
          transition: 'transform 0.3s ease',
          transformStyle: 'preserve-3d'
        }}>
          <h1 className="gradient-text" style={{ 
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 36, 
            fontWeight: 700, 
            marginBottom: 14,
            letterSpacing: '-0.03em',
            lineHeight: 1.2
          }}>
            Connect Your Google Calendar
          </h1>
          <p style={{ 
            fontSize: 16, 
            color: 'rgba(255,255,255,0.5)', 
            maxWidth: 550, 
            margin: '0 auto',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            MeetMind will automatically join your scheduled video calls and send reminders 10 minutes before each meeting.
          </p>
        </div>

        {/* Features Grid with 3D hover effects */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 18,
          marginBottom: '3rem'
        }}>
          {[
            { icon: '🤖', title: 'Auto Join', desc: 'Automatically join your scheduled video calls' },
            { icon: '⏱️', title: '10-Min Reminder', desc: 'Get notified 10 minutes before your meeting starts' },
            { icon: '🎙️', title: 'Auto Record', desc: 'Start recording automatically when you join' },
            { icon: '✍️', title: 'Smart Summary', desc: 'Get transcripts and summaries of your meetings' }
          ].map((feature, i) => (
            <div key={i} className="feature-card feature-enter" style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: '1.75rem 1.5rem',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Glow effect */}
              <div style={{
                position: 'absolute',
                top: -30, right: -30,
                width: 100, height: 100,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)`,
                pointerEvents: 'none',
                transition: 'all 0.4s ease',
                opacity: 0.7
              }} />
              
              {/* Top gradient bar */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.8), rgba(6,182,212,0.8), transparent)',
                borderRadius: '18px 18px 0 0'
              }} />

              <div className="feature-icon" style={{ 
                fontSize: 36, 
                marginBottom: 16,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                zIndex: 1
              }}>
                {feature.icon}
              </div>
              <h3 style={{ 
                fontWeight: 600, 
                marginBottom: 8, 
                fontSize: 15,
                fontFamily: "'Space Grotesk', sans-serif",
                color: '#f1f0ff',
                letterSpacing: '-0.01em',
                position: 'relative',
                zIndex: 1
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                fontSize: 13, 
                color: 'rgba(255,255,255,0.4)',
                margin: 0,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                lineHeight: 1.5,
                position: 'relative',
                zIndex: 1
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Success Message with animation */}
        {connected && (
          <div className="success-card" style={{
            background: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 16,
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 10px 30px rgba(16,185,129,0.2)'
          }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))',
              border: '1px solid rgba(16,185,129,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}>
              ✅
            </div>
            <div>
              <div style={{
                fontWeight: 600,
                color: '#10b981',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 15,
                marginBottom: 4
              }}>
                Calendar connected successfully!
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'Inter', sans-serif"
              }}>
                Redirecting to dashboard...
              </div>
            </div>
          </div>
        )}

        {/* Error Message with shake animation */}
        {error && (
          <div className={shakeError ? 'error-shake' : ''} style={{
            background: 'linear-gradient(145deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 14,
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{
              color: '#f87171',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 14
            }}>
              {error}
            </span>
          </div>
        )}

        {/* Connect Button with 3D effects */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <button
            onClick={handleConnectGoogle}
            disabled={loading || connected}
            className="connect-btn"
            style={{
              background: connected 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
              color: '#fff',
              border: connected 
                ? '1px solid rgba(16,185,129,0.3)'
                : '1px solid rgba(255,255,255,0.2)',
              borderRadius: 16,
              padding: '18px 48px',
              fontSize: 17,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.01em',
              cursor: (loading || connected) ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              boxShadow: connected 
                ? '0 10px 30px rgba(16,185,129,0.4)'
                : '0 10px 30px rgba(124,58,237,0.4), 0 2px 0 rgba(255,255,255,0.1) inset',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            {connected ? (
              <>
                <span>✅</span>
                Connected!
              </>
            ) : loading ? (
              <>
                <span style={{ 
                  display: 'inline-block',
                  animation: 'spin 1s linear infinite'
                }}>
                  ⚡
                </span>
                Connecting...
              </>
            ) : (
              <>
                <span>📅</span>
                Connect Google Calendar
              </>
            )}
          </button>
        </div>

        {/* How It Works Section */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.06) 100%)',
          border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 20,
          padding: '2.5rem',
          marginBottom: '2.5rem',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glow */}
          <div style={{
            position: 'absolute',
            top: -50, right: -50,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <h2 style={{ 
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, 
            marginBottom: '1.5rem', 
            fontSize: 18,
            color: '#f1f0ff',
            letterSpacing: '-0.02em',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>🔧</span>
            How It Works
          </h2>
          <ol style={{ 
            paddingLeft: 20, 
            color: 'rgba(255,255,255,0.5)', 
            lineHeight: 2.5, 
            fontSize: 14, 
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            position: 'relative',
            zIndex: 1
          }}>
            {[
              'Click the button above to connect your Google Calendar',
              'Grant MeetMind permission to access your calendar',
              'MeetMind scans for upcoming meetings every 30 seconds',
              '10 minutes before each meeting, you get a reminder email',
              'At the exact meeting time, MeetMind automatically joins',
              'Recording and transcription start automatically'
            ].map((step, i) => (
              <li key={i} className="step-item" style={{
                paddingLeft: 8,
                marginBottom: 4
              }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Back to Dashboard Link */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="back-link"
            style={{
              background: 'transparent',
              color: '#a78bfa',
              border: 'none',
              fontSize: 15,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'none',
              padding: '8px 16px',
              letterSpacing: '-0.01em'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

      </main>

      {/* Additional animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}