import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Forbidden from "../pages/Forbidden";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import { useI18n } from "../i18n";

const PlantList = lazy(() => import("../pages/PlantList"));
const PlantDetail = lazy(() => import("../pages/PlantDetail"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const MyPlants = lazy(() => import("../pages/MyPlants"));
const PlantProfile = lazy(() => import("../pages/PlantProfile"));
const AddPlantUser = lazy(() => import("../pages/AddPlantUser"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const AIPlantAnalysis = lazy(() => import("../pages/AIPlantAnalysis"));
const AIChat = lazy(() => import("../pages/AIChat"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const AccountDeletion = lazy(() => import("../pages/AccountDeletion"));
const RemindersSettings = lazy(() => import("../pages/RemindersSettings"));
const AdminOverview = lazy(() => import("../pages/admin/AdminOverview"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminPlants = lazy(() => import("../pages/admin/AdminPlants"));
const AdminPlantInventory = lazy(() => import("../pages/admin/AdminPlantInventory"));
const AdminMarketplace = lazy(() => import("../pages/admin/AdminMarketplace"));
const AdminFeedback = lazy(() => import("../pages/admin/AdminFeedback"));
const AdminAI = lazy(() => import("../pages/admin/AdminAI"));
const AdminNotifications = lazy(() => import("../pages/admin/AdminNotifications"));
const AdminReminderOperations = lazy(() => import("../pages/admin/AdminReminderOperations"));
const AdminEmailOperations = lazy(() => import("../pages/admin/AdminEmailOperations"));

const RouteFallback = () => {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
      {t("route.loading")}
    </div>
  );
};

const protect = (element: React.ReactNode) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

const admin = (element: React.ReactNode) => <AdminRoute>{element}</AdminRoute>;

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<PlantList />} />
        <Route path="/plants/:plantId" element={<PlantDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/account-deletion" element={<AccountDeletion />} />

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
        <Route path="/admin/notifications" element={admin(<AdminNotifications />)} />
        <Route path="/admin/reminder-operations" element={admin(<AdminReminderOperations />)} />
        <Route path="/admin/email-operations" element={admin(<AdminEmailOperations />)} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
