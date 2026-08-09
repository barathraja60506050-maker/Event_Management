import React, { useEffect, useState, useCallback } from 'react';
import { HiCalendar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/EventCard/EventCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { eventService, registrationService } from '../../services/eventService';

export default function Events() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', timeframe: 'all', sort: 'eventDate' });
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [status, setStatus] = useState('loading');
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    if (user) {
      registrationService.myRegistrations().then((data) => {
        if (!mounted) return;
        const ids = new Set((data.registrations ?? []).map((registration) => registration.event?._id));
        setRegisteredEventIds(ids);
      });
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  const fetchEvents = useCallback(
    async (page = 1) => {
      setStatus('loading');
      try {
        const res = await eventService.list({
          search: query || undefined,
          category: filters.category || undefined,
          timeframe: filters.timeframe !== 'all' ? filters.timeframe : undefined,
          sort: filters.sort,
          page,
          limit: 9,
        });
        setEvents(res.events ?? []);
        setMeta(res.meta ?? { page: 1, totalPages: 1 });
        setStatus('ready');
      } catch (err) {
        setStatus('error');
      }
    },
    [query, filters]
  );

  useEffect(() => {
    const timeout = setTimeout(() => fetchEvents(1), 300); // debounce search typing
    return () => clearTimeout(timeout);
  }, [fetchEvents]);

  const canCreateEvent = user?.role === 'admin' || user?.role === 'organizer';

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl">Browse events</h1>
          <p className="text-ink-muted">Find your next experience or publish a new one if you are an organizer.</p>
        </div>
        {canCreateEvent ? (
          <Link
            to="/events/create"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold gradient-btn"
          >
            Create event
          </Link>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {status === 'loading' && <Loader fullScreen label="Finding events" />}

      {status === 'error' && (
        <EmptyState
          icon={HiCalendar}
          title="Couldn't load events"
          message="The events service might be unavailable right now. Try again shortly."
        />
      )}

      {status === 'ready' && events.length === 0 && (
        <EmptyState
          icon={HiCalendar}
          title="No matching events"
          message="Try a different search term or clear your filters."
        />
      )}

      {status === 'ready' && events.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} registered={registeredEventIds.has(event._id)} />
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchEvents(p)}
                  className={`h-9 w-9 rounded-full text-sm font-semibold transition-colors ${
                    p === meta.page ? 'gradient-btn' : 'glass-panel border border-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
