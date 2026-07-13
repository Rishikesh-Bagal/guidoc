import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import AdminRoute from '../components/Auth/AdminRoute';
import PageLoader from '../components/common/PageLoader';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy loaded pages
const Home = lazy(() => import('../pages/Home'));
const Search = lazy(() => import('../pages/Search'));
const DocumentDetails = lazy(() => import('../pages/DocumentDetails'));
const WizardPage = lazy(() => import('../pages/WizardPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const TrackerPage = lazy(() => import('../pages/TrackerPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const ScannerPage = lazy(() => import('../pages/ScannerPage'));
const VoiceAssistant = lazy(() => import('../pages/VoiceAssistant'));
const NotFound = lazy(() => import('../pages/NotFound'));
const OfficeLocatorPage = lazy(() => import('../pages/OfficeLocatorPage'));
const OfficeDetailsPage = lazy(() => import('../pages/OfficeDetailsPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const DocumentManager = lazy(() => import('../pages/admin/DocumentManager'));
const DocumentEditor = lazy(() => import('../pages/admin/DocumentEditor'));

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/documents/:id" element={<DocumentDetails />} />
              <Route path="/eligibility" element={<WizardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tracker" element={<TrackerPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/voice-assistant" element={<VoiceAssistant />} />
                <Route path="/office-locator" element={<OfficeLocatorPage />} />
                <Route path="/office/:id" element={<OfficeDetailsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/documents" element={<DocumentManager />} />
                <Route path="/admin/documents/new" element={<DocumentEditor />} />
                <Route path="/admin/documents/edit/:id" element={<DocumentEditor />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}
