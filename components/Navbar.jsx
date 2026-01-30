
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f4f2] bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-text-main">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">potted_plant</span>
          </div>
          <h2 className="text-lg font-bold">DeskBoost</h2>
        </Link>
        
        <nav className="flex items-center gap-4 md:gap-8">
          {!role ? (
            <>
              <Link to="/plants" className="text-sm font-medium hover:text-primary">Shop</Link>
              <Link to="/login" className="text-sm font-medium hover:text-primary">Login</Link>
            </>
          ) : (
            <>
              {role === 'admin' ? (
                <Link to="/app/admin" className="text-sm font-medium hover:text-primary">Admin</Link>
              ) : (
                <>
                  <Link to="/app/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
                  <Link to="/app/my-plants" className="text-sm font-medium hover:text-primary">My Plants</Link>
                </>
              )}
              <button onClick={handleLogout} className="text-sm font-medium hover:text-red-500 transition-colors">Logout</button>
            </>
          )}
          <button className="flex items-center gap-2 bg-primary text-text-main text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            <span className="hidden sm:inline">Cart</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
