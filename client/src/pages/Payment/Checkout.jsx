import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader/Loader';
import QRCodeModal from '../../components/QRCodeModal/QRCodeModal';
import { paymentService, registrationService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net banking' },
  { value: 'wallet', label: 'Wallet' },
];

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [registration, setRegistration] = useState(location.state?.registration ?? null);
  const [status, setStatus] = useState('loading');
  const [method, setMethod] = useState('card');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (registration) {
      setPaymentCompleted(registration.status === 'confirmed');
      setStatus('ready');
      return;
    }

    let mounted = true;
    registrationService
      .getById(id)
      .then((data) => {
        if (!mounted) return;
        setRegistration(data.registration);
        setPaymentCompleted(data.registration?.status === 'confirmed');
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, [id, registration]);

  const totalAmount = useMemo(() => {
    if (!registration) return 0;
    return (registration.event?.ticketPrice ?? 0) * (registration.quantity ?? 1);
  }, [registration]);

  const isFree = totalAmount === 0;
  const canPay = status === 'ready' && registration && !paymentCompleted;
  const paymentLabel = isFree ? 'Complete booking' : isPaying ? 'Processing payment…' : `Pay ₹${totalAmount}`;

  const handlePayment = async () => {
    if (!canPay) return;
    setIsPaying(true);

    try {
      const data = await paymentService.pay({
        registrationId: registration._id,
        method: isFree ? 'free' : method,
      });

      setRegistration(data.registration ?? registration);
      setPaymentCompleted(true);
      setModalOpen(true);
      toast.success('Payment successful! Your ticket is ready.');
    } catch (err) {
      toast.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  if (status === 'loading') {
    return <Loader fullScreen label="Loading booking details" />;
  }

  if (status === 'error' || !registration) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h2 className="font-display font-bold text-2xl mb-2">Booking not available</h2>
        <p className="text-ink-muted mb-6">We could not find your registration or it may no longer be valid.</p>
        <Link to="/events" className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold gradient-btn">
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <div className="rounded-3xl glass-panel p-8 shadow-glass">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl">Secure your ticket</h1>
            <p className="text-ink-muted">Complete the payment to confirm your booking for {registration.event.title}.</p>
          </div>
          <div className="text-right text-sm text-ink-muted">
            {user?.name && <div>Booked by {user.name}</div>}
            <div>{registration.event.venue}</div>
            <div>{new Date(registration.event.eventDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-semibold text-xl mb-4">Booking summary</h2>
              <div className="grid gap-3 text-sm text-ink-muted">
                <div className="flex justify-between">
                  <span>Event</span>
                  <span>{registration.event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attendee</span>
                  <span>{registration.attendeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email</span>
                  <span>{registration.attendeeEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact</span>
                  <span>{registration.attendeePhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tickets</span>
                  <span>{registration.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per ticket</span>
                  <span>{registration.event.ticketPrice > 0 ? `₹${registration.event.ticketPrice}` : 'Free'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-semibold text-xl mb-4">Payment details</h2>
              <div className="text-sm text-ink-muted mb-4">
                Total amount: <span className="font-semibold text-ink-contrast">₹{totalAmount}</span>
              </div>

              {!isFree && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold">Payment method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/5 px-4 py-3 text-sm"
                  >
                    {PAYMENT_METHODS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={handlePayment}
                disabled={!canPay || isPaying}
                className="mt-6 w-full rounded-full px-5 py-3 text-sm font-semibold gradient-btn disabled:opacity-50"
              >
                {paymentLabel}
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-aurora-gradient-soft p-6 text-sm text-ink-contrast">
            <h2 className="font-semibold text-xl mb-4">Need help?</h2>
            <p className="leading-relaxed">
              After payment, your ticket will be generated with a secure QR code. Download it and bring it to the event.
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Amount</p>
                <p className="font-semibold text-xl">₹{totalAmount}</p>
              </div>
              <div className="rounded-2xl bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Tickets</p>
                <p className="font-semibold text-xl">{registration.quantity}</p>
              </div>
            </div>
          </aside>
        </div>

        {paymentCompleted && registration.qrCode && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold text-xl mb-3">Booking confirmed</h2>
            <p className="text-sm text-ink-muted mb-4">
              Your payment is complete and your ticket is ready to download.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-black/5 p-4">
                <span className="text-xs text-ink-muted">Ticket number</span>
                <p className="font-semibold mt-2">{registration.ticketNumber}</p>
              </div>
              <div className="rounded-2xl bg-black/5 p-4">
                <span className="text-xs text-ink-muted">Receipt</span>
                <p className="font-semibold mt-2">{registration.payment?.receiptNumber ?? 'N/A'}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={registration.qrCode}
                download={`${registration.ticketNumber}.png`}
                className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold gradient-btn"
              >
                Download ticket
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 font-semibold"
              >
                View QR
              </button>
            </div>
          </div>
        )}
      </div>

      <QRCodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        qrUrl={registration.qrCode}
        ticketNumber={registration.ticketNumber}
        eventTitle={registration.event.title}
        venue={registration.event.venue}
        eventDate={registration.event.eventDate}
        startTime={registration.event.startTime}
        paymentMethod={registration.payment?.method}
        quantity={registration.quantity}
        attendeeName={registration.attendeeName}
        attendeePhone={registration.attendeePhone}
      />
    </div>
  );
}
