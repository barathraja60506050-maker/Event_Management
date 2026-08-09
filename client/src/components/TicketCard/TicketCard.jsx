import React from 'react';
import { HiDownload, HiPrinter, HiCalendar } from 'react-icons/hi';

export default function TicketCard({ registration, onDownload }) {
  const event = registration.event ?? {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ticket-stub glass-panel shadow-glass overflow-hidden flex flex-col sm:flex-row">
      <div className="sm:w-40 shrink-0 bg-aurora-gradient-soft flex items-center justify-center p-4">
        {registration.qrCode ? (
          <img src={registration.qrCode} alt="QR ticket" className="h-28 w-28 bg-white rounded-lg p-1" />
        ) : (
          <div className="h-28 w-28 rounded-lg bg-white/10" />
        )}
      </div>

      <div className="relative flex-1 p-5 flex flex-col gap-2">
        <h3 className="font-display font-semibold">{event.title}</h3>
        <span className="text-xs text-ink-muted flex items-center gap-2">
          <HiCalendar />
          {event.eventDate && new Date(event.eventDate).toLocaleDateString()}
        </span>
        <span className="text-xs font-mono text-ink-muted">{registration.ticketNumber}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-aurora-violet dark:text-aurora-cyan">
          {registration.status}
        </span>

        <div className="mt-auto flex gap-3 pt-2">
          <button
            onClick={() => onDownload?.(registration)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full gradient-btn"
          >
            <HiDownload /> Download
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15"
          >
            <HiPrinter /> Print
          </button>
        </div>
      </div>
    </div>
  );
}
