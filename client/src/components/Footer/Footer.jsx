import React from 'react';
import { Link } from 'react-router-dom';
import { HiTicket } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold">
          <span className="h-7 w-7 rounded-lg bg-aurora-gradient flex items-center justify-center text-white text-sm">
            <HiTicket />
          </span>
          Eventra
        </Link>
        <p className="text-sm text-ink-muted">© {new Date().getFullYear()} Eventra. Every ticket tells a story.</p>
      </div>
    </footer>
  );
}
