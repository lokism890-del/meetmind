import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Meeting from './pages/Meeting';
import Onboarding from './pages/Onboarding';
import Upload from './pages/Upload';
import ConnectCalendar from './pages/ConnectCalendar';
import './App.css';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      appearance={{
        variables: {
          colorPrimary: '#6C5CE7',
          colorBackground: '#18152a',
          colorInputBackground: '#211d35',
          colorInputText: '#f0eeff',
          colorText: '#f0eeff',
          colorTextSecondary: '#8b85a8',
          borderRadius: '12px',
        },
        elements: {
          card: {
            background: '#18152a',
            border: '1px solid rgba(108, 92, 231, 0.18)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            borderRadius: '16px',
          },
          headerTitle: {
            color: '#f0eeff',
            fontFamily: 'Syne, sans-serif',
          },
          headerSubtitle: {
            color: '#8b85a8',
          },
          socialButtonsBlockButton: {
            background: '#211d35',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#f0eeff',
            borderRadius: '10px',
          },
          dividerLine: {
            background: 'rgba(255,255,255,0.06)',
          },
          dividerText: {
            color: '#5a5475',
          },
          formFieldLabel: {
            color: '#8b85a8',
          },
          formFieldInput: {
            background: '#211d35',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#f0eeff',
            borderRadius: '10px',
          },
          formButtonPrimary: {
            background: '#6C5CE7',
            borderRadius: '10px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: '600',
          },
          footerActionLink: {
            color: '#a29bfe',
          },
          userButtonPopoverCard: {
            background: '#18152a',
            border: '1px solid rgba(108, 92, 231, 0.18)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            borderRadius: '16px',
          },
          userButtonPopoverActionButton: {
            color: '#8b85a8',
            borderRadius: '8px',
          },
          userButtonPopoverActionButtonText: {
            color: '#8b85a8',
          },
          userButtonPopoverFooter: {
            display: 'none',
          },
          avatarBox: {
            border: '2px solid #6C5CE7',
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/connect-calendar" element={<ProtectedRoute><ConnectCalendar /></ProtectedRoute>} />
          <Route path="/meeting/:id" element={<ProtectedRoute><Meeting /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/live/:id" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}
