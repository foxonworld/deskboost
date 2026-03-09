
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (role) => {
    localStorage.setItem('role', role);
    if (role === 'admin') {
      navigate('/app/admin');
    } else {
      navigate('/app/dashboard');
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

        <div className="p-6 pt-2 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email address</label>
            <input 
              type="email" 
              className="w-full rounded-lg border-gray-200 h-12 px-4 focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" title="Mock Link" className="text-text-secondary hover:text-primary text-sm font-medium">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              className="w-full rounded-lg border-gray-200 h-12 px-4 focus:ring-primary focus:border-primary"
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            onClick={() => handleLogin('user')}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-primary/20"
          >
            Log In
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-xs text-text-secondary uppercase font-bold tracking-wider">Or demo as</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleLogin('user')}
              className="bg-gray-50 border border-gray-100 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">person</span> User
            </button>
            <button 
              onClick={() => handleLogin('admin')}
              className="bg-gray-50 border border-gray-100 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span> Admin
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-text-secondary">
              Don't have an account? <Link to="/register" className="text-text-main font-bold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
