import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ThemeLayout from './ThemeLayout.jsx';

export default function AppShell({ title, children, sidebarVariant = 'user' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <ThemeLayout>
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12">
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar variant={sidebarVariant} />
          </div>
          <div className="lg:col-span-9">
            <Topbar title={title} onMenu={() => setIsSidebarOpen(true)} />
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          <div className="absolute left-3 top-3 w-[min(320px,calc(100%-24px))]">
            <Sidebar variant={sidebarVariant} onNavigate={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      ) : null}
    </ThemeLayout>
  );
}
