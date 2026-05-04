import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Upload() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [audioUrl, setAudioUrl] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 580, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Process a meeting recording
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: '2rem' }}>
          Paste a link to your audio/video recording and we'll transcribe and summarize it.
        </p>

        {done ? (
          <div style={{
            background: 'rgba(0,206,201,0.08)',
            border: '1px solid rgba(0,206,201,0.2)',
            borderRadius: 14, padding: '2rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              Processing started!
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Your meeting is being transcribed and summarized. Redirecting to dashboard...
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Meeting title *
              </label>
              <input
                value={meetingTitle}
                onChange={e => setMeetingTitle(e.target.value)}
                placeholder="Q3 sales review, Team standup..."
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border-soft)', borderRadius: 10, color: 'var(--text)', fontSize: 14 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Audio/Video URL *
              </label>
              <input
                value={audioUrl}
                onChange={e => setAudioUrl(e.target.value)}
                placeholder="https://... (direct audio/video file link)"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border-soft)', borderRadius: 10, color: 'var(--text)', fontSize: 14 }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                Supports mp3, mp4, wav, m4a and more. Must be a direct file URL.
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Send summary to (emails, comma separated)
              </label>
              <input
                value={emails}
                onChange={e => setEmails(e.target.value)}
                placeholder="john@company.com, sarah@company.com"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border-soft)', borderRadius: 10, color: 'var(--text)', fontSize: 14 }}
              />
            </div>

            {error && (
              <div style={{ color: '#ff6b6b', fontSize: 13, padding: '10px 14px', background: 'rgba(255,80,80,0.08)', borderRadius: 8 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? 'var(--bg3)' : 'var(--purple)',
                color: loading ? 'var(--text-muted)' : '#fff',
                border: 'none', borderRadius: 10, padding: '14px',
                fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8
              }}
            >
              {loading ? '⏳ Processing...' : '⚡ Transcribe & Summarize'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}