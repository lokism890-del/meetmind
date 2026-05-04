import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';

const SPEAKER_COLORS = {
  A: { bg: 'rgba(108,92,231,0.15)', text: '#a29bfe', border: 'rgba(108,92,231,0.3)' },
  B: { bg: 'rgba(0,206,201,0.15)', text: '#00cec9', border: 'rgba(0,206,201,0.3)' },
  C: { bg: 'rgba(253,203,110,0.15)', text: '#fdcb6e', border: 'rgba(253,203,110,0.3)' },
  D: { bg: 'rgba(253,121,168,0.15)', text: '#fd79a8', border: 'rgba(253,121,168,0.3)' },
  E: { bg: 'rgba(85,239,196,0.15)', text: '#55efc4', border: 'rgba(85,239,196,0.3)' },
};

// Simulated live transcript lines for demo
const DEMO_LINES = [
  { speaker: 'A', text: 'Alright everyone, let\'s get started with today\'s sprint review.' },
  { speaker: 'B', text: 'Sure, I\'ll kick off with the backend updates. We finished the auth module.' },
  { speaker: 'C', text: 'Great. And the frontend team completed the dashboard redesign.' },
  { speaker: 'A', text: 'Perfect. What about the API integration? Is that unblocked now?' },
  { speaker: 'B', text: 'Yes, the blocker was resolved yesterday. We can ship by Friday.' },
  { speaker: 'D', text: 'I can handle QA testing on Thursday if that works.' },
  { speaker: 'A', text: 'That works. So the action item is — Bilal owns QA by Thursday EOD.' },
  { speaker: 'C', text: 'Should we also push the release notes to the docs site?' },
  { speaker: 'B', text: 'Good point. I\'ll take that. Release notes by Friday morning.' },
  { speaker: 'A', text: 'Excellent. Let\'s make sure we document the API changes too.' },
  { speaker: 'D', text: 'I\'ll add that to the wiki after QA is done.' },
  { speaker: 'A', text: 'Perfect. Any blockers anyone wants to flag before we close?' },
  { speaker: 'C', text: 'No blockers from design. We\'re ahead of schedule actually.' },
  { speaker: 'B', text: 'Same here. Backend is green.' },
  { speaker: 'A', text: 'Fantastic sprint everyone. Let\'s keep this momentum going.' },
];

const DEMO_ACTION_ITEMS = [
  { owner: 'Bilal', task: 'QA testing', due: 'Thursday EOD', detected: 6 },
  { owner: 'Ahmed', task: 'Release notes', due: 'Friday morning', detected: 8 },
  { owner: 'Bilal', task: 'Update API docs in wiki', due: 'After QA', detected: 10 },
];

