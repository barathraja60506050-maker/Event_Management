import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiCalendar, HiLocationMarker, HiUserGroup, HiUser } from 'react-icons/hi';
import Loader from '../../components/Loader/Loader';
import QRCodeModal from '../../components/QRCodeModal/QRCodeModal';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import { eventService, registrationService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, getFallbackByTitle } from '../../utils/getImageUrl';

export default function EventDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('loading');
  const [ticket, setTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    let mounted = true;
    eventService
      .getBySlug(slug)
      .then((data) => {
        if (!mounted) return;
        setEvent(data.event);
        setStatus('ready');
      })
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    let mounted = true;

    const loadEventRegistration = async () => {
      if (!event || !user) return;
      try {
        const data = await registrationService.myRegistrations();
        const existing = data.registrations?.find((registration) =>
          String(registration.event?._id) === String(event._id)
        );
        if (mounted && existing) {
          setTicket(existing);
          setRegistered(true);
        }
      } catch (error) {
        // silently ignore if the user has no registrations or the request fails
      }
    };

    loadEventRegistration();

    return () => {
      mounted = false;
    };
  }, [event, user]);

  const handleRegister = () => {
    if (organizerIsCurrentUser) return;

    if (ticket) {
      setModalOpen(true);
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${slug}` } } });
      return;
    }

    setBookingModalOpen(true);
  };

  if (status === 'loading') return <Loader fullScreen label="Loading event" />;
  if (status === 'error' || !event) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h2 className="font-display font-bold text-2xl mb-2">Event not found</h2>
        <p className="text-ink-muted">It may have been removed, or the link is incorrect.</p>
      </div>
    );
  }

  const seatsLeft = event.seatsLeft ?? Math.max(event.capacity - event.seatsBooked, 0);
  const isFull = seatsLeft <= 0;
  const formattedDeadline = event.registrationDeadline
    ? new Date(event.registrationDeadline).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const paymentMethodLabelMap = {
    card: 'Card',
    upi: 'UPI',
    netbanking: 'Net banking',
    wallet: 'Wallet',
    free: 'Free',
  };

  const ticketPaymentMethod = paymentMethodLabelMap[ticket?.payment?.method] ||
    (ticket?.status === 'CONFIRMED' ? 'Free' : 'Pending');

  const ticketVenue = ticket?.event?.venue || event.venue;
  const ticketEventDate = ticket?.event?.eventDate || event.eventDate;
  const ticketStartTime = ticket?.event?.startTime || event.startTime;
  const ticketQuantity = ticket?.quantity || 1;
  const organizerIsCurrentUser =
    user && String(user.id || user._id) === String(event.organizer?._id || event.organizer?.id);

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <div className="rounded-xl2 overflow-hidden h-64 sm:h-96 bg-aurora-gradient-soft mb-8">
        <img
          src={getImageUrl(event.banner, event.title)}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getFallbackByTitle(event.title);
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-aurora-gradient-soft text-aurora-violet dark:text-aurora-cyan">
            {event.category}
          </span>
          <h1 className="font-display font-bold text-3xl mt-3 mb-4">{event.title}</h1>
          <p className="text-ink-muted leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>

        <aside className="glass-panel shadow-glass rounded-xl2 p-6 h-fit sticky top-24">
          <div className="flex flex-col gap-3 text-sm mb-6">
            <span className="flex items-center gap-2">
              <HiCalendar />
              {new Date(event.eventDate).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}{' '}
              · {event.startTime}
            </span>
            <span className="flex items-center gap-2">
              <HiLocationMarker /> {event.venue}
            </span>
            <span className="flex items-center gap-2">
              <HiUserGroup /> {isFull ? 'Fully booked' : `${seatsLeft} of ${event.capacity} seats left`}
            </span>
            {event.organizer && (
              <span className="flex items-center gap-2">
                <HiUser /> Hosted by {organizerIsCurrentUser ? 'you' : event.organizer.name}
              </span>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="text-sm text-ink-muted">Registration deadline</div>
            <div className="text-2xl font-semibold">{formattedDeadline || 'TBA'}</div>
            <div className="text-sm text-ink-muted">Price per ticket</div>
            <div className="text-2xl font-semibold">{event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free'}</div>
          </div>

          {!organizerIsCurrentUser && (
            <button
              onClick={handleRegister}
              disabled={isFull}
              className={`w-full py-3 rounded-full font-semibold disabled:opacity-50 ${ticket ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'gradient-btn'}`}
            >
              {isFull ? 'Fully booked' : ticket ? 'Download ticket' : 'Book now'}
            </button>
          )}
        </aside>
      </div>

      <QRCodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        qrUrl={ticket?.qrCode}
        ticketNumber={ticket?.ticketNumber}
        eventTitle={ticket?.event?.title || event.title}
        venue={ticketVenue}
        eventDate={ticketEventDate}
        startTime={ticketStartTime}
        paymentMethod={ticketPaymentMethod}
        quantity={ticketQuantity}
        attendeeName={ticket?.attendeeName}
        attendeePhone={ticket?.attendeePhone}
      />

      <PaymentModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        event={event}
        user={user}
        onComplete={(updatedRegistration) => {
          setTicket(updatedRegistration);
          setRegistered(true);
          setBookingModalOpen(false);
          setModalOpen(true);
        }}
      />
    </div>
  );
}
