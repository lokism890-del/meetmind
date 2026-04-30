import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    fontSize: 14,
    color: isActive ? 'var(--text)' : 'var(--text-muted)',
    padding: '6px 12px',
    borderRadius: 8,
    background: isActive ? 'var(--bg3)' : 'transparent',
    fontWeight: isActive ? 500 : 400,
  });

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.9rem 2rem',
      borderBottom: '1px solid var(--border-soft)',
      background: 'rgba(15,13,26,0.9)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'linear-gradient(135deg, var(--purple), var(--teal))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
        }}>⚡</div>
        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16 }}>MeetMind</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <NavLink to="/dashboard" style={linkStyle}>Meetings</NavLink>
        <NavLink to="/onboarding" style={linkStyle}>Connect Calendar</NavLink>
      </div>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'var(--purple-dim)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--purple-light)'
      }}>A</div>
    </nav>
  );
}