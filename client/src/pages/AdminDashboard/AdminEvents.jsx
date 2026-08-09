import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { eventService } from '../../services/eventService';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading');

  const loadEvents = async () => {
    setStatus('loading');
    try {
      const data = await eventService.list({ limit: 100 });
      setEvents(data.events ?? []);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      toast.error('Unable to load events.');
    }
  };

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
      await eventService.remove(eventId);
      setEvents((current) => current.filter((event) => event._id !== eventId));
      toast.success('Event deleted successfully.');
    } catch (err) {
      toast.error('Unable to delete the event.');
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) loadEvents();
    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'loading') {
    return <Loader fullScreen label="Loading events" />;
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={HiCalendar}
        title="Unable to load events"
        message="There was a problem retrieving events. Please try again later."
      />
    );
  }

  const adminEvents = events.filter((event) => event.organizer?.role === 'admin');
  const organizerEvents = events.filter((event) => event.organizer?.role === 'organizer');
  const otherEvents = events.filter(
    (event) => event.organizer?.role !== 'admin' && event.organizer?.role !== 'organizer'
  );

  const renderEventTable = (items) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-900 dark:text-slate-200">
        <thead className="border-b border-slate-200/50 bg-slate-100/90 text-slate-600 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Venue</th>
            <th className="px-6 py-4">Event date</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Creator</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((event) => (
            <tr key={event._id} className="border-b border-slate-200/50 transition hover:bg-slate-100 dark:border-white/5 dark:hover:bg-white/5">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-white">{event.title}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {event.slug}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-slate-100/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
                  {event.venue}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-slate-100/90 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-slate-900/90 dark:text-emerald-300">
                  {new Date(event.eventDate).toLocaleDateString()}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-slate-100/90 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
                  {event.category || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-slate-100/90 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
                  {event.organizer?.role || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/events/${event.slug}/edit`}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(event._id)}
                    className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200/20 bg-slate-50/80 p-6 shadow-2xl shadow-slate-200/10 ring-1 ring-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-cyan-950/20 dark:ring-white/5">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Admin dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900 dark:text-white sm:text-5xl">Manage Events</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Review published events, edit details, or remove outdated listings. Your changes will update site availability immediately.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-3xl bg-slate-100/90 px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/60 dark:bg-slate-900/90 dark:text-slate-200 dark:ring-white/10">
              <span className="block text-sm text-slate-500 dark:text-slate-400">Total events</span>
              <span className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{events.length}</span>
            </div>
            <Link
              to="/events/create"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] hover:from-cyan-400 hover:to-sky-400"
            >
              Publish event
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/20 bg-slate-50/90 p-5 shadow-glass dark:border-white/10 dark:bg-slate-950/95">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Admin-created</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{adminEvents.length}</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-400">Events created by admins</p>
        </div>
        <div className="rounded-3xl border border-slate-200/20 bg-slate-50/90 p-5 shadow-glass dark:border-white/10 dark:bg-slate-950/95">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Organizer-created</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{organizerEvents.length}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Events created by organizers</p>
        </div>
        <div className="rounded-3xl border border-slate-200/20 bg-slate-50/90 p-5 shadow-glass dark:border-white/10 dark:bg-slate-950/95">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Other</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{otherEvents.length}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Events with another creator role</p>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200/20 bg-slate-50 shadow-glass dark:border-white/10 dark:bg-slate-950">
        <div className="border-b border-slate-200/50 bg-slate-100/80 px-6 py-4 dark:border-white/5 dark:bg-slate-900/90">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Admin-created events</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Events created by admins in the system.</p>
        </div>
        {adminEvents.length > 0 ? renderEventTable(adminEvents) : (
          <div className="p-8 text-slate-400">No admin-created events found.</div>
        )}
      </section>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200/20 bg-slate-50 shadow-glass dark:border-white/10 dark:bg-slate-950">
        <div className="border-b border-slate-200/50 bg-slate-100/80 px-6 py-4 dark:border-white/5 dark:bg-slate-900/90">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Organizer-created events</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Events created by organizer accounts.</p>
        </div>
        {organizerEvents.length > 0 ? renderEventTable(organizerEvents) : (
          <div className="p-8 text-slate-400">No organizer-created events found.</div>
        )}
      </section>

      {otherEvents.length > 0 && (
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200/20 bg-slate-50 shadow-glass dark:border-white/10 dark:bg-slate-950">
          <div className="border-b border-slate-200/50 bg-slate-100/80 px-6 py-4 dark:border-white/5 dark:bg-slate-900/90">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Other events</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Events created by users with nonstandard roles.</p>
          </div>
          {renderEventTable(otherEvents)}
        </section>
      )}
    </div>
  );
}
