
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-sm border border-primary/5 flex flex-col items-center text-center">
          {/* Status Illustration/Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full text-primary">
              <span className="material-symbols-outlined text-6xl">error_outline</span>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-3 mb-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Payment Cancelled
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
              Your order has not been placed. You can try again from your cart or continue browsing our garden collection.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3">
            <Link to="/cart" className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-text-main text-base font-bold leading-normal tracking-wide hover:brightness-110 active:scale-95 transition-all">
              Return to Cart
            </Link>
            <button className="flex w-full items-center justify-center rounded-lg bg-primary/10 text-primary h-12 px-6 text-base font-bold leading-normal tracking-wide hover:bg-primary/20 transition-all border border-primary/10">
              Contact Support
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer Info */}
      <footer className="py-10 px-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
          Need help with your order? Our support team is available 24/7.
        </p>
      </footer>
    </div>
  );
};

export default PaymentCancelled;
