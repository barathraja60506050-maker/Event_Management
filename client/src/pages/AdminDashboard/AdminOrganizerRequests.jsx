import React, { useEffect, useState } from 'react';
import { HiBadgeCheck, HiDocumentText } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { adminService } from '../../services/adminService';

export default function AdminOrganizerRequests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState('loading');
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    let mounted = true;
    adminService
      .getOrganizerRequests()
      .then((data) => mounted && (setRequests(data.requests), setStatus('ready')))
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  const updateStatus = async (id, newStatus) => {
    setActionId(id);
    try {
      const data = await adminService.updateOrganizerRequestStatus(id, newStatus);
      setRequests((prev) => prev.map((request) => (request._id === id ? data.request : request)));
      toast.success(`Request ${newStatus} successfully.`);
    } catch (err) {
      toast.error(err.message || 'Unable to update request status.');
    } finally {
      setActionId(null);
    }
  };

  if (status === 'loading') {
    return <Loader fullScreen label="Loading organizer requests" />;
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={HiDocumentText}
        title="Unable to load organizer requests"
        message="There was a problem retrieving organizer requests. Please try again later."
      />
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={HiBadgeCheck}
        title="No organizer requests yet"
        message="Users will appear here once they submit a request to become an organizer."
      />
    );
  }

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-1">Organizer requests</h1>
      <p className="text-ink-muted mb-8">Review and approve pending organizer applications.</p>

      <div className="overflow-hidden rounded-2xl border border-slate-200/20 bg-slate-50 shadow-glass dark:border-white/10 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm text-slate-900 dark:text-slate-200">
          <thead className="border-b border-slate-200/30 bg-slate-100/90 text-slate-600 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4">Applicant</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">Submitted</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Documents</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-slate-200/50 hover:bg-slate-100 dark:border-white/5 dark:hover:bg-white/5">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{request.fullName}</div>
                  <div className="text-slate-500 text-xs mt-1 dark:text-slate-400">{request.purpose}</div>
                </td>
                <td className="px-5 py-4">
                  <div>{request.email}</div>
                  <div className="text-slate-500 dark:text-slate-400">{request.contactNumber}</div>
                </td>
                <td className="px-5 py-4">
                  <div>{new Date(request.createdAt).toLocaleDateString()}</div>
                  {request.approvedAt && (
                    <div className="text-slate-400 text-xs">Approved {new Date(request.approvedAt).toLocaleDateString()}</div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      request.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : request.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                        : 'bg-slate-200/80 text-slate-700 dark:bg-slate-700/70 dark:text-slate-200'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-5 py-4 space-y-1">
                  <a
                    href={request.idProof}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    ID proof
                  </a>
                  <a
                    href={request.passportPhoto}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    Passport photo
                  </a>
                </td>
                <td className="px-5 py-4 space-x-2">
                  <button
                    type="button"
                    disabled={request.status !== 'pending' || actionId === request._id}
                    onClick={() => updateStatus(request._id, 'approved')}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={request.status !== 'pending' || actionId === request._id}
                    onClick={() => updateStatus(request._id, 'rejected')}
                    className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
