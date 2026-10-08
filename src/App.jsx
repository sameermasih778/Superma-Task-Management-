import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/toast/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MemberRoute from './components/MemberRoute';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';

// Public Marketing Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import ChangelogPage from './pages/ChangelogPage';
import WaitlistPage from './pages/WaitlistPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Authenticated Dashboard Pages
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import TeamsPage from './pages/TeamsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ActivityPage from './pages/ActivityPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAdminLoginRoute = location.pathname.startsWith('/admin-login') || location.pathname.startsWith('/staff-portal');

  // Check if current user is Admin or Developer based on actual role
  const isStaffOrAdmin = ['super_admin', 'admin', 'developer'].includes(user?.role);

  // Navbar Rendering Rules:
  // 1. On Admin Login page (/admin-login, /staff-portal): render <AdminNavbar />
  // 2. On /dashboard:
  //    - If Admin/Developer (isStaffOrAdmin): REMOVE navbar completely
  //    - If Simple User: render <Navbar />
  // 3. On all other public pages: render <Navbar />
  const renderNavbar = () => {
    if (isAdminLoginRoute) {
      return <AdminNavbar />;
    }
    if (isDashboardRoute) {
      if (isStaffOrAdmin) {
        return null;
      }
      return <Navbar />;
    }
    return <Navbar />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-1 text-white selection:bg-white/20 selection:text-white">
      {renderNavbar()}
      <div className="flex-grow">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/staff-portal" element={<AdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              {/* Profile is member-only: staff use a fixed role emblem */}
              <Route element={<MemberRoute />}>
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route element={<AdminRoute />}>
                <Route path="users" element={<AdminUsersPage />} />
              </Route>
              <Route path="activity" element={<ActivityPage />} />
            </Route>
          </Route>
        </Routes>
      </div>
      {!isDashboardRoute && !isAdminLoginRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    // ToastProvider sits outside AuthProvider and Router so a toast can be
    // raised from anywhere - including auth failures and the 404 page.
    <ToastProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <MainLayout />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
