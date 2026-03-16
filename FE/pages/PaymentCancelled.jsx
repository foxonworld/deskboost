
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto px-4 md:px-10 py-20 w-full flex flex-col items-center text-center gap-8">
        {/* Icon */}
        <div className="relative">
          <div className="w-28 h-28 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center shadow-2xl shadow-orange-100 dark:shadow-orange-500/10">
            <span className="material-symbols-outlined text-orange-500 text-6xl">cancel</span>
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">eco</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-text-main dark:text-white">Payment Cancelled</h1>
          <p className="text-text-secondary font-medium text-lg max-w-lg">
            Your order has not been placed. You can try again from your cart or continue browsing our garden collection.
          </p>
        </div>

        {/* Notice box */}
        <div className="w-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-2xl p-5 flex items-start gap-4 text-left">
          <span className="material-symbols-outlined text-orange-500 text-2xl flex-shrink-0">info</span>
          <div>
            <p className="font-bold text-text-main dark:text-white mb-1">No charges were made</p>
            <p className="text-sm text-text-secondary font-medium">
              Your cart items are still saved. You can return to checkout at any time. Our support team is available 24/7 if you need help.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined">refresh</span>
            Retry Payment
          </button>
          <Link
            to="/cart"
            className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-text-main dark:text-white px-6 py-4 rounded-2xl font-bold hover:border-primary hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Return to Cart
          </Link>
        </div>

        <Link to="/plants" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-lg">storefront</span>
          Continue browsing plants
        </Link>

        <p className="text-xs text-text-secondary font-medium">
          Need help with your order?{' '}
          <a href="mailto:support@greengardenapp.com" className="text-primary hover:underline font-bold">
            Our support team is available 24/7
          </a>
        </p>
      </main>
    </div>
  );
};

export default PaymentCancelled;
