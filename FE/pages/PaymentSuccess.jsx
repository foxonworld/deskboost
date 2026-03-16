
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('orderCode');
  const { lastOrder } = useCart();

  const items = lastOrder?.items || [];
  const total = lastOrder?.total || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-10 py-16 w-full">
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          {/* Success Icon */}
          <div className="relative">
            <div className="w-28 h-28 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center shadow-2xl shadow-green-200 dark:shadow-green-500/10">
              <span className="material-symbols-outlined text-green-500 text-6xl fill-1">check_circle</span>
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">eco</span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-text-main dark:text-white">Payment Successful!</h1>
            <p className="text-text-secondary font-medium text-lg">Your plants are being prepared for their new home 🌱</p>
          </div>
          {orderId && (
            <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              <span className="font-black text-primary">Order ID: #{orderId}</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-black text-text-main dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
            Order Summary
          </h2>
          {items.length > 0 ? (
            <div className="space-y-4 mb-6">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">eco</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-text-main dark:text-white">Plant #{item.plantId}</p>
                    <p className="text-sm text-text-secondary font-medium">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                <span className="font-black text-text-main dark:text-white text-lg">Total Paid</span>
                <span className="font-black text-primary text-2xl">${total.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl mb-6">
              <span className="material-symbols-outlined text-primary">eco</span>
              <p className="font-semibold text-text-secondary">Your order has been confirmed successfully.</p>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-100 dark:border-green-500/20">
            <span className="material-symbols-outlined text-green-500">local_shipping</span>
            <div>
              <p className="font-bold text-text-main dark:text-white text-sm">Estimated Delivery: Oct 24 – Oct 26</p>
              <p className="text-xs text-text-secondary font-medium">A confirmation email has been sent to your inbox.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined">receipt_long</span>
            View My Orders
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-text-main dark:text-white px-8 py-4 rounded-2xl font-bold hover:border-primary hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined">home</span>
            Back to Home
          </Link>
        </div>

        <p className="text-center text-xs text-text-secondary font-medium mt-8">
          Need help?{' '}
          <a href="mailto:support@greengardenapp.com" className="text-primary hover:underline font-bold">
            Contact Support
          </a>
        </p>
      </main>
    </div>
  );
};

export default PaymentSuccess;
