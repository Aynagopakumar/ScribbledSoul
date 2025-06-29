import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard/profile" className="hover:text-blue-600">👤 Profile</Link>
          <Link to="/dashboard/notifications" className="hover:text-blue-600">🔔 Notifications</Link>
          <Link to="/dashboard/settings" className="hover:text-blue-600">⚙️ Settings</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
