import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo = location.state?.from?.pathname || '/app/dashboard';

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await register({ name, email, password });
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
          <h2 className="text-xl font-bold mt-4">Create an account</h2>
          <p className="text-text-secondary text-sm mt-1">Join our community of desk plant lovers.</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 pt-2 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main">Full Name</label>
            <input required disabled={isLoading} type="text" className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm disabled:opacity-60" placeholder="Sarah Jenkins" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main">Email address</label>
            <input required disabled={isLoading} type="email" className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm disabled:opacity-60" placeholder="sarah@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main">Password</label>
            <input required disabled={isLoading} type="password" className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm disabled:opacity-60" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input type="checkbox" required disabled={isLoading} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 disabled:opacity-60" id="terms" />
            <label htmlFor="terms" className="text-xs text-text-secondary">
              I agree to the <a href="#" className="text-primary font-bold">Terms of Service</a> and <a href="#" className="text-primary font-bold">Privacy Policy</a>
            </label>
          </div>

          {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-60">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">
              Already have an account? <Link to="/login" state={location.state} className="text-text-main font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
