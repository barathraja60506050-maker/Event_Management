import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCalendar, HiLocationMarker, HiUserGroup } from 'react-icons/hi';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const getImageForEvent = (event) => {
  if (event.banner) return event.banner;

  const title = event.title?.toLowerCase() || '';

  if (title.includes('ml') || title.includes('machine')) return '/images/ml-bootcamp.png';
  if (title.includes('ui') || title.includes('ux')) return '/images/ui:ux-bootcamp.jpg';
  if (title.includes('music')) return '/images/music-event.jpg';
  if (title.includes('college') || title.includes('fest')) return '/images/collage-event.png';
  if (title.includes('javascript') || title.includes('js')) return '/images/javaScript-bootcamp.webp';
  if (title.includes('css')) return '/images/css-bootcamp.jpg';

  return '/images/AI-bootcamp.jpg';
};

/**
 * The signature card: a "poster" section up top and a ticket-stub footer
 * below it, separated by a perforated line with two cut-out notches —
 * echoing a real event ticket you'd tear along the dotted line.
 */
export default function EventCard({ event, registered, hideAction = false }) {
  const seatsLeft = event.seatsLeft ?? Math.max((event.capacity || 0) - (event.seatsBooked || 0), 0);
  const isFull = seatsLeft <= 0;
  const buttonLabel = registered ? 'View ticket' : 'Book ticket';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="ticket-stub glass-panel shadow-glass overflow-hidden flex flex-col"
    >
      <Link to={`/events/${event.slug}`} className="block">
        <div className="relative h-40 w-full overflow-hidden bg-aurora-gradient-soft">
          <img
            src={getImageForEvent(event)}
            alt={event.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/music-event.jpg';
            }}
          />
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
            {event.category}
          </span>
        </div>
      </Link>

      {/* Perforated divider with notches cut into the two side edges */}
      <div className="relative px-4">
        <div className="absolute -left-[11px] -top-[11px] h-[22px] w-[22px] rounded-full bg-base-light dark:bg-base-dark" />
        <div className="absolute -right-[11px] -top-[11px] h-[22px] w-[22px] rounded-full bg-base-light dark:bg-base-dark" />
        <div className="perforated-divider" />
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <Link to={`/events/${event.slug}`}>
          <h3 className="font-display font-semibold text-lg leading-snug hover:text-aurora-violet dark:hover:text-aurora-cyan transition-colors">
            {event.title}
          </h3>
        </Link>

        <div className="flex flex-col gap-1.5 text-sm text-ink-muted">
          <span className="flex items-center gap-2">
            <HiCalendar className="shrink-0" /> {formatDate(event.eventDate)} · {event.startTime}
          </span>
          <span className="flex items-center gap-2">
            <HiLocationMarker className="shrink-0" /> {event.venue}
          </span>
          <span className="flex items-center gap-2">
            <HiUserGroup className="shrink-0" />
            {isFull ? 'Fully booked' : `${seatsLeft} seats left`}
          </span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between font-mono">
          <span className="text-sm font-semibold">
            {event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free'}
          </span>
          {!hideAction && (
            <Link
              to={`/events/${event.slug}`}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${registered ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'gradient-btn'}`}
            >
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
