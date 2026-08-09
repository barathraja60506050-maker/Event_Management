import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventForm from '../../components/EventForm/EventForm';
import Loader from '../../components/Loader/Loader';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

export default function EditEvent() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('loading');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    eventService
      .getBySlug(slug)
      .then((data) => mounted && (setEvent(data.event), setStatus('ready')))
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const { event: updated } = await eventService.update(event._id, formData);
      toast.success('Event updated');
      navigate(`/events/${updated.slug}`);
    } catch (err) {
      toast.error(err.message || 'Could not update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') return <Loader fullScreen label="Loading event" />;
  if (status === 'error' || !event) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h2 className="font-display font-bold text-2xl">Event not found</h2>
      </div>
    );
  }

  const currentUserId = user?.id || user?._id;
  const eventOrganizerId = event.organizer?._id ? String(event.organizer._id) : event.organizer?.id;

  if (event.organizer && currentUserId !== eventOrganizerId && user?.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h2 className="font-display font-bold text-2xl">Unauthorized</h2>
        <p className="text-ink-muted mt-3">Only the event creator can edit this event.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display font-bold text-3xl mb-2">Edit event</h1>
      <p className="text-ink-muted mb-8">Changes go live as soon as you save.</p>
      <EventForm
        initialValues={{
          title: event.title,
          description: event.description,
          category: event.category,
          venue: event.venue,
          eventDate: event.eventDate?.slice(0, 10),
          registrationDeadline: event.registrationDeadline?.slice(0, 10),
          startTime: event.startTime,
          endTime: event.endTime,
          capacity: event.capacity,
          ticketPrice: event.ticketPrice,
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </div>
  );
}
