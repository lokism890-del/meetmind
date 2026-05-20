import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  body {
    background: #0a0a0f !important;
    font-family: 'Inter', sans-serif !important;
  }

  .upload-bg {
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
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
    top: -200px; right: -100px;
    animation-delay: 0s;
  }

  .orb-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%);
    bottom: -150px; left: -100px;
    animation-delay: -4s;
  }

  .orb-3 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
    top: 50%; left: 50%;
    animation-delay: -8s;
  }

  @keyframes orb-float {
    0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.5; }
    25% { transform: translateY(-30px) scale(1.06) rotate(5deg); opacity: 0.8; }
    50% { transform: translateY(-15px) scale(0.94) rotate(-3deg); opacity: 0.6; }
    75% { transform: translateY(25px) scale(1.03) rotate(2deg); opacity: 0.7; }
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px);
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

  /* Fix for autofill background color */
  .input-field:-webkit-autofill,
  .input-field:-webkit-autofill:hover,
  .input-field:-webkit-autofill:focus,
  .input-field:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.06) inset !important;
    -webkit-text-fill-color: #f1f0ff !important;
    transition: background-color 5000s ease-in-out 0s;
    border: 1px solid rgba(124,58,237,0.4) !important;
  }

  .input-field {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-style: preserve-3d;
  }

  .input-field:hover {
    border-color: rgba(124,58,237,0.4) !important;
    box-shadow: 0 0 20px rgba(124,58,237,0.1) !important;
  }

  .input-field:focus {
    border-color: rgba(124,58,237,0.6) !important;
    box-shadow: 0 0 30px rgba(124,58,237,0.15), 0 4px 12px rgba(124,58,237,0.1) !important;
    transform: translateY(-2px) !important;
    outline: none;
  }

  .submit-btn {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    position: relative;
    overflow: hidden;
    transform-style: preserve-3d;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s ease;
  }

  .submit-btn::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 16px;
    background: linear-gradient(135deg, #7c3aed, #06b6d4, #10b981);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    filter: blur(15px);
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-4px) scale(1.03) rotateX(3deg) !important;
    box-shadow: 0 20px 40px rgba(124,58,237,0.4), 0 10px 20px rgba(0,0,0,0.3) !important;
  }

  .submit-btn:hover:not(:disabled)::before { left: 100%; }
  .submit-btn:hover:not(:disabled)::after { opacity: 0.5; }
  .submit-btn:active:not(:disabled) { transform: translateY(-2px) scale(0.98) !important; }

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

  .gradient-text {
    background: linear-gradient(135deg, #f1f0ff 0%, #c4b5fd 40%, #a78bfa 70%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(124,58,237,0.3));
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

  .label-float {
    transition: all 0.3s ease;
  }

  .form-group:hover .label-float {
    color: #a78bfa !important;
    transform: translateY(-2px);
  }
`;

if (!document.querySelector('#upload-styles')) {
  style.id = 'upload-styles';
  document.head.appendChild(style);
}

export default function Upload() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [audioUrl, setAudioUrl] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
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

  const handleSubmit = async () => {
    if (!audioUrl || !meetingTitle) {
      setError('Please fill in the meeting title and audio URL');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const attendeeEmails = emails.split(',').map(e => e.trim()).filter(Boolean);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audioUrl, meetingTitle, attendeeEmails })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', position: 'relative' }}>
      
      {/* Floating particles */}
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
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
      <div className="upload-bg">
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
        maxWidth: 620, 
        margin: '0 auto', 
        padding: '3rem 2rem',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Header with 3D perspective */}
        <div style={{
          marginBottom: '2.5rem',
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
          transition: 'transform 0.3s ease',
          transformStyle: 'preserve-3d'
        }}>
          <h1 className="gradient-text" style={{ 
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 32, 
            fontWeight: 700, 
            marginBottom: 10,
            letterSpacing: '-0.03em',
            lineHeight: 1.2
          }}>
            Process a meeting recording
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: 15,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: 1.5
          }}>
            Paste a link to your audio/video recording and we'll transcribe and summarize it.
          </p>
        </div>

        {done ? (
          <div className="success-card" style={{
            background: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 20,
            padding: '3rem 2rem',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(16,185,129,0.2), 0 10px 20px rgba(0,0,0,0.3)'
          }}>
            {/* Success glow */}
            <div style={{
              position: 'absolute',
              top: -50, left: '50%',
              transform: 'translateX(-50%)',
              width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            
            <div style={{ 
              fontSize: 56, 
              marginBottom: 16,
              animation: 'bounce 0.6s ease infinite',
              position: 'relative',
              zIndex: 1
            }}>
              🎉
            </div>
            <div style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, 
              fontSize: 22, 
              marginBottom: 12,
              color: '#f1f0ff',
              position: 'relative',
              zIndex: 1
            }}>
              Processing started!
            </div>
            <div style={{ 
              color: 'rgba(255,255,255,0.5)',
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              position: 'relative',
              zIndex: 1,
              lineHeight: 1.5
            }}>
              Your meeting is being transcribed and summarized. Redirecting to dashboard...
            </div>
            
            {/* Progress bar */}
            <div style={{
              marginTop: 24,
              height: 4,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                height: '100%',
                width: '60%',
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                borderRadius: 2,
                animation: 'progress 2s ease-in-out infinite'
              }} />
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 20 
          }}>
            
            {/* Meeting Title Input */}
            <div className="form-group">
              <label className="label-float" style={{ 
                fontSize: 13, 
                color: 'rgba(255,255,255,0.5)',
                display: 'block', 
                marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}>
                Meeting title *
              </label>
              <input
                value={meetingTitle}
                onChange={e => setMeetingTitle(e.target.value)}
                placeholder="Q3 sales review, Team standup..."
                className="input-field"
                name="meeting-title"
                autoComplete="off"
                style={{ 
                  width: '100%', 
                  padding: '14px 18px', 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, 
                  color: '#f1f0ff', 
                  fontSize: 15,
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  WebkitBoxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
            </div>

            {/* Audio URL Input */}
            <div className="form-group">
              <label className="label-float" style={{ 
                fontSize: 13, 
                color: 'rgba(255,255,255,0.5)',
                display: 'block', 
                marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}>
                Audio/Video URL *
              </label>
              <input
                value={audioUrl}
                onChange={e => setAudioUrl(e.target.value)}
                placeholder="https://... (direct audio/video file link)"
                className="input-field"
                name="audio-url"
                autoComplete="off"
                style={{ 
                  width: '100%', 
                  padding: '14px 18px', 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, 
                  color: '#f1f0ff', 
                  fontSize: 15,
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  WebkitBoxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
              <div style={{ 
                fontSize: 12, 
                color: 'rgba(255,255,255,0.3)',
                marginTop: 6,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span>💡</span>
                Supports mp3, mp4, wav, m4a and more. Must be a direct file URL.
              </div>
            </div>

            {/* Emails Input */}
            <div className="form-group">
              <label className="label-float" style={{ 
                fontSize: 13, 
                color: 'rgba(255,255,255,0.5)',
                display: 'block', 
                marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}>
                Send summary to (emails, comma separated)
              </label>
              <input
                value={emails}
                onChange={e => setEmails(e.target.value)}
                placeholder="john@company.com, sarah@company.com"
                className="input-field"
                name="emails"
                autoComplete="off"
                style={{ 
                  width: '100%', 
                  padding: '14px 18px', 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, 
                  color: '#f1f0ff', 
                  fontSize: 15,
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  WebkitBoxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
            </div>

            {/* Error Message with shake animation */}
            {error && (
              <div className={shakeError ? 'error-shake' : ''} style={{ 
                color: '#f87171',
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                padding: '14px 18px',
                background: 'linear-gradient(145deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-btn"
              style={{
                background: loading 
                  ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                  : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
                color: loading ? 'rgba(255,255,255,0.4)' : '#fff',
                border: loading 
                  ? '1px solid rgba(255,255,255,0.08)' 
                  : '1px solid rgba(255,255,255,0.2)',
                borderRadius: 16, 
                padding: '16px 24px',
                fontSize: 16, 
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.01em',
                cursor: loading ? 'not-allowed' : 'pointer', 
                marginTop: 12,
                boxShadow: loading 
                  ? 'none'
                  : '0 8px 30px rgba(124,58,237,0.4), 0 2px 0 rgba(255,255,255,0.1) inset',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading ? (
                <>
                  <span style={{ 
                    display: 'inline-block',
                    animation: 'spin 1s linear infinite'
                  }}>
                    ⚡
                  </span>
                  Processing...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Transcribe & Summarize
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Additional animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}