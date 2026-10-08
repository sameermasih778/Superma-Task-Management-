import React from 'react';
import { useAuth } from '../context/AuthContext';
import MemberDashboard from '../components/dashboard/MemberDashboard';
import DeveloperDashboard from '../components/dashboard/DeveloperDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

/**
 * Chooses which dashboard a role sees.
 *
 * Previously admin and developer both received AdminDashboard, which meant the
 * "Administrative & Developer Portal" heading was shown verbatim to whichever
 * one signed in. They are now three genuinely distinct views:
 *
 *   member / viewer  ->  MemberDashboard     (indigo)   "what is mine"
 *   developer        ->  DeveloperDashboard  (emerald)  "board throughput + workload"
 *   admin            ->  AdminDashboard      (amber)    "platform health + governance"
 *   super_admin      ->  AdminDashboard      (amber)    same, but with delete rights
 *
 * The decision is driven purely by the role on the JWT - never by anything the
 * client can set - so it cannot be used to reach a higher view.
 */
export default function DashboardOverview() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'developer') return <DeveloperDashboard />;
  if (role === 'admin' || role === 'super_admin') return <AdminDashboard />;
  return <MemberDashboard />;
}