import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/toast/ToastProvider';
import { AnimatePresence, motion } from 'framer-motion';
import SmoothScroll from './components/SmoothScroll';
import { EASE, DURATION } from './lib/motion';
import { scrollToTop } from './lib/smoothScroll';
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
import NotFoundPage from './pages/NotFoundPage';
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
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLeadsPage from './pages/AdminLeadsPage';
import AdminChangelogPage from './pages/AdminChangelogPage';
import AdminBlogPage from './pages/AdminBlogPage';
import AdminOverviewPage from './pages/AdminOverviewPage';
import ActivityPage from './pages/ActivityPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';

/**
 * Scrolls to the top whenever the route changes.
 *
 * This is deliberately keyed on the pathname rather than hooked to the page
 * transition's exit animation. With `AnimatePresence mode="wait"` the outgoing
 * page stays mounted until its exit finishes, so resetting from inside the
 * incoming page would leave the new page scrolled to wherever the previous one
 * was if the animation were ever interrupted. Resetting here is deterministic.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop({ immediate: true });
  }, [pathname]);

  return null;
}

/** Stable AnimatePresence key for the whole dashboard shell. */
const DASHBOARD_ROUTE_KEY = '__dashboard';

function MainLayout() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAdminLoginRoute = location.pathname.startsWith('/admin-login') || location.pathname.startsWith('/staff-portal');

  // Page transitions: public pages cross-fade. The dashboard uses a stable key
  // so AnimatePresence never remounts its layout (sidebar, header, open modals)
  // when moving between dashboard tabs.
  const routeTransitionKey = isDashboardRoute ? DASHBOARD_ROUTE_KEY : location.pathname;
  const routeTransition = isDashboardRoute
    ? { initial: false, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.out } },
        exit: { opacity: 0, y: -8, transition: { duration: DURATION.instant, ease: EASE.out } },
      };

  // Check if current user is Admin or Developer based on actual role
  const isStaffOrAdmin = ['super_admin', 'admin', 'developer'].includes(user?.role);

  // Navbar Rendering Rules:
  // 1. On Admin Login page (/admin-login, /staff-portal): render <AdminNavbar />
  // 2. On /dashboard: REMOVE navbar completely (for all users: admin, developer, and simple user)
  // 3. On all other public pages: render <Navbar />
  const renderNavbar = () => {
    if (isAdminLoginRoute) {
      return <AdminNavbar />;
    }
    if (isDashboardRoute) {
      return null;
    }
    return <Navbar />;
  };

  // `initial={false}` must be scoped to the route wrapper below, never to
  // <AnimatePresence>. AnimatePresence publishes its `initial` through
  // PresenceContext to every descendant motion component that does not declare
  // its own `initial`; those descendants then skip their mount animation and
  // snap straight to their `animate` target. For `repeat: Infinity` keyframe
  // animations (the logo marquee and the ambient orbs) that target is the LAST
  // keyframe, so the animation never plays at all. Suppressing only the
  // wrapper's own first-load fade keeps every child animation intact.
  const isInitialMount = useRef(true);
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // Stable for the very first render only, so the initial page load does not
  // fade the whole page in. Reading it during render is intentional.
  // oxlint-disable-next-line react/refs
  const skipEnterAnimation = isInitialMount.current;

  return (
    <div className="min-h-screen flex flex-col bg-dark-1 text-white selection:bg-white/20 selection:text-white">
      {renderNavbar()}
      {!isDashboardRoute && !isAdminLoginRoute && <SmoothScroll />}
      <AnimatePresence mode="wait">
        <motion.div
          key={routeTransitionKey}
          className="flex-grow"
          {...routeTransition}
          initial={skipEnterAnimation ? false : routeTransition.initial}
        >
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/staff-portal" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Catch-all: any URL that matches no real page renders the 404 screen
                (inside the normal Navbar + Footer). Also serves the footer's /404 link. */}
            <Route path="*" element={<NotFoundPage />} />

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
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="teams" element={<TeamsPage />} />
                <Route element={<AdminRoute />}>
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="leads" element={<AdminLeadsPage />} />
                  <Route path="changelog-admin" element={<AdminChangelogPage />} />
                  <Route path="blog-admin" element={<AdminBlogPage />} />
                  <Route path="platform-overview" element={<AdminOverviewPage />} />
                  {/* Activity feed is a staff-only audit trail; the API enforces
                      this, so the route guard gives members a clear message
                      instead of an empty shell that logs a 403. */}
                  <Route path="activity" element={<ActivityPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
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