export default function LiveMeeting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [duration, setDuration] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const transcriptRef = useRef(null);
  const timerRef = useRef(null);
  const lineTimerRef = useRef(null);

  useEffect(() => {
    // Start duration timer
    timerRef.current = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);

    // Simulate live transcript
    let idx = 0;
    function addNextLine() {
      if (idx >= DEMO_LINES.length) {
        setIsLive(false);
        clearInterval(timerRef.current);
        return;
      }
      const line = DEMO_LINES[idx];
      setTranscript(prev => [...prev, { ...line, id: idx, timestamp: new Date() }]);
      setWordCount(prev => prev + line.text.split(' ').length);

      // Detect action items
      const actionItem = DEMO_ACTION_ITEMS.find(a => a.detected === idx);
      if (actionItem) {
        setActionItems(prev => [...prev, actionItem]);
      }

      idx++;
      const delay = 1500 + Math.random() * 2000;
      lineTimerRef.current = setTimeout(addNextLine, delay);
    }

    setTimeout(addNextLine, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(lineTimerRef.current);
    };
  }, []);

  // Auto scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const speakerNames = { A: 'Ahmed', B: 'Sara', C: 'James', D: 'Bilal', E: 'Priya' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/dashboard')} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: 13, cursor: 'pointer', padding: 0
            }}>← Back</button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                  Sprint Review Meeting
                </h1>
                {isLive && (
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,80,80,0.12)',
                    border: '1px solid rgba(255,80,80,0.25)',
                    color: '#ff6b6b', fontSize: 11, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 99,
                    letterSpacing: '0.05em'
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#ff6b6b',
                      animation: 'pulse 1.5s infinite'
                    }} />
                    LIVE
                  </span>
                )}
                {!isLive && (
                  <span style={{
                    background: 'rgba(0,206,201,0.12)',
                    border: '1px solid rgba(0,206,201,0.25)',
                    color: 'var(--teal)', fontSize: 11, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 99,
                  }}>
                    ENDED
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {formatDuration(duration)} · {wordCount} words · {transcript.length} lines
              </div>
            </div>
          </div>

          {!isLive && (
            <button
              onClick={() => navigate(`/meeting/${id || 'demo'}`)}
              style={{
                background: 'var(--purple)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px 18px', fontSize: 13,
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              ⚡ Generate Summary
            </button>
          )}
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>

          {/* Left — Live transcript */}
          <div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Live Transcript
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Object.entries(speakerNames).slice(0, 4).map(([key, name]) => {
                    const color = SPEAKER_COLORS[key];
                    const spoke = transcript.some(t => t.speaker === key);
                    return (
                      <span key={key} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 99,
                        background: spoke ? color.bg : 'var(--bg3)',
                        color: spoke ? color.text : 'var(--text-dim)',
                        border: `1px solid ${spoke ? color.border : 'transparent'}`,
                        transition: 'all 0.3s'
                      }}>
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div
                ref={transcriptRef}
                style={{
                  height: 420, overflowY: 'auto', padding: '12px 16px',
                  display: 'flex', flexDirection: 'column', gap: 10
                }}
              >
                {transcript.length === 0 && (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: '100%', gap: 12
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'rgba(108,92,231,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20
                    }}>🎙️</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>
                      Waiting for speakers...
                    </div>
                  </div>
                )}

                {transcript.map((line, i) => {
                  const color = SPEAKER_COLORS[line.speaker] || SPEAKER_COLORS.A;
                  const name = speakerNames[line.speaker] || `Speaker ${line.speaker}`;
                  const isLatest = i === transcript.length - 1 && isLive;

                  return (
                    <div
                      key={line.id}
                      style={{
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        animation: 'fadeIn 0.3s ease',
                        opacity: isLatest ? 1 : 0.85
                      }}
                    >
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 8px',
                        borderRadius: 99, flexShrink: 0, marginTop: 1,
                        background: color.bg, color: color.text,
                        border: `1px solid ${color.border}`
                      }}>
                        {name}
                      </span>
                      <span style={{
                        fontSize: 13, color: isLatest ? 'var(--text)' : 'var(--text-muted)',
                        lineHeight: 1.6, flex: 1
                      }}>
                        {line.text}
                        {isLatest && isLive && (
                          <span style={{
                            display: 'inline-block', width: 2, height: 14,
                            background: 'var(--purple)', marginLeft: 3,
                            verticalAlign: 'middle',
                            animation: 'blink 1s infinite'
                          }} />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Duration', value: formatDuration(duration) },
                { label: 'Speakers', value: [...new Set(transcript.map(t => t.speaker))].length || 0 },
                { label: 'Words', value: wordCount },
                { label: 'Action items', value: actionItems.length },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'var(--bg2)', borderRadius: 10,
                  padding: '10px 12px',
                  border: '1px solid var(--border-soft)'
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 3 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne' }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Action items detected */}
            <div className="card">
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12
              }}>
                Action Items Detected
              </div>
              {actionItems.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  Listening for action items...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {actionItems.map((item, i) => (
                    <div key={i} style={{
                      background: 'rgba(0,206,201,0.06)',
                      border: '1px solid rgba(0,206,201,0.15)',
                      borderRadius: 8, padding: '8px 10px',
                      animation: 'fadeIn 0.4s ease'
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', marginBottom: 2 }}>
                        {item.owner}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {item.task}
                      </div>
                      {item.due && (
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3 }}>
                          Due: {item.due}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Speaker breakdown */}
            <div className="card">
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12
              }}>
                Speaker Breakdown
              </div>
              {Object.entries(speakerNames).map(([key, name]) => {
                const lines = transcript.filter(t => t.speaker === key).length;
                const total = transcript.length || 1;
                const pct = Math.round((lines / total) * 100);
                const color = SPEAKER_COLORS[key];
                if (lines === 0) return null;
                return (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 12, marginBottom: 4
                    }}>
                      <span style={{ color: color.text, fontWeight: 500 }}>{name}</span>
                      <span style={{ color: 'var(--text-dim)' }}>{pct}%</span>
                    </div>
                    <div style={{
                      height: 4, borderRadius: 99,
                      background: 'var(--bg3)', overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        background: color.text,
                        width: `${pct}%`,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
              {transcript.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  No speakers yet...
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
