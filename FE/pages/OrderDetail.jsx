
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiGetOrderById } from '../services/commerceApi';

const STATUS_STEPS = ['pending', 'paid', 'processing', 'shipping', 'delivered'];

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    icon: 'schedule', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200' },
  paid:       { label: 'Paid',       icon: 'payments', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200' },
  processing: { label: 'Processing', icon: 'autorenew', color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200' },
  shipping:   { label: 'On the Way', icon: 'local_shipping', color: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 border-sky-200' },
  delivered:  { label: 'Delivered',  icon: 'check_circle', color: 'text-green-600 bg-green-50 dark:bg-green-500/10 border-green-200' },
  cancelled:  { label: 'Cancelled',  icon: 'cancel', color: 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-200' },
};

const MOCK_ORDER = {
  id: 'GG-849201',
  date: '2023-10-24',
  status: 'delivered',
  total: 195.00,
  paymentMethod: 'Visa ending in 4242',
  shippingAddress: '123 Garden Blvd, Ho Chi Minh City',
  items: [
    { name: 'Fiddle Leaf Fig (Large)', quantity: 1, price: 85, note: 'Ceramic Pot Included' },
    { name: 'Monstera Deliciosa', quantity: 2, price: 55, note: 'Large · Easy Care' },
  ],
  timeline: [
    { status: 'pending', date: '2023-10-21 09:00', note: 'Order placed' },
    { status: 'paid', date: '2023-10-21 09:05', note: 'Payment confirmed via Visa' },
    { status: 'processing', date: '2023-10-22 11:00', note: 'Plants being prepared' },
    { status: 'shipping', date: '2023-10-23 08:00', note: 'Out for delivery' },
    { status: 'delivered', date: '2023-10-24 14:30', note: 'Delivered successfully' },
  ],
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiGetOrderById(orderId);
        setOrder(data);
      } catch {
        setOrder({ ...MOCK_ORDER, id: orderId });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
        </main>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[order?.status] || STATUS_CONFIG['pending'];
  const stepIndex = STATUS_STEPS.indexOf(order?.status);
  const shipping = 15;
  const subtotal = order?.total ? order.total - shipping : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto px-4 md:px-10 py-10 w-full">
        {/* Back + Header */}
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-text-secondary hover:text-primary font-bold mb-6 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span> My Orders
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main dark:text-white">Order #{order?.id}</h1>
            <p className="text-text-secondary font-medium text-sm mt-1">
              Placed on {new Date(order?.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black border text-sm ${cfg.color}`}>
            <span className="material-symbols-outlined text-base">{cfg.icon}</span>
            {cfg.label}
          </span>
        </div>

        {/* Progress Tracker */}
        {order?.status !== 'cancelled' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-text-main dark:text-white mb-5">Order Progress</h2>
            <div className="flex items-center">
              {STATUS_STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= stepIndex ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-slate-800 text-text-secondary'}`}>
                      <span className="material-symbols-outlined text-sm">{STATUS_CONFIG[s]?.icon}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${i <= stepIndex ? 'text-primary' : 'text-text-secondary'}`}>
                      {STATUS_CONFIG[s]?.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 rounded-full mb-4 ${i < stepIndex ? 'bg-primary' : 'bg-gray-100 dark:bg-slate-800'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Items + Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 dark:border-slate-800">
                <h2 className="text-lg font-black text-text-main dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">eco</span>
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-slate-800">
                {(order?.items || []).map((item, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary">potted_plant</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-text-main dark:text-white">{item.name}</p>
                      <p className="text-sm text-text-secondary font-medium">{item.note}</p>
                      <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-lg text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {order?.timeline && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
                <h2 className="text-lg font-black text-text-main dark:text-white mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">timeline</span>
                  Order Timeline
                </h2>
                <div className="relative pl-8 space-y-6">
                  <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-slate-800" />
                  {order.timeline.map((event, i) => {
                    const ec = STATUS_CONFIG[event.status];
                    return (
                      <div key={i} className="relative flex items-start gap-4">
                        <div className={`absolute -left-8 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${i === order.timeline.length - 1 ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700'}`}>
                          <span className={`material-symbols-outlined text-xs ${i === order.timeline.length - 1 ? 'text-white' : 'text-text-secondary'}`}>{ec?.icon}</span>
                        </div>
                        <div>
                          <p className="font-black text-text-main dark:text-white text-sm">{event.note}</p>
                          <p className="text-xs text-text-secondary font-medium">{event.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary + Shipping */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-black text-text-main dark:text-white">Payment Summary</h2>
              <div className="space-y-2 text-sm font-semibold text-text-secondary">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-text-main dark:text-white">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-text-main dark:text-white">${shipping.toFixed(2)}</span></div>
                <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />
                <div className="flex justify-between text-base">
                  <span className="font-black text-text-main dark:text-white">Total Paid</span>
                  <span className="font-black text-primary text-xl">${order?.total?.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <span className="material-symbols-outlined text-text-secondary text-base">credit_card</span>
                <span className="text-sm font-semibold text-text-secondary">{order?.paymentMethod}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-3">
              <h2 className="text-lg font-black text-text-main dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">home</span>
                Shipping Address
              </h2>
              <p className="text-sm font-semibold text-text-secondary leading-relaxed">{order?.shippingAddress}</p>
            </div>

            <Link to="/orders" className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-text-secondary hover:border-primary hover:text-primary transition-all text-sm">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to All Orders
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
