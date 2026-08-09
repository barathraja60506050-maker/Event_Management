import React, { useEffect, useRef, useState } from 'react';

const CATEGORIES = ['Technology', 'Music', 'Business', 'Sports', 'Arts', 'Education', 'Other'];

/**
 * Shared form for both creating and editing an event. `initialValues` and
 * `submitLabel` differ between the two call sites; the validation and
 * field layout stay identical so organizers get a consistent experience.
 */
export default function EventForm({ initialValues, onSubmit, submitLabel = 'Publish event', submitting }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    venue: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    registrationDeadline: '',
    capacity: 50,
    ticketPrice: 0,
    ...initialValues,
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!bannerFile) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(bannerFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'organizer' || value === undefined || value === null) return;
      if (typeof value === 'object' && !(value instanceof File)) return;
      formData.append(key, value);
    });

    if (bannerFile) formData.append('banner', bannerFile);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel shadow-glass rounded-xl2 p-6 flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm">
        Event title
        <input
          name="title"
          required
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. React Summit Meetup"
          className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Description
        <textarea
          name="description"
          required
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none resize-none"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Venue
          <input
            name="venue"
            required
            value={form.venue}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Event date
          <input
            type="date"
            name="eventDate"
            required
            value={form.eventDate}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Registration deadline
          <input
            type="date"
            name="registrationDeadline"
            required
            value={form.registrationDeadline}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Start time
          <input
            type="time"
            name="startTime"
            required
            value={form.startTime}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          End time
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Capacity (seats)
          <input
            type="number"
            name="capacity"
            min={1}
            required
            value={form.capacity}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Ticket price (₹, 0 = free)
          <input
            type="number"
            name="ticketPrice"
            min={0}
            value={form.ticketPrice}
            onChange={handleChange}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-200 shadow-inner shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">Event banner</p>
            <p className="mt-1 text-xs text-slate-400">Upload a cover image to make the event page stand out.</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-400"
          >
            Choose file
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
          {previewUrl ? (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
              <img src={previewUrl} alt="Banner preview" className="h-40 w-full object-cover" />
            </div>
          ) : (
            <div className="flex min-h-[10rem] items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-slate-900/80 text-slate-500">
              <span>No banner selected yet.</span>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">
            {bannerFile ? bannerFile.name : 'Supported: JPG, PNG, WEBP. Max size 5MB.'}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
