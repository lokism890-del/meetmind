import { NavLink, useNavigate } from 'react-router-dom';
import { UserButton, useUser, SignOutButton } from '@clerk/clerk-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();

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
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      {/* Logo */}
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
  <NavLink to="/upload" style={linkStyle}>Upload</NavLink>
  <NavLink to="/onboarding" style={linkStyle}>Connect Calendar</NavLink>
</div>

      {/* User menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {user?.firstName} {user?.lastName}
        </span>
        <SignOutButton signOutCallback={() => navigate('/')}>
          <button style={{
            background: 'var(--bg3)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-soft)',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 13,
            cursor: 'pointer'
          }}>
            Sign out
          </button>
        </SignOutButton>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}