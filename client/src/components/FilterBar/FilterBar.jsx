import React from 'react';

const CATEGORIES = ['All', 'Technology', 'Music', 'Business', 'Sports', 'Arts', 'Education', 'Other'];
const TIMEFRAMES = [
  { value: 'all', label: 'Any time' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="px-4 py-2.5 rounded-full glass-panel border border-white/10 text-sm outline-none"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat === 'All' ? '' : cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={filters.timeframe}
        onChange={(e) => onChange({ ...filters, timeframe: e.target.value })}
        className="px-4 py-2.5 rounded-full glass-panel border border-white/10 text-sm outline-none"
      >
        {TIMEFRAMES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        className="px-4 py-2.5 rounded-full glass-panel border border-white/10 text-sm outline-none"
      >
        <option value="eventDate">Date: soonest first</option>
        <option value="-eventDate">Date: latest first</option>
        <option value="ticketPrice">Price: low to high</option>
        <option value="-ticketPrice">Price: high to low</option>
      </select>
    </div>
  );
}
