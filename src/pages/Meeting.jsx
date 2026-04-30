import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';

const MOCK_SUMMARY = {
  title: 'Q3 sales pipeline review',
  date: 'April 30, 2026',
  duration: '48 min',
  platform: 'Zoom',
  attendees: ['Ahmed K.', 'Sara M.', 'James R.', 'Bilal A.', 'Priya S.'],
  decisions: [
    'Push enterprise launch to Q4 pending legal sign-off',
    'Prioritize APAC deals over EU for Q3 target',
    'Discount ceiling raised to 15% for strategic accounts',
  ],
  actionItems: [
    { owner: 'Ahmed', task: 'Send revised proposal to Acme Corp', due: 'Friday May 2' },
    { owner: 'Sara', task: 'Schedule follow-up with TechCorp procurement', due: 'Monday May 5' },
    { owner: 'James', task: 'Prepare Q3 forecast deck for all-hands', due: 'Monday May 5' },
  ],
  summary: 'The team reviewed the current Q3 pipeline and agreed to deprioritize the EU market in favor of faster-moving APAC deals. The enterprise product launch will be delayed to Q4 to allow legal review of the new data processing agreements. Discount authority for strategic accounts has been increased to 15% to close end-of-quarter deals.',
  transcript: [
    { speaker: 'Ahmed', text: "So if we push the enterprise tier to Q4, we avoid the compliance gap entirely..." },
    { speaker: 'Sara', text: "Agreed. That also gives us time to prep the onboarding team properly." },
    { speaker: 'James', text: "I'll have the forecast updated before Monday's all-hands." },
    { speaker: 'Priya', text: "On the APAC side — TechCorp Singapore is ready to sign, just waiting on legal." },
    { speaker: 'Bilal', text: "We should prioritize their procurement contact this week then." },
    { speaker: 'Ahmed', text: "Exactly. Sara can you take that? Also loop in our solutions engineer." },
  ],
};

const SPEAKER_COLORS = {
  Ahmed: '#a29bfe', Sara: '#00cec9', James: '#fdcb6e', Priya: '#fd79a8', Bilal: '#55efc4'
};

export default function Meeting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Ask me anything about this meeting — action items, decisions, or what someone said.' }
  ]);

  const m = MOCK_SUMMARY;

  const handleChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { role: 'user', text: chatInput },
      { role: 'ai', text: `Based on the meeting, here's what I found about "${chatInput}"... (AI response will appear here once you connect your backend.)` }
    ]);
    setChatInput('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, marginBottom: '1.5rem', padding: 0 }}
        >
          ← Back to meetings
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{m.title}</h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {m.date} · {m.duration} · {m.platform} · {m.attendees.join(', ')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'var(--bg3)', color: 'var(--text-muted)', border: '1px solid var(--border-soft)', borderRadius: 8, padding: '8px 16px', fontSize: 13 }}>
              Share
            </button>
            <button style={{ background: 'var(--purple)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500 }}>
              Export to HubSpot
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Decisions */}
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>
              Key decisions
            </div>
            {m.decisions.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-light)', marginTop: 6, flexShrink: 0 }} />
                {d}
              </div>
            ))}
          </div>

          {/* Action items */}
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>
              Action items
            </div>
            {m.actionItems.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 13, lineHeight: 1.5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <span style={{ color: 'var(--text)' }}>{a.owner}</span>
                  <span style={{ color: 'var(--text-muted)' }}> → {a.task}</span>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>Due: {a.due}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 10 }}>
            Summary
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{m.summary}</p>
        </div>

        {/* Transcript */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>
            Transcript
          </div>
          {m.transcript.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, flexShrink: 0,
                background: `${SPEAKER_COLORS[t.speaker]}22`,
                color: SPEAKER_COLORS[t.speaker] || 'var(--purple-light)'
              }}>{t.speaker}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{t.text}</span>
            </div>
          ))}
        </div>

        {/* AI chat */}
        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12 }}>
            Ask this meeting
          </div>
          <div style={{ marginBottom: 12 }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                {msg.role === 'user' ? (
                  <div style={{
                    background: 'rgba(108,92,231,0.15)', color: 'var(--text)',
                    borderRadius: '10px 10px 2px 10px', padding: '8px 12px',
                    fontSize: 13, display: 'inline-block', maxWidth: '80%', float: 'right', clear: 'both'
                  }}>{msg.text}</div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, clear: 'both' }}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            <div style={{ clear: 'both' }} />
          </div>
          <form onSubmit={handleChat} style={{ display: 'flex', gap: 8 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="What did Ahmed commit to?"
              style={{ flex: 1 }}
            />
            <button type="submit" style={{
              background: 'var(--purple)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '0 18px', fontSize: 14, fontWeight: 500
            }}>Ask</button>
          </form>
        </div>
      </main>
    </div>
  );
}
