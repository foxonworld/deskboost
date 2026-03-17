
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiGetOrderById } from '../services/commerceApi';
import { ORDER_STATUS_CONFIG, ORDER_STATUS_STEPS, MOCK_ORDERS, formatVND } from '../data/mockData';



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
        // Fall back to central mock data
        const found = MOCK_ORDERS.find(o => o.id === orderId);
        setOrder(found || { ...MOCK_ORDERS[0], id: orderId });
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

  const cfg = ORDER_STATUS_CONFIG[order?.status] || ORDER_STATUS_CONFIG['pending'];
  const stepIndex = ORDER_STATUS_STEPS.indexOf(order?.status);

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
              {ORDER_STATUS_STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= stepIndex ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-slate-800 text-text-secondary'}`}>
                      <span className="material-symbols-outlined text-sm">{ORDER_STATUS_CONFIG[s]?.icon}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${i <= stepIndex ? 'text-primary' : 'text-text-secondary'}`}>
                      {ORDER_STATUS_CONFIG[s]?.label}
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
                    <span className="font-black text-lg text-primary">{formatVND(item.unitPrice * item.quantity)}</span>
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
                  <div className="flex justify-between"><span>Tạm tính</span><span className="text-text-main dark:text-white">{formatVND(order?.subtotal ?? 0)}</span></div>
                  <div className="flex justify-between"><span>Vận chuyển</span><span className="text-text-main dark:text-white">{formatVND(order?.shippingFee ?? 0)}</span></div>
                  <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />
                  <div className="flex justify-between text-base">
                    <span className="font-black text-text-main dark:text-white">Tổng cộng</span>
                    <span className="font-black text-primary text-xl">{formatVND(order?.total ?? 0)}</span>
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
