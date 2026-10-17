import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import CreateTaskModal from './CreateTaskModal';
import usePublicNavOffset from '../../hooks/usePublicNavOffset';

export default function DashboardLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const mainRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  // Which project the new task should be filed under. The header button has no
  // project context, so it stays null and the modal lets the user pick.
  const [newTaskProjectId, setNewTaskProjectId] = useState(null);
  // The task being edited, when the modal was opened from a task row rather than
  // the header button. Lives here because the modal does.
  const [editingTask, setEditingTask] = useState(null);

  // Replaces the old hardcoded `pt-20 lg:pt-24`. Returns 0 on staff and member
  // dashboards now that the public Navbar is cleanly removed from /dashboard.
  const navOffset = usePublicNavOffset();

  // Reset scroll to top when opening another section
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

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

        <main ref={mainRef} className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: 16, filter: 'blur(6px)' }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, filter: 'blur(0px)' }
              }
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.16, ease: 'easeIn' } }
              }
              transition={
                reduce
                  ? { duration: 0.15 }
                  : {
                      duration: 0.36,
                      ease: [0.16, 1, 0.3, 1]
                    }
              }
              className="w-full"
            >
              <Outlet
                context={{
                  isNewTaskModalOpen,
                  setIsNewTaskModalOpen,
                  editingTask,
                  setEditingTask,
                  setNewTaskProjectId
                }}
              />
            </motion.div>
          </AnimatePresence>
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
