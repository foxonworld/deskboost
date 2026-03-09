
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('role', 'user');
    navigate('/app/dashboard');
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
            <input 
              required
              type="text" 
              className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm"
              placeholder="Sarah Jenkins"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main">Email address</label>
            <input 
              required
              type="email" 
              className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm"
              placeholder="sarah@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main">Password</label>
            <input 
              required
              type="password" 
              className="w-full rounded-lg border-gray-200 h-11 px-4 focus:ring-primary focus:border-primary text-sm"
              placeholder="Create a password"
            />
          </div>
          
          <div className="flex items-center gap-2 py-2">
            <input type="checkbox" required className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" id="terms" />
            <label htmlFor="terms" className="text-xs text-text-secondary">
              I agree to the <a href="#" className="text-primary font-bold">Terms of Service</a> and <a href="#" className="text-primary font-bold">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-primary/20"
          >
            Create Account
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">
              Already have an account? <Link to="/login" className="text-text-main font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
