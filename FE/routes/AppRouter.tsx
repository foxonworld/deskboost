import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import PlantList from "../pages/PlantList";
import PlantDetail from "../pages/PlantDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import MyPlants from "../pages/MyPlants";
import PlantProfile from "../pages/PlantProfile";
import AddPlantUser from "../pages/AddPlantUser";
import UserProfile from "../pages/UserProfile";
import AIPlantAnalysis from "../pages/AIPlantAnalysis";
import AIChat from "../pages/AIChat";
import RemindersSettings from "../pages/RemindersSettings";
import Forbidden from "../pages/Forbidden";
import AdminOverview from "../pages/admin/AdminOverview";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminPlants from "../pages/admin/AdminPlants";
import AdminPlantInventory from "../pages/admin/AdminPlantInventory";
import AdminMarketplace from "../pages/admin/AdminMarketplace";
import AdminFeedback from "../pages/admin/AdminFeedback";
import AdminAI from "../pages/admin/AdminAI";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const protect = (element: React.ReactNode) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

const admin = (element: React.ReactNode) => <AdminRoute>{element}</AdminRoute>;

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

      <Route path="/forbidden" element={<Forbidden />} />

      {/* User Routes */}
      <Route path="/app/dashboard" element={protect(<Dashboard />)} />
      <Route path="/app/my-plants" element={protect(<MyPlants />)} />
      <Route
        path="/app/my-plants/:id/profile"
        element={protect(<PlantProfile />)}
      />
      <Route path="/app/add-plant" element={protect(<AddPlantUser />)} />
      <Route path="/app/profile" element={protect(<UserProfile />)} />
      <Route path="/app/ai-analysis" element={protect(<AIPlantAnalysis />)} />
      <Route path="/app/ai-chat" element={protect(<AIChat />)} />
      <Route path="/app/settings" element={protect(<RemindersSettings />)} />

      {/* Lightweight Admin Routes */}
      <Route path="/admin" element={admin(<AdminOverview />)} />
      <Route path="/admin/overview" element={admin(<AdminOverview />)} />
      <Route path="/admin/users" element={admin(<AdminUsers />)} />
      <Route path="/admin/plants" element={admin(<AdminPlants />)} />
      <Route path="/admin/plant-inventory" element={admin(<AdminPlantInventory />)} />
      <Route path="/admin/marketplace" element={admin(<AdminMarketplace />)} />
      <Route path="/admin/feedback" element={admin(<AdminFeedback />)} />
      <Route path="/admin/ai" element={admin(<AdminAI />)} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
