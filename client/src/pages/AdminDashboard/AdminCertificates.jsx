import React, { useEffect, useState } from 'react';
import { HiClipboardCheck } from 'react-icons/hi';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { adminService } from '../../services/adminService';

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;
    adminService
      .getCertificates()
      .then((data) => mounted && (setCertificates(data.certificates), setStatus('ready')))
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'loading') {
    return <Loader fullScreen label="Loading certificates" />;
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={HiClipboardCheck}
        title="Unable to load certificates"
        message="There was a problem retrieving certificates. Please try again later."
      />
    );
  }

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-1">Certificates</h1>
      <p className="text-ink-muted mb-8">View uploaded certificates and issuance details.</p>

      <div className="overflow-hidden rounded-2xl border border-slate-200/20 bg-slate-50 shadow-glass dark:border-white/10 dark:bg-slate-950">
        <table className="min-w-full text-left text-sm text-slate-900 dark:text-slate-200">
          <thead className="border-b border-slate-200/50 bg-slate-100/90 text-slate-600 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Uploaded by</th>
              <th className="px-5 py-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr key={certificate._id} className="border-b border-slate-200/50 hover:bg-slate-100 dark:border-white/5 dark:hover:bg-white/5">
                <td className="px-5 py-4">{certificate.title || 'Unnamed'}</td>
                <td className="px-5 py-4">{certificate.uploader?.name || 'Unknown'}</td>
                <td className="px-5 py-4">{new Date(certificate.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
