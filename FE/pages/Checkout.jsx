
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { apiCreatePayment } from '../services/commerceApi';

const Checkout = () => {
  const { items, subtotal, clearCart, setLastOrder } = useCart();
  const navigate = useNavigate();
  const shipping = 15;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayNow = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city) {
      setError('Please fill in all required shipping fields.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        shippingInfo: form,
        items: items.map((i) => ({ plantId: i.id, quantity: i.quantity, price: i.price })),
        total,
      };
      const data = await apiCreatePayment(payload);
      if (data?.checkoutUrl) {
        setLastOrder({ ...payload, orderId: data.orderId });
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        setError('Could not create payment session. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Payment creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center gap-6 p-10">
          <span className="material-symbols-outlined text-6xl text-primary">shopping_cart</span>
          <h2 className="text-2xl font-black text-text-main dark:text-white">Your cart is empty</h2>
          <Link to="/cart" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-primary-dark transition-all">
            Back to Cart
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex mb-8 gap-2 text-sm font-bold text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-text-main font-black">Checkout</span>
        </nav>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {['Cart', 'Checkout', 'Payment'].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-2 text-sm font-bold ${i <= 1 ? 'text-primary' : 'text-text-secondary'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i <= 1 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-text-secondary'}`}>
                  {i + 1}
                </div>
                {step}
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${i < 1 ? 'bg-primary' : 'bg-gray-100 dark:bg-slate-800'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-5">
              <h2 className="text-xl font-black text-text-main dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'fullName', label: 'Full Name *', placeholder: 'Alex Johnson', span: true },
                  { name: 'email', label: 'Email Address *', placeholder: 'alex@example.com' },
                  { name: 'phone', label: 'Phone Number *', placeholder: '+84 xxx xxx xxx' },
                  { name: 'address', label: 'Street Address *', placeholder: '123 Garden Blvd', span: true },
                  { name: 'city', label: 'City *', placeholder: 'Ho Chi Minh City' },
                  { name: 'note', label: 'Delivery Note', placeholder: 'Leave at the door...' },
                ].map((f) => (
                  <div key={f.name} className={f.span ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-black text-text-secondary uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-text-main dark:text-white font-medium text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <h2 className="text-xl font-black text-text-main dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Payment Method
              </h2>
              <div className="flex items-start gap-4 p-4 bg-primary/5 border-2 border-primary/30 rounded-2xl">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-xl">qr_code</span>
                </div>
                <div>
                  <p className="font-black text-text-main dark:text-white">PayOS – Bank Transfer / QR Code</p>
                  <p className="text-sm text-text-secondary font-medium mt-1">
                    You will be redirected to PayOS to complete your payment securely via QR code or bank transfer.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 font-semibold text-sm">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-5">
              <h2 className="text-xl font-black text-text-main dark:text-white">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-main dark:text-white text-sm truncate">{item.name}</p>
                      <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-text-main dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-gray-100 dark:bg-slate-800" />
              <div className="space-y-2 text-sm font-semibold text-text-secondary">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-text-main dark:text-white">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-text-main dark:text-white">${shipping.toFixed(2)}</span></div>
                <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />
                <div className="flex justify-between text-base">
                  <span className="font-black text-text-main dark:text-white">Total</span>
                  <span className="font-black text-primary text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handlePayNow}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">lock</span>
                    Pay Now – ${total.toFixed(2)}
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-text-secondary font-medium">
                <span className="material-symbols-outlined text-sm">lock</span>
                Secure Encrypted Checkout
              </div>
            </div>
            <div className="bg-primary/5 rounded-2xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">eco</span>
              <p className="text-xs text-text-secondary font-medium">
                <span className="font-bold text-text-main dark:text-white">Plant Care Guide Included.</span> Every order comes with a digital care guide to help your new plants thrive.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
