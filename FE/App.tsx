import React from "react";
import { HashRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import FloatingHomeButton from "./components/FloatingHomeButton";
import ThemeToggle from "./components/ThemeToggle";
import { CareProvider } from "./context/CareContext";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <CareProvider>
          <div className="min-h-screen flex flex-col transition-colors duration-300">
            <FloatingHomeButton />
            <ThemeToggle />
            <AppRouter />
          </div>
        </CareProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
