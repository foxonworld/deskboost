import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo = location.state?.from?.pathname || '/app/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch {
      // AuthContext owns friendly error state.
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="pt-8 px-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">potted_plant</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DeskBoost</h1>
          <h2 className="text-xl font-bold mt-4">Welcome back</h2>
          <p className="text-text-secondary text-sm mt-1">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 pt-2 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email address</label>
            <input required disabled={isLoading} type="email" className="w-full rounded-lg border-gray-200 h-12 px-4 focus:ring-primary focus:border-primary disabled:opacity-60" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-text-secondary hover:text-primary text-sm font-medium">Forgot Password?</Link>
            </div>
            <input required disabled={isLoading} type="password" className="w-full rounded-lg border-gray-200 h-12 px-4 focus:ring-primary focus:border-primary disabled:opacity-60" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-60">
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">Don't have an account? <Link to="/register" state={location.state} className="text-text-main font-bold hover:underline">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
