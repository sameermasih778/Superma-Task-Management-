import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import CreateTaskModal from './CreateTaskModal';
import usePublicNavOffset from '../../hooks/usePublicNavOffset';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  // Which project the new task should be filed under. The header button has no
  // project context, so it stays null and the modal lets the user pick.
  const [newTaskProjectId, setNewTaskProjectId] = useState(null);
  // The task being edited, when the modal was opened from a task row rather than
  // the header button. Lives here because the modal does.
  const [editingTask, setEditingTask] = useState(null);

  // Replaces the old hardcoded `pt-20 lg:pt-24`. The public Navbar is fixed and
  // is 116px tall at desktop, so that padding left DashboardHeader (search,
  // New Task, notifications) sitting 20px underneath it.
  //
  // Returns 0 on staff portals, where App.jsx renders no public Navbar - so the
  // admin/developer dashboard keeps its original zero-offset layout exactly.
  const navOffset = usePublicNavOffset();

  return (
    <div
      style={navOffset ? { paddingTop: navOffset } : undefined}
      className="min-h-screen bg-black text-white flex"
    >
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <DashboardHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenNewTaskModal={() => {
            setNewTaskProjectId(null);
            setEditingTask(null);
            setIsNewTaskModalOpen(true);
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Outlet
              context={{
                isNewTaskModalOpen,
                setIsNewTaskModalOpen,
                editingTask,
                setEditingTask,
                setNewTaskProjectId
              }}
            />
          </main>
        </div>

      {/*
        The modal lives here rather than inside TasksPage so the header button
        works from every dashboard page. It used to be rendered only on the
        Tasks Board, so clicking "New Task" from Overview set state that nothing
        was listening to and appeared to do nothing.
      */}
      <CreateTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => {
          setIsNewTaskModalOpen(false);
          setEditingTask(null);
        }}
        projectId={newTaskProjectId}
        taskToEdit={editingTask}
        onTaskCreated={() => {
          // The board is the only page that owns a task list, so it refreshes
          // itself through its own outlet context subscription.
          window.dispatchEvent(new Event('suprema:tasks-changed'));
        }}
      />
    </div>
  );
}
