
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden">
        <div className="pt-10 px-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 shadow-sm">
            <span className="material-symbols-outlined text-primary text-5xl">lock_reset</span>
          </div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">Forgot Password?</h1>
          <p className="text-text-secondary text-base mt-2 font-medium">No worries, we'll send you reset instructions.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main ml-1">Email address</label>
              <input 
                required
                type="email" 
                className="w-full rounded-xl border-gray-200 h-14 px-5 focus:ring-primary focus:border-primary font-medium text-text-main placeholder:text-text-secondary/50 transition-all"
                placeholder="Enter your email"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-black h-14 rounded-xl transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 active:translate-y-0"
            >
              Reset Password
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="p-8 pt-4 text-center space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-emerald-700 text-sm font-medium leading-relaxed">
              We've sent a password reset link to your email address. Please check your inbox.
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="w-full bg-primary hover:bg-primary-dark text-white font-black h-14 rounded-xl transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 active:translate-y-0"
            >
              Resend Link
            </button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2 transition-colors">
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
