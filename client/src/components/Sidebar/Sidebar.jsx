import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiChartBar, HiUsers, HiCalendar, HiClipboardList, HiCreditCard, HiClipboardCheck, HiDocumentText } from 'react-icons/hi';

const links = [
  { to: '/admin', label: 'Overview', icon: <HiChartBar />, end: true },
  { to: '/admin/users', label: 'Users', icon: <HiUsers /> },
  { to: '/admin/events', label: 'Events', icon: <HiCalendar /> },
  { to: '/admin/registrations', label: 'Registrations', icon: <HiClipboardList /> },
  { to: '/admin/payments', label: 'Payments', icon: <HiCreditCard /> },
  { to: '/admin/certificates', label: 'Certificates', icon: <HiClipboardCheck /> },
  { to: '/admin/organizer-requests', label: 'Organizer requests', icon: <HiDocumentText /> },
];

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'gradient-btn' : 'glass-panel border border-white/10 text-ink-muted hover:text-current'
              }`
            }
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
