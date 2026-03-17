
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
import AIPlantAnalysis from '../pages/AIPlantAnalysis';
import RemindersSettings from '../pages/RemindersSettings';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUserList from '../pages/AdminUserList';
import AdminUserDetail from '../pages/AdminUserDetail';
import AdminPlantList from '../pages/AdminPlantList';
import AdminAddPlant from '../pages/AdminAddPlant';
import AdminEditPlant from '../pages/AdminEditPlant';
import AdminManageUserPlants from '../pages/AdminManageUserPlants';
import AdminMailManagement from '../pages/AdminMailManagement';
import AdminFinancials from '../pages/AdminFinancials';

import AdminSystemSettings from '../pages/AdminSystemSettings';
// Commerce routes (imported from Stitch)
import ShoppingCart from '../pages/ShoppingCart';
import Checkout from '../pages/Checkout';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancelled from '../pages/PaymentCancelled';
import MyOrders from '../pages/MyOrders';
import OrderDetail from '../pages/OrderDetail';
import AdminOrderManagement from '../pages/AdminOrderManagement';

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

      {/* ── Commerce Routes (Green Garden Marketplace) ── */}
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancelled" element={<PaymentCancelled />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/orders/:orderId" element={<OrderDetail />} />

      {/* User Routes */}
      <Route path="/app/dashboard" element={<Dashboard />} />
      <Route path="/app/my-plants" element={<MyPlants />} />
      <Route path="/app/my-plants/:id/profile" element={<PlantProfile />} />
      <Route path="/app/my-plants/:id/analyze" element={<PlantAnalyze />} />
      <Route path="/app/add-plant" element={<AddPlantUser />} />
      <Route path="/app/diagnosis-result" element={<DiagnosisResult />} />
      <Route path="/app/profile" element={<UserProfile />} />
      <Route path="/app/ai-analysis" element={<AIPlantAnalysis />} />
      <Route path="/app/settings" element={<RemindersSettings />} />

      {/* Admin Routes */}
      <Route path="/app/admin" element={<AdminDashboard />} />
      <Route path="/app/admin/financials" element={<AdminFinancials />} />
      <Route path="/app/admin/users" element={<AdminUserList />} />
      <Route path="/app/admin/users/:id" element={<AdminUserDetail />} />
      <Route path="/app/admin/plants" element={<AdminPlantList />} />
      <Route path="/app/admin/plants/add" element={<AdminAddPlant />} />
      <Route path="/app/admin/plants/:id/edit" element={<AdminEditPlant />} />
      <Route path="/app/admin/user-plants" element={<AdminManageUserPlants />} />
      <Route path="/app/admin/messages" element={<AdminMailManagement />} />

      <Route path="/app/admin/settings" element={<AdminSystemSettings />} />
      <Route path="/app/admin/orders" element={<AdminOrderManagement />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
