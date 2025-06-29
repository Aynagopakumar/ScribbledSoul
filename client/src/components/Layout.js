import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {isHome ? (
        // Only show Home page content without header/footer
        <Outlet />
      ) : (
        <>
          {/* Header */}
          <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          
          </header>

          {/* Main content */}
          <main className="flex-grow">
            <Outlet />
          </main>

          {/* Footer */}
         
        </>
      )}
    </div>
  );
};

export default Layout;
