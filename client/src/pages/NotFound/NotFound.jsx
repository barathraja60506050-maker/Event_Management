import React from 'react';
import { Link } from 'react-router-dom';
import { HiTicket } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <span className="h-16 w-16 rounded-full bg-aurora-gradient-soft flex items-center justify-center mb-6">
        <HiTicket className="text-3xl text-aurora-violet dark:text-aurora-cyan" />
      </span>
      <h1 className="font-display font-bold text-3xl mb-2">This ticket doesn't exist</h1>
      <p className="text-ink-muted max-w-sm mb-6">
        The page you're looking for was never booked. Let's get you back to something real.
      </p>
      <Link to="/" className="px-6 py-3 rounded-full font-semibold gradient-btn">
        Back to home
      </Link>
    </div>
  );
}
