import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard/blogs" className="hover:text-blue-600">🏠 Home</Link>
          <Link to="/dashboard/profile" className="hover:text-blue-600">👤 Profile</Link>
          <Link to="/dashboard/notifications" className="hover:text-blue-600">🔔 Notifications</Link>
          <Link to="/dashboard/settings" className="hover:text-blue-600">⚙️ Settings</Link>
          <button
            onClick={handleLogout}
            className="text-left text-red-600 hover:underline mt-4"
          >
            🚪 Logout
          </button>
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
