import React from 'react';

/**
 * A directive empty state: says what's missing and what to do about it,
 * rather than a bare "No data" message.
 */
export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl2 glass-panel">
      {Icon && (
        <div className="mb-4 h-14 w-14 rounded-full bg-aurora-gradient-soft flex items-center justify-center">
          <Icon className="text-2xl text-aurora-violet dark:text-aurora-cyan" />
        </div>
      )}
      <h3 className="text-lg font-semibold font-display mb-1">{title}</h3>
      {message && <p className="text-sm text-ink-muted max-w-sm mb-4">{message}</p>}
      {action}
    </div>
  );
}
