import React, { useEffect, useState } from 'react';
import { HiUsers, HiCalendar, HiClipboardList, HiCurrencyRupee } from 'react-icons/hi';
import Sidebar from '../../components/Sidebar/Sidebar';
import DashboardCards from '../../components/DashboardCards/DashboardCards';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { dashboardService } from '../../services/eventService';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;
    dashboardService
      .adminAnalytics()
      .then((data) => mounted && (setAnalytics(data), setStatus('ready')))
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display font-bold text-3xl mb-1">Admin overview</h1>
      <p className="text-ink-muted mb-8">Platform-wide activity at a glance.</p>

      {status === 'loading' && <Loader fullScreen label="Crunching the numbers" />}

      {status === 'error' && (
        <EmptyState
          icon={HiUsers}
          title="Analytics unavailable"
          message="This connects to the admin analytics API once it's deployed."
        />
      )}

      {status === 'ready' && analytics && (
        <DashboardCards
          cards={[
            { label: 'Total users', value: analytics.totalUsers ?? 0, icon: <HiUsers /> },
            { label: 'Total events', value: analytics.totalEvents ?? 0, icon: <HiCalendar /> },
            { label: 'Registrations', value: analytics.totalRegistrations ?? 0, icon: <HiClipboardList /> },
            { label: 'Revenue', value: `₹${analytics.totalRevenue ?? 0}`, icon: <HiCurrencyRupee /> },
          ]}
        />
      )}
    </div>
  );
}
