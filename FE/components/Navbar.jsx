
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-text-main dark:text-white">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">potted_plant</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Green Garden</h2>
        </Link>
        
        <nav className="flex items-center gap-4 md:gap-8">
          {!role ? (
            <>
              <Link to="/plants" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">Shop</Link>
              <Link to="/login" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">Login</Link>
            </>
          ) : (
            <>
              {role === 'admin' ? (
                <>
                  <Link to="/app/admin" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">Admin</Link>
                  <Link to="/app/admin/orders" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">Orders</Link>
                </>
              ) : (
                <>
                  <Link to="/app/dashboard" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
                  <Link to="/app/my-plants" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">My Plants</Link>
                  <Link to="/orders" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">My Orders</Link>
                  <Link to="/app/profile" className="text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">Profile</Link>
                </>
              )}
              <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">Logout</button>
            </>
          )}
          {/* Cart Button with live badge */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-dark transition-all shadow-sm shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
