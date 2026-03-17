import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CareNotificationBell from './CareNotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const { totalItems } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f4f2] dark:border-[#1e3a29] bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-text-main dark:text-white">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">potted_plant</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">DeskBoost</h2>
        </Link>
        
        <nav className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1.5 text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">home</span>
              <span>Home</span>
            </Link>
            <Link to="/plants" className="flex items-center gap-1.5 text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">local_florist</span>
              <span>Shop</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Care Notification Bell — only for logged-in non-admin users */}
            {role && role !== 'admin' && (
              <CareNotificationBell />
            )}

            {!role ? (
              <Link to="/login" className="flex items-center gap-2 rounded-lg h-10 px-4 bg-primary text-text-main text-sm font-bold shadow-sm hover:bg-primary/90 transition-all">
                <span className="material-symbols-outlined text-lg">account_circle</span>
                <span>Login</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                {role === 'admin' ? (
                  <Link to="/app/admin" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">Admin Panel</Link>
                ) : (
                  <Link to="/app/profile" className="hidden sm:block text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">Profile</Link>
                )}
                <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors hidden sm:block">Logout</button>
                <Link to="/app/profile" className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-colors">
                  <span className="material-symbols-outlined text-primary">person</span>
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-primary/10 text-primary rounded-lg h-10 px-4 text-sm font-bold hover:bg-primary/20 transition-all border border-primary/10"
            >
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
