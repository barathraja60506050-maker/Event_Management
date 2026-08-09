import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { paymentService, registrationService } from '../../services/eventService';

const PAYMENT_OPTIONS = [
  { value: 'card', label: 'Credit / Debit card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net banking' },
  { value: 'wallet', label: 'Wallet' },
];

export default function PaymentModal({ open, onClose, event, user, onComplete }) {
  const [step, setStep] = useState('booking');
  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cifNumber, setCifNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [success, setSuccess] = useState(false);
  const completionRef = useRef(false);
  const successTimerRef = useRef(null);

  const maxTickets = useMemo(
    () => Math.max(1, Math.min(10, event?.capacity - event?.seatsBooked)),
    [event]
  );
  const ticketPrice = event?.ticketPrice ?? 0;
  const totalAmount = useMemo(() => ticketPrice * quantity, [ticketPrice, quantity]);

  const cardValid = cardNumber.replace(/\D/g, '').length === 16;
  const cifValid = cifNumber.trim().length > 0;

  const canProceedBooking = () => {
    return attendeeName.trim() && attendeeEmail.trim() && attendeePhone.trim() && quantity > 0;
  };

  const canProceedPayment = () => {
    if (ticketPrice === 0) return true;
    if (method === 'card') return cardValid && cifValid;
    return true;
  };

  const startBooking = async () => {
    if (!event) return;
    if (!canProceedBooking()) {
      toast.error('Please fill your name, email, phone and ticket quantity');
      return;
    }

    setIsProcessing(true);
    try {
      const data = await registrationService.register({
        eventId: event._id,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim(),
        attendeePhone: attendeePhone.trim(),
        quantity,
      });
      setRegistration(data.registration);
      if (ticketPrice > 0) {
        setStep('payment');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      toast.error(err.message || 'Booking failed, please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const submitPayment = async () => {
    if (!registration) return;
    if (!canProceedPayment()) {
      toast.error('Please complete payment details before proceeding');
      return;
    }

    setIsProcessing(true);
    try {
      const data = await paymentService.pay({
        registrationId: registration._id,
        method,
      });
      setRegistration(data.registration);
      setSuccess(true);
      setStep('success');
    } catch (err) {
      const errorText =
        err?.response?.data?.message || err?.message || 'Payment failed, please try again.';
      if (errorText.toLowerCase().includes('already confirmed')) {
        setSuccess(true);
        setStep('success');
        return;
      }
      toast.error(errorText);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    if (completionRef.current) return;
    completionRef.current = true;
    onComplete?.(registration);
  };

  const resetModal = () => {
    if (success) {
      handleComplete();
    }

    setStep('booking');
    setRegistration(null);
    setSuccess(false);
    completionRef.current = false;
    setMethod('card');
    setCardNumber('');
    setCifNumber('');
    setQuantity(1);
    setAttendeeName(user?.name || '');
    setAttendeeEmail(user?.email || '');
    setAttendeePhone('');
    onClose?.();
  };

  useEffect(() => {
    if (!success) return undefined;

    successTimerRef.current = window.setTimeout(() => {
      handleComplete();
      resetModal();
    }, 5000);

    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, [success]);

  if (!event) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl rounded-[32px] bg-slate-950/98 p-6 shadow-2xl border border-white/15"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{success ? 'Booking complete' : 'Complete your booking'}</h2>
                <p className="text-sm text-ink-muted">
                  {success
                    ? 'Your payment is complete. Download your ticket below.'
                    : step === 'booking'
                    ? 'Enter your booking details to reserve your seat.'
                    : 'Confirm payment details to complete the booking.'}
                </p>
              </div>
              <button
                onClick={resetModal}
                className="text-2xl text-ink-muted hover:text-ink-contrast"
                aria-label="Close booking modal"
              >
                <HiX />
              </button>
            </div>

            {!success ? (
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
                <section className="space-y-6">
                  {step === 'booking' ? (
                    <>
                      <div className="rounded-3xl border border-white/10 bg-slate-900 p-5 space-y-4 shadow-sm shadow-slate-950/30">
                        <div className="text-sm text-slate-400">Event</div>
                        <div className="mt-2 font-semibold text-lg text-slate-100">{event.title}</div>
                        <div className="text-sm text-slate-300">{event.venue}</div>
                        <div className="text-sm text-slate-300">{event.ticketPrice > 0 ? `₹${event.ticketPrice} each` : 'Free event'}</div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-slate-100">Full name</label>
                          <input
                            type="text"
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-slate-100">Email address</label>
                          <input
                            type="email"
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                            placeholder="you@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-slate-100">Contact number</label>
                          <input
                            type="tel"
                            value={attendeePhone}
                            onChange={(e) => setAttendeePhone(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-slate-100">Number of tickets</label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                              disabled={quantity <= 1}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/5 disabled:opacity-40"
                            >
                              -
                            </button>
                            <span className="min-w-[2rem] text-center text-lg font-semibold">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity((prev) => Math.min(prev + 1, maxTickets))}
                              disabled={quantity >= maxTickets}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/5 disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-xs text-ink-muted mt-2">
                          Maximum available: {maxTickets} ticket{maxTickets === 1 ? '' : 's'} per booking (up to 10)
                        </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-3xl border border-white/10 bg-slate-900 p-5 space-y-4">
                        <div className="text-sm text-slate-400">Payment method</div>
                        {PAYMENT_OPTIONS.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 cursor-pointer transition-colors hover:border-white/20"
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={option.value}
                              checked={method === option.value}
                              onChange={() => setMethod(option.value)}
                              className="h-4 w-4 accent-aurora-violet"
                            />
                            <span className="text-sm font-medium">{option.label}</span>
                          </label>
                        ))}

                        {method === 'card' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold mb-2">Card number</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                                placeholder="1234 5678 9123 4567"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-2 text-slate-100">CIF number</label>
                              <input
                                type="text"
                                value={cifNumber}
                                onChange={(e) => setCifNumber(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
                                placeholder="Enter CIF number"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </section>

                <aside className="rounded-3xl border border-white/10 bg-slate-900 p-5 flex flex-col justify-between shadow-sm shadow-slate-950/20">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-400">Summary</div>
                      <div className="mt-2 text-3xl font-semibold text-slate-100">₹{ticketPrice * quantity}</div>
                    </div>
                    <div className="rounded-3xl bg-slate-800 p-4 text-sm text-slate-300">
                      {step === 'booking'
                        ? 'Review the booking details before moving to payment.'
                        : 'Confirm the selected payment method to complete the ticket purchase.'}
                    </div>
                    <div className="grid gap-3 text-sm text-ink-muted">
                      <div className="flex justify-between">
                        <span>Tickets</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price each</span>
                        <span>₹{ticketPrice}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={step === 'booking' ? startBooking : submitPayment}
                    disabled={isProcessing || (step === 'booking' ? !canProceedBooking() : !canProceedPayment())}
                    className="mt-6 w-full rounded-full bg-aurora-violet px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing
                      ? 'Processing…'
                      : step === 'booking'
                      ? ticketPrice > 0
                        ? 'Proceed to payment'
                        : 'Complete booking'
                      : `Pay ₹${ticketPrice * quantity}`}
                  </button>
                </aside>
              </div>
            ) : (
              <div className="rounded-[32px] border border-white/15 bg-slate-950/98 p-8 shadow-2xl shadow-slate-950/40 text-center max-w-xl mx-auto">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-3xl">
                  ✓
                </div>
                <div className="text-3xl font-semibold text-slate-100 mb-3">Payment successful</div>
                <p className="text-sm text-slate-300 mb-6">
                  Your ticket is ready. The button will update and your QR code is available for download.
                </p>
                {registration?.qrCode ? (
                  <div className="mx-auto mb-6 h-48 w-48 overflow-hidden rounded-3xl bg-white p-3 shadow-inner shadow-slate-950/20">
                    <img
                      src={registration.qrCode}
                      alt={`QR ticket for ${registration.ticketNumber}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-6 rounded-3xl bg-slate-900 p-6 text-slate-300">
                    Your payment is complete. Preparing your ticket QR now.
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (registration?.qrCode) {
                        window.location.href = registration.qrCode;
                      }
                    }}
                    disabled={!registration?.qrCode}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold ${registration?.qrCode ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-white text-black'} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {registration?.qrCode ? 'Download ticket' : 'Waiting for QR'}
                  </button>
                  <button
                    type="button"
                    onClick={resetModal}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
