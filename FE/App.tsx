import React from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import FloatingHomeButton from "./components/FloatingHomeButton";
import ThemeToggle from "./components/ThemeToggle";
import LanguageToggle from "./components/LanguageToggle";
import { CareProvider } from "./context/CareContext";
import { AuthProvider } from "./context/AuthContext";
import { I18nProvider } from "./i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App: React.FC = () => {
  const Router =
    import.meta.env.VITE_ROUTER_MODE === "hash" ? HashRouter : BrowserRouter;

  return (
    <Router>
      <GoogleOAuthProvider
        clientId={
          import.meta.env.VITE_GOOGLE_CLIENT_ID || "fake-google-client-id"
        }
      >
        <I18nProvider>
          <AuthProvider>
            <CareProvider>
              <div className="min-h-screen flex flex-col transition-colors duration-300">
                <FloatingHomeButton />
                <ThemeToggle />
                <LanguageToggle />
                <AppRouter />
              </div>
            </CareProvider>
          </AuthProvider>
        </I18nProvider>
      </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
