import React, { useEffect, useState } from 'react';
import { HiClipboardList } from 'react-icons/hi';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { adminService } from '../../services/adminService';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;
    adminService
      .getRegistrations()
      .then((data) => mounted && (setRegistrations(data.registrations), setStatus('ready')))
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'loading') {
    return <Loader fullScreen label="Loading registrations" />;
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={HiClipboardList}
        title="Unable to load registrations"
        message="There was a problem retrieving registrations. Please try again later."
      />
    );
  }

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-1">Registrations</h1>
      <p className="text-ink-muted mb-8">Review event registrations across the platform.</p>

      <div className="overflow-hidden rounded-2xl border border-slate-200/20 bg-slate-50 shadow-glass dark:border-white/10 dark:bg-slate-950">
        <table className="min-w-full text-left text-sm text-slate-900 dark:text-slate-200">
          <thead className="border-b border-slate-200/50 bg-slate-100/90 text-slate-600 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4">Attendee</th>
              <th className="px-5 py-4">Event</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Registered</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration._id} className="border-b border-slate-200/50 hover:bg-slate-100 dark:border-white/5 dark:hover:bg-white/5">
                <td className="px-5 py-4">{registration.user?.name || 'Unknown'}</td>
                <td className="px-5 py-4">{registration.event?.title || 'Unknown event'}</td>
                <td className="px-5 py-4">{registration.status || 'N/A'}</td>
                <td className="px-5 py-4">{new Date(registration.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
