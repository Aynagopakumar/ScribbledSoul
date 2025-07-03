import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Make sure lucide-react is installed
import clsx from 'clsx';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Toggle Button (Mobile only) */}
      <button
        className="absolute top-4 left-4 z-50 text-gray-800 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:static top-0 left-0 z-40 w-64 h-full bg-gray-100 p-4 shadow transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        
        {/* Close Button inside Sidebar (Mobile only) */}
        <div className="flex justify-end md:hidden mb-4">
          <button onClick={toggleSidebar}>
            <X size={32} className="text-gray-800" />
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <Link to="/dashboard/blogs"  onClick={() => setIsSidebarOpen(false)}>🏠 Home</Link>
          <Link to="/dashboard/profile"  onClick={() => setIsSidebarOpen(false)}>👤 Profile</Link>
          <Link to="/dashboard/notifications"  onClick={() => setIsSidebarOpen(false)}>🔔 Notifications</Link>
          <Link to="/dashboard/settings" onClick={() => setIsSidebarOpen(false)}>⚙️ Settings</Link>

          <button
            onClick={handleLogout}
            className="text-left text-red-600 hover:underline mt-4"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white ml-0 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
