import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventForm from '../../components/EventForm/EventForm';
import { eventService } from '../../services/eventService';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const { event } = await eventService.create(formData);
      toast.success('Event published!');
      navigate(`/events/${event.slug}`);
    } catch (err) {
      toast.error(err.message || 'Could not create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display font-bold text-3xl mb-2">Create an event</h1>
      <p className="text-ink-muted mb-8">Fill in the details below — you can edit everything later.</p>
      <EventForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Publish event" />
    </div>
  );
}
