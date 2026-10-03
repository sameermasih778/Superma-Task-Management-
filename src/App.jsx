import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
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
import RegisterPage from './pages/RegisterPage';

// Authenticated Dashboard Pages
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import TeamsPage from './pages/TeamsPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-dark-1 text-white selection:bg-white/20 selection:text-white">
      {!isDashboardRoute && <Navbar />}
      <div className="flex-grow">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<LoginPage />} />
          <Route path="/staff-portal" element={<LoginPage />} />
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
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="activity" element={<DashboardOverview />} />
            </Route>
          </Route>
        </Routes>
      </div>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}
