import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ConnectCalendar() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnectGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get auth URL from backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar/auth-url`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get Google auth URL');
      }

      const { url } = await response.json();

      // Open Google OAuth flow in popup
      const popup = window.open(url, 'GoogleCalendar', 'width=500,height=600');

      // Wait for auth to complete
      const pollTimer = setInterval(async () => {
        try {
          if (popup && popup.closed) {
            clearInterval(pollTimer);
            
            // Check if calendar is connected
            const token = await getToken();
            const checkResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/calendar/check-connection`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );

            if (checkResponse.ok) {
              const { connected } = await checkResponse.json();
              if (connected) {
                alert('✅ Calendar connected successfully!');
                navigate('/dashboard');
              }
            }
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollTimer);
        if (popup && !popup.closed) {
          popup.close();
        }
      }, 5 * 60 * 1000);

    } catch (err) {
      console.error('Calendar connection error:', err);
      setError(err.message || 'Failed to connect calendar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            📅 Connect Your Google Calendar
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
            MeetMind will automatically join your scheduled video calls and start recording them. 
            You'll also get reminders 10 minutes before each meeting.
          </p>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          marginBottom: '3rem'
        }}>
          {[
            {
              icon: '🤖',
              title: 'Auto Join',
              desc: 'Automatically join your scheduled video calls'
            },
            {
              icon: '⏱️',
              title: '10-Min Reminder',
              desc: 'Get notified 10 minutes before your meeting starts'
            },
            {
              icon: '🎙️',
              title: 'Auto Record',
              desc: 'Start recording automatically when you join'
            },
            {
              icon: '✍️',
              title: 'Smart Summary',
              desc: 'Get transcripts and summaries of your meetings'
            }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-soft)',
              borderRadius: 12,
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>
                {feature.icon}
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(255, 80, 80, 0.1)',
            border: '1px solid rgba(255, 80, 80, 0.3)',
            borderRadius: 12,
            padding: '1rem',
            marginBottom: '2rem',
            color: '#ff6b6b'
          }}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* Connect Button */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={handleConnectGoogle}
            disabled={loading}
            style={{
              background: 'var(--purple)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '16px 48px',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#5b4fd0')}
            onMouseLeave={(e) => !loading && (e.target.style.background = 'var(--purple)')}
          >
            {loading ? (
              <>
                <span>⏳ Connecting...</span>
              </>
            ) : (
              <>
                <span>🔗 Connect Google Calendar</span>
              </>
            )}
          </button>
        </div>

        {/* How it works */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,206,201,0.04))',
          border: '1px solid rgba(108,92,231,0.15)',
          borderRadius: 12,
          padding: '2rem'
        }}>
          <h2 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: 16 }}>
            ✨ How It Works
          </h2>
          <ol style={{
            paddingLeft: 20,
            color: 'var(--text-muted)',
            lineHeight: 1.8,
            fontSize: 14
          }}>
            <li style={{ marginBottom: '0.8rem' }}>
              Click the button above to connect your Google Calendar
            </li>
            <li style={{ marginBottom: '0.8rem' }}>
              Grant MeetMind permission to access your calendar
            </li>
            <li style={{ marginBottom: '0.8rem' }}>
              MeetMind will scan for upcoming meetings
            </li>
            <li style={{ marginBottom: '0.8rem' }}>
              10 minutes before each meeting, you'll get a reminder
            </li>
            <li style={{ marginBottom: '0.8rem' }}>
              At the exact meeting time, MeetMind automatically joins
            </li>
            <li>
              Recording and transcription start automatically
            </li>
          </ol>
        </div>

        {/* Back to Dashboard */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              color: 'var(--purple-light)',
              border: 'none',
              fontSize: 14,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

      </main>
    </div>
  );
}
