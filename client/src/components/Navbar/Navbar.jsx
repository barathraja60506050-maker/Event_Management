import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSun, HiMoon, HiMenu, HiX, HiTicket, HiUserCircle } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const brandTarget = isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/';
  const dashboardLink = isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : null;
  const navLinks = [];

  if (!isAuthenticated || user?.role === 'user') {
    navLinks.push({ to: '/events', label: 'Browse Events' });
  }

  if (isAuthenticated) {
    navLinks.push({ to: dashboardLink, label: user?.role === 'admin' ? 'Admin dashboard' : 'Dashboard', authOnly: true });
  }

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to={brandTarget} className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="h-8 w-8 rounded-lg bg-aurora-gradient flex items-center justify-center text-white">
            <HiTicket />
          </span>
          Eventra
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.authOnly && !isAuthenticated) return null;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-aurora-violet dark:text-aurora-cyan' : 'text-ink-muted hover:text-current'
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 relative">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="h-9 w-9 rounded-full flex items-center justify-center border border-white/10 hover:border-aurora-violet/50 transition-colors"
          >
            {theme === 'dark' ? <HiSun /> : <HiMoon />}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/90 px-3 py-2 text-sm font-medium text-white hover:border-aurora-violet/50 transition-colors"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-aurora-gradient text-xs font-semibold text-slate-950">
                  {user.name?.[0] ?? 'U'}
                </span>
                {user.name.split(' ')[0]}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/30">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                  >
                    View profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                  >
                    Switch to {theme === 'dark' ? 'light' : 'dark'} mode
                  </button>
                  {user?.role === 'user' && (
                    <Link
                      to="/profile#organizer"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                    >
                      Become organizer
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-ink-muted hover:text-current">
                Log in
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-full text-sm font-semibold gradient-btn">
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden h-9 w-9 flex items-center justify-center text-xl"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.authOnly && !isAuthenticated) return null;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="text-sm font-medium">
                    {link.label}
                  </Link>
                );
              })}
              <button onClick={toggleTheme} className="text-sm font-medium text-left">
                Switch to {theme === 'dark' ? 'light' : 'dark'} mode
              </button>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-full text-sm font-semibold gradient-btn w-fit">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium">
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-full text-sm font-semibold gradient-btn w-fit"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
