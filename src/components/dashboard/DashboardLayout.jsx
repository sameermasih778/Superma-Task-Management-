import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const { user } = useAuth();

  const activeLoginType = sessionStorage.getItem('suprema_login_type') || localStorage.getItem('suprema_last_login_type');
  const isStaffOrAdmin = activeLoginType === 'admin' || ['super_admin', 'admin', 'developer'].includes(user?.role);

  return (
    <div className={`min-h-screen bg-black text-white flex ${isStaffOrAdmin ? 'pt-0' : 'pt-20 lg:pt-24'}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <DashboardHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet context={{ isNewTaskModalOpen, setIsNewTaskModalOpen }} />
        </main>
      </div>
    </div>
  );
}
