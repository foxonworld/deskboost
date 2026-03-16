
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiGetMyOrders } from '../services/commerceApi';

const ORDER_STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20', icon: 'schedule' },
  paid:       { label: 'Paid',       color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20', icon: 'payments' },
  processing: { label: 'Processing', color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20', icon: 'autorenew' },
  shipping:   { label: 'On the Way', color: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20', icon: 'local_shipping' },
  delivered:  { label: 'Delivered',  color: 'text-green-600 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20', icon: 'check_circle' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20', icon: 'cancel' },
  refunded:   { label: 'Refunded',   color: 'text-gray-600 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700', icon: 'currency_exchange' },
};

const MOCK_ORDERS = [
  {
    id: 'GG-849201',
    date: '2023-10-24',
    status: 'delivered',
    total: 195.00,
    paymentMethod: 'Visa ending in 4242',
    items: [
      { name: 'Fiddle Leaf Fig (Large)', quantity: 1, price: 85 },
      { name: 'Monstera Deliciosa', quantity: 2, price: 55 },
    ],
  },
  {
    id: 'GG-842155',
    date: '2023-09-12',
    status: 'delivered',
    total: 45.00,
    paymentMethod: 'Apple Pay',
    items: [
      { name: 'Snake Plant Zeylanica', quantity: 1, price: 45 },
    ],
  },
  {
    id: 'GG-839100',
    date: '2023-08-20',
    status: 'delivered',
    total: 22.00,
    paymentMethod: 'Mastercard ending in 1121',
    items: [
      { name: 'Aloe Vera (Medium)', quantity: 1, price: 22 },
    ],
  },
];

const StatusBadge = ({ status }) => {
  const cfg = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG['pending'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${cfg.color}`}>
      <span className="material-symbols-outlined text-sm">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiGetMyOrders();
        setOrders(data?.orders || data || MOCK_ORDERS);
      } catch {
        setOrders(MOCK_ORDERS); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / perPage);
  const paginated = orders.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto px-4 md:px-10 py-10 w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-text-main dark:text-white">My Orders</h1>
          <p className="text-text-secondary font-medium mt-1">Manage and track your plant orders from Green Garden</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
            <p className="font-semibold text-text-secondary">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
            <p className="font-bold text-text-main dark:text-white">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary font-bold hover:underline">Retry</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-4xl">receipt_long</span>
            </div>
            <h2 className="text-2xl font-black text-text-main dark:text-white">No orders yet</h2>
            <Link to="/plants" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-primary-dark transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {paginated.map((order) => (
                <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  {/* Order Header */}
                  <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-primary text-lg">#{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-6 text-sm text-text-secondary font-medium">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">credit_card</span>
                        {order.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4 space-y-2">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-base">eco</span>
                          <span className="font-semibold text-text-main dark:text-white">{item.name}</span>
                          <span className="text-text-secondary">× {item.quantity}</span>
                        </div>
                        <span className="font-bold text-text-main dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-secondary font-medium">Order Total:</span>
                      <span className="font-black text-primary text-xl">${order.total?.toFixed(2)}</span>
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="flex items-center gap-2 text-sm font-black text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl border border-primary/30 hover:border-primary transition-all"
                    >
                      View Details
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 font-bold text-text-secondary hover:border-primary hover:text-primary transition-all disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="text-sm font-bold text-text-secondary">
                  Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, orders.length)} of {orders.length} orders
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 font-bold text-text-secondary hover:border-primary hover:text-primary transition-all disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer links */}
        <div className="flex items-center justify-center gap-8 mt-16 text-sm text-text-secondary font-medium">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
