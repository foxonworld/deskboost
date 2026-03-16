
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const ShoppingCart = () => {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex mb-8 gap-2 text-sm font-bold text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/plants" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-text-main font-black">Your Cart</span>
        </nav>

        <h1 className="text-4xl font-black tracking-tight text-text-main dark:text-white mb-2">Your Cart</h1>
        <p className="text-text-secondary font-medium mb-10">
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl">shopping_cart</span>
            </div>
            <h2 className="text-2xl font-black text-text-main dark:text-white">Your cart is empty</h2>
            <p className="text-text-secondary font-medium text-center max-w-sm">
              Looks like you haven't added any plants yet. Explore our collection!
            </p>
            <Link
              to="/plants"
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:-translate-y-0.5"
            >
              Browse Plants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-text-main dark:text-white text-lg leading-tight">{item.name}</h3>
                        <p className="text-sm text-text-secondary font-medium italic">{item.species}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-black text-text-main dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-black text-xl text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-5">
                <h2 className="text-xl font-black text-text-main dark:text-white">Order Summary</h2>
                <div className="space-y-3 text-sm font-semibold text-text-secondary">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-text-main dark:text-white font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-text-main dark:text-white font-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-100 dark:bg-slate-800" />
                  <div className="flex justify-between text-base">
                    <span className="font-black text-text-main dark:text-white">Total</span>
                    <span className="font-black text-primary text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/plants"
                  className="flex items-center justify-center gap-2 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="bg-primary/5 rounded-2xl p-5 space-y-3">
                {[
                  { icon: 'local_shipping', text: 'Free shipping on orders over $100' },
                  { icon: 'verified', text: 'All plants are health-guaranteed' },
                  { icon: 'lock', text: 'Secure encrypted checkout' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                    <span className="material-symbols-outlined text-primary text-lg">{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShoppingCart;
