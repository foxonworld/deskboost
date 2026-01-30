
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import PlantList from '../pages/PlantList';
import PlantDetail from '../pages/PlantDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import MyPlants from '../pages/MyPlants';
import PlantProfile from '../pages/PlantProfile';
import PlantAnalyze from '../pages/PlantAnalyze';
import AdminDashboard from '../pages/AdminDashboard';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/plants" element={<PlantList />} />
      <Route path="/plants/:plantId" element={<PlantDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* User Routes */}
      <Route path="/app/dashboard" element={<Dashboard />} />
      <Route path="/app/my-plants" element={<MyPlants />} />
      <Route path="/app/my-plants/:id/profile" element={<PlantProfile />} />
      <Route path="/app/my-plants/:id/analyze" element={<PlantAnalyze />} />

      {/* Admin Routes */}
      <Route path="/app/admin" element={<AdminDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
