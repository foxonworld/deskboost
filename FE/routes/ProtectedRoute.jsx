import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
        <span className="material-symbols-outlined animate-pulse text-3xl text-primary">potted_plant</span>
      </div>
      <p className="font-bold text-text-main">Restoring your session...</p>
      <p className="mt-1 text-sm text-text-secondary">Please wait while DeskBoost gets your workspace ready.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isBootstrapping, isLoading } = useAuth();
  const location = useLocation();

  if (isBootstrapping || (isLoading && isAuthenticated)) return <AuthLoading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
