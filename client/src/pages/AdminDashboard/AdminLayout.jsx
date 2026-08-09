import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
