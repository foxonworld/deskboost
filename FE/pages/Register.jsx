import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, isBootstrapping, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState('');

  const redirectTo = useMemo(() => {
    const fromPath = location.state?.from?.pathname;
    return fromPath && fromPath !== '/login' && fromPath !== '/register' ? fromPath : '/app/dashboard';
  }, [location.state]);

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, isBootstrapping, navigate, redirectTo]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim();
    const nextPassword = password.trim();
    clearError();
    setFormError('');

    if (!nextName || !nextEmail || !nextPassword) {
      setFormError('Please enter your name, email, and password.');
      return;
    }

    if (nextPassword.length < 6) {
      setFormError('Password should be at least 6 characters for your account safety.');
      return;
    }

    if (!acceptedTerms) {
      setFormError('Please accept the terms to create your account.');
      return;
    }

    try {
      await register({ name: nextName, email: nextEmail, password: nextPassword });
      navigate(redirectTo, { replace: true });
    } catch {
      // AuthContext owns friendly error state.
    }
  };

  const shownError = formError || error;
  const disabled = isLoading || isBootstrapping;

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="pt-8 px-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">potted_plant</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DeskBoost</h1>
          <h2 className="text-xl font-bold mt-4">Create an account</h2>
          <p className="text-text-secondary text-sm mt-1">Start your desk plant care workspace.</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 pt-2 space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-text-main">Full Name</label>
            <input id="name" required disabled={disabled} type="text" autoComplete="name" className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed" placeholder="Sarah Jenkins" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-text-main">Email address</label>
            <input id="email" required disabled={disabled} type="email" autoComplete="email" className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed" placeholder="sarah@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-text-main">Password</label>
            <input id="password" required disabled={disabled} type="password" autoComplete="new-password" className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex items-start gap-2 py-2">
            <input type="checkbox" required disabled={disabled} checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 disabled:opacity-60 disabled:cursor-not-allowed" id="terms" />
            <label htmlFor="terms" className="text-xs text-text-secondary leading-5">
              I agree to the <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Privacy Policy</span>
            </label>
          </div>

          {shownError && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 text-center font-semibold">{shownError}</p>}

          <button type="submit" disabled={disabled} className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
            {isLoading ? 'Creating account...' : isBootstrapping ? 'Restoring session...' : 'Create Account'}
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
