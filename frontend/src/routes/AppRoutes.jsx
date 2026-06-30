import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Search from '../pages/Search';
import DocumentDetails from '../pages/DocumentDetails';
import WizardPage from '../pages/WizardPage';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/documents/:id" element={<DocumentDetails />} />
          <Route path="/eligibility" element={<WizardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
