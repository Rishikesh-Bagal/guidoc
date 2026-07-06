import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import Home from '../pages/Home';
import Search from '../pages/Search';
import DocumentDetails from '../pages/DocumentDetails';
import WizardPage from '../pages/WizardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TrackerPage from '../pages/TrackerPage';
import ProfilePage from '../pages/ProfilePage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import AdminRoute from '../components/Auth/AdminRoute';

import AdminDashboard from '../pages/admin/AdminDashboard';
import DocumentManager from '../pages/admin/DocumentManager';
import DocumentEditor from '../pages/admin/DocumentEditor';

export default function AppRoutes() {
  return (
    <Router>
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
          </Route>
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
    </Router>
  );
}
