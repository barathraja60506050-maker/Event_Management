import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiCamera } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { organizerService } from '../../services/organizerService';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '', bio: user?.bio ?? '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [organizerForm, setOrganizerForm] = useState({
    fullName: user?.name ?? '',
    email: user?.email ?? '',
    contactNumber: user?.phone ?? '',
    purpose: '',
  });
  const [idProofFile, setIdProofFile] = useState(null);
  const [passportPhotoFile, setPassportPhotoFile] = useState(null);
  const [organizerSubmitting, setOrganizerSubmitting] = useState(false);
  const [organizerRequest, setOrganizerRequest] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!user) return undefined;

    organizerService
      .getMyRequest()
      .then((data) => {
        if (mounted && data.request) {
          setOrganizerRequest(data.request);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!mounted) return;
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (avatarFile) formData.append('avatar', avatarFile);

      const { user: updated } = await authService.updateProfile(formData);
      updateUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      await authService.updatePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.message || 'Could not change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleOrganizerRequest = async (e) => {
    e.preventDefault();
    if (
      !organizerForm.fullName.trim() ||
      !organizerForm.email.trim() ||
      !organizerForm.contactNumber.trim() ||
      !organizerForm.purpose.trim() ||
      !idProofFile ||
      !passportPhotoFile
    ) {
      toast.error('Please complete all organizer request fields and upload both documents.');
      return;
    }

    setOrganizerSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fullName', organizerForm.fullName.trim());
      formData.append('email', organizerForm.email.trim());
      formData.append('contactNumber', organizerForm.contactNumber.trim());
      formData.append('purpose', organizerForm.purpose.trim());
      formData.append('idProof', idProofFile);
      formData.append('passportPhoto', passportPhotoFile);

      const data = await organizerService.requestOrganizer(formData);
      setOrganizerRequest(data.request);
      toast.success(
        data.message || 'Organizer request submitted. We will reach out to you soon with further instructions.'
      );
    } catch (err) {
      toast.error(err.message || 'Unable to submit organizer request');
    } finally {
      setOrganizerSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 flex flex-col gap-8">
      <h1 className="font-display font-bold text-3xl">Your profile</h1>

      <form onSubmit={handleSaveProfile} className="glass-panel shadow-glass rounded-xl2 p-6 flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-aurora-gradient-soft overflow-hidden flex items-center justify-center text-2xl font-display font-bold">
              {avatarFile ? (
                <img src={URL.createObjectURL(avatarFile)} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user?.name?.[0]
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full gradient-btn flex items-center justify-center cursor-pointer text-xs">
              <HiCamera />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <div>
            <p className="font-semibold">{user?.email}</p>
            <p className="text-xs uppercase tracking-wide text-ink-muted mt-1">{user?.role}</p>
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          Full name
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Bio
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            rows={3}
            maxLength={300}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none resize-none"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="self-start px-6 py-2.5 rounded-full font-semibold gradient-btn disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      {user?.role === 'user' && !organizerRequest ? (
        <form id="organizer" onSubmit={handleOrganizerRequest} className="glass-panel shadow-glass rounded-xl2 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-semibold text-lg">Become an organizer</h2>
              <p className="text-sm text-ink-muted">
                Fill this form to request organizer access. Upload a valid ID proof and passport-size photo (PDF or image).
              </p>
            </div>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            Full name
          <input
            type="text"
            value={organizerForm.fullName}
            onChange={(e) => setOrganizerForm((f) => ({ ...f, fullName: e.target.value }))}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Email address
          <input
            type="email"
            value={organizerForm.email}
            onChange={(e) => setOrganizerForm((f) => ({ ...f, email: e.target.value }))}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Contact number
          <input
            type="text"
            value={organizerForm.contactNumber}
            onChange={(e) => setOrganizerForm((f) => ({ ...f, contactNumber: e.target.value }))}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Purpose
          <textarea
            rows={4}
            value={organizerForm.purpose}
            onChange={(e) => setOrganizerForm((f) => ({ ...f, purpose: e.target.value }))}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none resize-none"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-sm font-medium">ID proof (PDF / JPG / PNG)</span>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-sm">
              <div className="mb-3 text-xs uppercase tracking-[0.18em] text-ink-muted">Upload document</div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 truncate">
                  {idProofFile ? idProofFile.name : 'No file chosen'}
                </div>
                <label className="inline-flex items-center justify-center rounded-2xl bg-aurora-violet px-4 py-3 text-sm font-semibold text-white transition hover:bg-aurora-cyan cursor-pointer">
                  Choose file
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => setIdProofFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span className="text-sm font-medium">Passport-size photo (PDF / JPG / PNG)</span>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-sm">
              <div className="mb-3 text-xs uppercase tracking-[0.18em] text-ink-muted">Upload photo</div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 truncate">
                  {passportPhotoFile ? passportPhotoFile.name : 'No file chosen'}
                </div>
                <label className="inline-flex items-center justify-center rounded-2xl bg-aurora-violet px-4 py-3 text-sm font-semibold text-white transition hover:bg-aurora-cyan cursor-pointer">
                  Choose file
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => setPassportPhotoFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={organizerSubmitting}
          className="self-start px-6 py-2.5 rounded-full font-semibold gradient-btn disabled:opacity-60"
        >
          {organizerSubmitting ? 'Submitting…' : 'Request organizer access'}
        </button>
      </form>
      ) : null}

      {organizerRequest ? (
        <div className="glass-panel shadow-glass rounded-xl2 p-6 bg-emerald-500/10 border border-emerald-500/20 text-slate-950 dark:text-slate-100">
          <p className="font-semibold">Request {organizerRequest.status === 'pending' ? 'submitted' : organizerRequest.status}</p>
          <p>
            {organizerRequest.status === 'pending'
              ? 'We will reach out to you soon with further instructions.'
              : organizerRequest.status === 'approved'
              ? 'Your organizer request has been approved. You will be transferred to organizer access shortly.'
              : 'Your organizer request was rejected. Please contact support for next steps.'}
          </p>
          <p className="mt-2 text-xs text-slate-200 dark:text-slate-300">Organizer ID: {organizerRequest.organizerId}</p>
          <p className="text-xs text-slate-200 dark:text-slate-300">Status: {organizerRequest.status}</p>
        </div>
      ) : null}

      <form onSubmit={handleChangePassword} className="glass-panel shadow-glass rounded-xl2 p-6 flex flex-col gap-5">
        <h2 className="font-display font-semibold text-lg">Change password</h2>

        <label className="flex flex-col gap-1.5 text-sm">
          Current password
          <input
            type="password"
            required
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          New password
          <input
            type="password"
            required
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            className="px-4 py-2.5 rounded-lg bg-transparent border border-white/15 focus:border-aurora-violet outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={changingPassword}
          className="self-start px-6 py-2.5 rounded-full font-semibold gradient-btn disabled:opacity-60"
        >
          {changingPassword ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
