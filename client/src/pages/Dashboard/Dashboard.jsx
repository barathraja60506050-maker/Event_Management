import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiCalendar, HiTicket, HiClipboardCheck, HiSparkles } from 'react-icons/hi';
import DashboardCards from '../../components/DashboardCards/DashboardCards';
import EventCard from '../../components/EventCard/EventCard';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { dashboardService, eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [summaryData, mineData] = await Promise.all([
          dashboardService.summary(),
          user?.role === 'organizer' ? eventService.mine() : Promise.resolve({ events: [] }),
        ]);

        if (!mounted) return;
        setSummary(summaryData);
        setOrganizerEvents(mineData.events ?? []);
        setStatus('ready');
      } catch (err) {
        if (!mounted) return;
        setStatus('error');
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [user]);

  const firstName = user?.name?.split(' ')[0];
  const isOrganizer = user?.role === 'organizer';

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
      await eventService.remove(eventId);
      setOrganizerEvents((current) => current.filter((event) => event._id !== eventId));
      setSummary((current) => ({
        ...current,
        createdCount: Math.max((current?.createdCount || 1) - 1, 0),
      }));
    } catch (err) {
      window.alert('Unable to delete the event.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display font-bold text-3xl mb-1">Welcome back, {firstName} 👋</h1>
      <p className="text-ink-muted mb-8">Here's what's happening with your events.</p>

      {status === 'loading' && <Loader fullScreen label="Loading your dashboard" />}

      {status === 'error' && (
        <EmptyState
          icon={HiSparkles}
          title="Dashboard data isn't available yet"
          message="This connects to the dashboard summary API once it's deployed."
        />
      )}

      {status === 'ready' && summary && (
        <>
          <DashboardCards
            cards={
              isOrganizer
                ? [
                    { label: 'Created events', value: organizerEvents.length, icon: <HiCalendar /> },
                    { label: 'Registered events', value: summary.registeredCount ?? 0, icon: <HiTicket /> },
                  ]
                : [
                    { label: 'Upcoming events', value: summary.upcomingCount ?? 0, icon: <HiCalendar /> },
                    { label: 'Registered events', value: summary.registeredCount ?? 0, icon: <HiTicket /> },
                    { label: 'Certificates earned', value: summary.certificateCount ?? 0, icon: <HiClipboardCheck /> },
                    { label: 'Recent activity', value: summary.recentActivityCount ?? 0, icon: <HiSparkles /> },
                  ]
            }
          />

          {isOrganizer && (
            <div className="mt-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl">Your published events</h2>
                  <p className="text-ink-muted">Only events you created are shown here.</p>
                </div>
                <Link
                  to="/events/create"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] hover:shadow-cyan-500/30"
                >
                  Create event →
                </Link>
              </div>

              {organizerEvents.length === 0 ? (
                <EmptyState
                  icon={HiCalendar}
                  title="No events created yet"
                  message="Publish your first event to start receiving registrations."
                  action={
                    <Link
                      to="/events/create"
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] hover:shadow-cyan-500/30"
                    >
                      Create event
                    </Link>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizerEvents.map((event) => (
                    <div key={event._id} className="space-y-3">
                      <EventCard event={event} hideAction />
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/events/${event.slug}/edit`}
                          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(event._id)}
                          className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isOrganizer && (
            <div className="mt-12">
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-display font-bold text-xl">Your registered events</h2>
                <Link to="/events" className="text-sm font-semibold text-aurora-violet dark:text-aurora-cyan">
                  Find more →
                </Link>
              </div>

              {(summary.registeredEvents ?? []).length === 0 ? (
                <EmptyState
                  icon={HiTicket}
                  title="No events registered yet"
                  message="Once you register for an event, it'll show up here with your ticket."
                  action={
                    <Link to="/events" className="px-5 py-2.5 rounded-full text-sm font-semibold gradient-btn">
                      Browse events
                    </Link>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {summary.registeredEvents.map((event) => (
                    <EventCard key={event._id} event={event} registered />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
