import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authApi';
import { Spinner, StateNotice, formControlClass, primaryButtonClass } from '../components/UiState';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err?.message || 'Could not send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden">
        <div className="pt-10 px-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 shadow-sm"><span className="material-symbols-outlined text-primary text-5xl">lock_reset</span></div>
          <h1 className="text-3xl font-black text-text-main tracking-tight">Forgot Password?</h1>
          <p className="text-text-secondary text-base mt-2 font-medium">No worries, we'll send reset instructions if the email exists.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          {error && <StateNotice tone="error">{error}</StateNotice>}
          {submitted && <StateNotice tone="success">We've sent password reset instructions if this email exists.</StateNotice>}
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-main ml-1">Email address</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className={`${formControlClass} h-12`} placeholder="Enter your email" />
          </div>
          <button type="submit" disabled={isLoading} className={`${primaryButtonClass} h-12 w-full`}>{isLoading && <Spinner />}{isLoading ? 'Loading...' : submitted ? 'Try again' : 'Submit'}</button>
          <div className="text-center"><Link to="/login" className="text-sm text-text-secondary hover:text-primary font-bold flex items-center justify-center gap-2 transition-colors"><span className="material-symbols-outlined text-base">arrow_back</span>Back to login</Link></div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
