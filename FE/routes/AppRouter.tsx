
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
import AddPlantUser from '../pages/AddPlantUser';
import DiagnosisResult from '../pages/DiagnosisResult';
import UserProfile from '../pages/UserProfile';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUserList from '../pages/AdminUserList';
import AdminUserDetail from '../pages/AdminUserDetail';
import AdminPlantList from '../pages/AdminPlantList';
import AdminAddPlant from '../pages/AdminAddPlant';
import AdminEditPlant from '../pages/AdminEditPlant';
import AdminManageUserPlants from '../pages/AdminManageUserPlants';
import AdminDiagnosisLogs from '../pages/AdminDiagnosisLogs';
import AdminContentManagement from '../pages/AdminContentManagement';
import AdminSystemSettings from '../pages/AdminSystemSettings';

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
      <Route path="/app/add-plant" element={<AddPlantUser />} />
      <Route path="/app/diagnosis-result" element={<DiagnosisResult />} />
      <Route path="/app/profile" element={<UserProfile />} />

      {/* Admin Routes */}
      <Route path="/app/admin" element={<AdminDashboard />} />
      <Route path="/app/admin/users" element={<AdminUserList />} />
      <Route path="/app/admin/users/:id" element={<AdminUserDetail />} />
      <Route path="/app/admin/plants" element={<AdminPlantList />} />
      <Route path="/app/admin/plants/add" element={<AdminAddPlant />} />
      <Route path="/app/admin/plants/:id/edit" element={<AdminEditPlant />} />
      <Route path="/app/admin/user-plants" element={<AdminManageUserPlants />} />
      <Route path="/app/admin/diagnosis-logs" element={<AdminDiagnosisLogs />} />
      <Route path="/app/admin/content" element={<AdminContentManagement />} />
      <Route path="/app/admin/settings" element={<AdminSystemSettings />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
