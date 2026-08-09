import React, { useEffect, useState } from 'react';
import { HiCurrencyRupee } from 'react-icons/hi';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { adminService } from '../../services/adminService';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;
    adminService
      .getPayments()
      .then((data) => mounted && (setPayments(data.payments), setStatus('ready')))
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'loading') {
    return <Loader fullScreen label="Loading payments" />;
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={HiCurrencyRupee}
        title="Unable to load payments"
        message="There was a problem retrieving payment records. Please try again later."
      />
    );
  }

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-1">Payments</h1>
      <p className="text-ink-muted mb-8">See platform payment history and revenue details.</p>

      <div className="overflow-hidden rounded-2xl border border-slate-200/20 bg-slate-50 shadow-glass dark:border-white/10 dark:bg-slate-950">
        <table className="min-w-full text-left text-sm text-slate-900 dark:text-slate-200">
          <thead className="border-b border-slate-200/50 bg-slate-100/90 text-slate-600 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b border-slate-200/50 hover:bg-slate-100 dark:border-white/5 dark:hover:bg-white/5">
                <td className="px-5 py-4">{payment.user?.name || 'Unknown'}</td>
                <td className="px-5 py-4">₹{payment.amount ?? '0'}</td>
                <td className="px-5 py-4">{payment.status || 'N/A'}</td>
                <td className="px-5 py-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
