import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "../components/admin/AdminHeader.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="rt-admin-page flex min-h-screen min-w-0">
      {sidebarOpen && (
        <div className="fixed inset-0 z-[80] flex md:hidden">
          <div className="w-[min(82vw,280px)] p-2">
            <AdminSidebar closeSidebar={() => setSidebarOpen(false)} mobile />
          </div>
          <button
            type="button"
            aria-label="Close admin navigation"
            className="flex-1 bg-black/55 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="hidden shrink-0 md:block">
        <AdminSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-w-0 flex-1 px-4 pb-8 pt-4 sm:px-5 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
