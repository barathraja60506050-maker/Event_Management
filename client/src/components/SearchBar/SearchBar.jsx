import React from 'react';
import { HiSearch } from 'react-icons/hi';

export default function SearchBar({ value, onChange, placeholder = 'Search events, venues, organizers…' }) {
  return (
    <div className="relative flex-1">
      <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-full glass-panel border border-white/10 focus:border-aurora-violet outline-none text-sm"
      />
    </div>
  );
}
