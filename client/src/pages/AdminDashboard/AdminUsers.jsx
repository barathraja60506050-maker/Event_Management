import React, { useEffect, useState } from 'react';
import { HiUsers } from 'react-icons/hi';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { adminService } from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;
    adminService
      .getUsers()
      .then((data) => mounted && (setUsers(data.users), setStatus('ready')))
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'loading') {
    return <Loader fullScreen label="Loading users" />;
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon={HiUsers}
        title="Unable to load users"
        message="There was a problem retrieving users. Please try again later."
      />
    );
  }

  const groupedUsers = users.reduce(
    (groups, user) => {
      const role = user.role || 'user';
      groups[role] = groups[role] || [];
      groups[role].push(user);
      return groups;
    },
    {
      admin: [],
      organizer: [],
      user: [],
    }
  );

  const roleCards = [
    { role: 'admin', label: 'Admins', color: 'from-fuchsia-500 to-violet-500' },
    { role: 'organizer', label: 'Organizers', color: 'from-cyan-500 to-sky-500' },
    { role: 'user', label: 'Users', color: 'from-emerald-500 to-lime-500' },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Manage users</h1>
          <p className="text-ink-muted">View all registered users and their roles.</p>
        </div>
      </div>

      <div className="grid gap-4 mt-8 sm:grid-cols-3">
        {roleCards.map(({ role, label, color }) => (
          <div key={role} className="rounded-3xl border border-slate-200/20 bg-slate-50/90 p-5 shadow-glass dark:border-white/10 dark:bg-slate-950/95">
            <div className={`inline-flex items-center rounded-full bg-gradient-to-r ${color} px-3 py-1 text-xs font-semibold text-slate-950 shadow-lg shadow-slate-900/20`}>
              {label}
            </div>
            <p className="mt-4 text-4xl font-display font-bold">{groupedUsers[role]?.length ?? 0}</p>
            <p className="mt-2 text-sm text-ink-muted">Total {label.toLowerCase()}</p>
          </div>
        ))}
      </div>

      {roleCards.map(({ role, label }) => (
        <section key={role} className="mt-10">
          <h2 className="text-xl font-semibold mb-4">{label}</h2>
          {groupedUsers[role]?.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200/20 bg-slate-50 shadow-glass dark:border-white/10 dark:bg-slate-950">
              <table className="min-w-full text-left text-sm text-slate-900 dark:text-slate-200">
                <thead className="border-b border-slate-200/50 bg-slate-100/90 text-slate-600 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Active</th>
                    <th className="px-5 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedUsers[role].map((user) => (
                    <tr key={user.id || user._id} className="border-b border-slate-200/50 hover:bg-slate-100 dark:border-white/5 dark:hover:bg-white/5">
                      <td className="px-5 py-4">{user.name}</td>
                      <td className="px-5 py-4">{user.email}</td>
                      <td className="px-5 py-4">{user.isActive ? 'Yes' : 'No'}</td>
                      <td className="px-5 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/20 bg-slate-50/90 p-8 text-center text-slate-500 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-400">
              No {label.toLowerCase()} found.
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
