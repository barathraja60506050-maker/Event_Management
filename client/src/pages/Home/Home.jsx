import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import EventCard from '../../components/EventCard/EventCard';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { eventService } from '../../services/eventService';
import { HiCalendar } from 'react-icons/hi';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let mounted = true;
    eventService
      .list({ limit: 6, sort: '-eventDate' })
      .then((res) => {
        if (!mounted) return;
        setEvents(res.events ?? []);
        setStatus('ready');
      })
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Upcoming events</h2>
          <Link to="/events" className="text-sm font-semibold text-aurora-violet dark:text-aurora-cyan">
            View all →
          </Link>
        </div>

        {status === 'loading' && <Loader fullScreen label="Fetching events" />}

        {status === 'error' && (
          <EmptyState
            icon={HiCalendar}
            title="Couldn't load events"
            message="The events service might still be starting up. Try refreshing in a moment."
          />
        )}

        {status === 'ready' && events.length === 0 && (
          <EmptyState
            icon={HiCalendar}
            title="No events yet"
            message="Be the first to host one — it takes less than five minutes to set up."
            action={
              <Link to="/register" className="px-5 py-2.5 rounded-full text-sm font-semibold gradient-btn">
                Create an event
              </Link>
            }
          />
        )}

        {status === 'ready' && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
