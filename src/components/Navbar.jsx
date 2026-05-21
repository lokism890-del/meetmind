import { NavLink, useNavigate } from 'react-router-dom';
import { UserButton, useUser, SignOutButton } from '@clerk/clerk-react';
import { useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const existing = document.getElementById('mm-nav-v3');
    if (existing) existing.remove();
    const style = document.createElement('style');
    style.id = 'mm-nav-v3';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

      body { background: #07050f !important; }

      .mm-nav {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 0 2rem !important;
        height: 62px !important;
        border-bottom: 1px solid rgba(124,58,237,0.25) !important;
        background: rgba(7,5,15,0.92) !important;
        backdrop-filter: blur(24px) !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 100 !important;
        animation: nav-in 0.4s ease !important;
      }

      @keyframes nav-in {
        from { opacity:0; transform:translateY(-8px); }
        to { opacity:1; transform:translateY(0); }
      }

      .mm-nav::after {
        content: '' !important;
        position: absolute !important;
        bottom: 0; left: 0; right: 0 !important;
        height: 1px !important;
        background: linear-gradient(90deg,transparent,rgba(124,58,237,0.6),rgba(6,182,212,0.5),rgba(236,72,153,0.3),transparent) !important;
        pointer-events: none !important;
      }

      .mm-logo {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        cursor: pointer !important;
        transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1) !important;
      }

      .mm-logo:hover { transform: scale(1.05) !important; }

      .mm-logo-icon {
        width: 36px !important; height: 36px !important;
        border-radius: 10px !important;
        background: linear-gradient(135deg, #7c3aed, #06b6d4) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 18px !important;
        box-shadow: 0 0 20px rgba(124,58,237,0.7) !important;
        transition: all 0.3s ease !important;
        flex-shrink: 0 !important;
      }

      .mm-logo:hover .mm-logo-icon {
        transform: rotate(-8deg) scale(1.12) !important;
        box-shadow: 0 0 32px rgba(124,58,237,0.9) !important;
      }

      .mm-logo-text {
        font-family: 'Syne', sans-serif !important;
        font-weight: 800 !important;
        font-size: 18px !important;
        color: #ffffff !important;
        letter-spacing: -0.01em !important;
        background: linear-gradient(135deg, #ffffff, #c4b5fd) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
      }

      .mm-links {
        display: flex !important;
        gap: 2px !important;
        background: rgba(255,255,255,0.04) !important;
        border: 1px solid rgba(124,58,237,0.18) !important;
        border-radius: 14px !important;
        padding: 4px !important;
      }

      .mm-link {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        color: rgba(210,205,240,0.75) !important;
        padding: 7px 18px !important;
        border-radius: 10px !important;
        text-decoration: none !important;
        transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important;
        white-space: nowrap !important;
      }

      .mm-link:hover {
        color: #ffffff !important;
        background: rgba(124,58,237,0.18) !important;
        transform: translateY(-1px) !important;
      }

      .mm-link.active {
        color: #ffffff !important;
        background: linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.2)) !important;
        border: 1px solid rgba(124,58,237,0.4) !important;
        font-weight: 600 !important;
        box-shadow: 0 2px 16px rgba(124,58,237,0.3) !important;
      }

      .mm-user {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }

      .mm-username {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 13px !important;
        color: rgba(210,205,240,0.7) !important;
      }

      .mm-signout {
        font-family: 'DM Sans', sans-serif !important;
        background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15)) !important;
        color: #d4b8ff !important;
        border: 1px solid rgba(124,58,237,0.4) !important;
        border-radius: 10px !important;
        padding: 7px 18px !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .mm-signout:hover {
        transform: translateY(-3px) scale(1.05) !important;
        border-color: rgba(124,58,237,0.7) !important;
        color: #ffffff !important;
        box-shadow: 0 6px 24px rgba(124,58,237,0.5), 0 0 0 1px rgba(124,58,237,0.3) !important;
        background: linear-gradient(135deg, rgba(124,58,237,0.45), rgba(6,182,212,0.3)) !important;
      }

      .mm-signout:active { transform: translateY(0) scale(0.97) !important; }

      .mm-signout::after {
        content: '' !important;
        position: absolute !important;
        top: -50%; left: -60% !important;
        width: 40%; height: 200% !important;
        background: linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent) !important;
        transform: skewX(-20deg) !important;
        transition: left 0.5s ease !important;
      }

      .mm-signout:hover::after { left: 130% !important; }

      /* Clerk UserButton popup overrides */
      .cl-userButtonPopoverCard {
        background: rgba(12,9,24,0.98) !important;
        border: 1px solid rgba(124,58,237,0.3) !important;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,58,237,0.15) !important;
        border-radius: 16px !important;
      }

      .cl-userButtonPopoverActionButton {
        color: #c4b5fd !important;
        border-radius: 10px !important;
        transition: all 0.2s ease !important;
        font-family: 'DM Sans', sans-serif !important;
      }

      .cl-userButtonPopoverActionButton:hover {
        background: rgba(124,58,237,0.15) !important;
        color: #ffffff !important;
      }

      .cl-userButtonPopoverActionButtonText {
        color: #c4b5fd !important;
        font-size: 14px !important;
        font-weight: 500 !important;
      }

      .cl-userButtonPopoverActionButton:hover .cl-userButtonPopoverActionButtonText {
        color: #ffffff !important;
      }

      .cl-userButtonPopoverActionButtonIcon {
        color: #a78bfa !important;
      }

      .cl-userPreviewMainIdentifier {
        color: #f1f0ff !important;
        font-weight: 600 !important;
        font-family: 'Syne', sans-serif !important;
      }

      .cl-userPreviewSecondaryIdentifier {
        color: rgba(167,139,250,0.8) !important;
        font-size: 12px !important;
      }

      .cl-avatarBox {
        border: 2px solid rgba(124,58,237,0.6) !important;
        box-shadow: 0 0 16px rgba(124,58,237,0.4) !important;
        transition: all 0.3s ease !important;
      }

      .cl-userButtonTrigger:hover .cl-avatarBox {
        border-color: #7c3aed !important;
        box-shadow: 0 0 28px rgba(124,58,237,0.7) !important;
        transform: scale(1.08) !important;
      }

      .cl-userButtonPopoverFooter { display: none !important; }

      .cl-internal-b3fm6y {
        background: rgba(12,9,24,0.98) !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <nav className="mm-nav">
      <div className="mm-logo" onClick={() => navigate('/dashboard')}>
        <div className="mm-logo-icon">⚡</div>
        <span className="mm-logo-text">MeetMind</span>
      </div>

      <div className="mm-links">
        <NavLink to="/dashboard" className={({ isActive }) => `mm-link${isActive ? ' active' : ''}`}>
          Meetings
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => `mm-link${isActive ? ' active' : ''}`}>
          Upload
        </NavLink>
        <NavLink to="/connect-calendar" className={({ isActive }) => `mm-link${isActive ? ' active' : ''}`}>
          Connect Calendar
        </NavLink>
      </div>

      <div className="mm-user">
        <span className="mm-username">{user?.firstName} {user?.lastName}</span>
        <SignOutButton signOutCallback={() => navigate('/')}>
          <button className="mm-signout">Sign out</button>
        </SignOutButton>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                border: '2px solid rgba(124,58,237,0.6)',
                boxShadow: '0 0 16px rgba(124,58,237,0.4)'
              },
              userButtonPopoverCard: {
                background: 'rgba(12,9,24,0.98)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '16px'
              },
              userButtonPopoverActionButtonText: { color: '#c4b5fd' },
              userButtonPopoverActionButton: { borderRadius: '10px' },
              userPreviewMainIdentifier: { color: '#f1f0ff' },
              userPreviewSecondaryIdentifier: { color: '#a78bfa' }
            }
          }}
        />
      </div>
    </nav>
  );
}
