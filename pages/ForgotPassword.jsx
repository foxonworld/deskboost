
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="pt-8 px-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">lock_reset</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Forgot Password?</h1>
          <p className="text-text-secondary text-sm mt-1">No worries, we'll send you reset instructions.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <input 
                required
                type="email" 
                className="w-full rounded-lg border-gray-200 h-12 px-4 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-text-main font-bold h-12 rounded-lg transition-all"
            >
              Reset Password
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="p-6 pt-2 text-center space-y-6">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-green-700 text-sm">
              We've sent a password reset link to your email address.
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="w-full bg-primary hover:bg-primary-dark text-text-main font-bold h-12 rounded-lg transition-all"
            >
              Resend Link
            </button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
