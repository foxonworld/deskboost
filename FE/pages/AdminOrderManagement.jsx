
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiAdminGetOrders, apiAdminUpdateOrderStatus } from '../services/commerceApi';

const ALL_STATUSES = ['all', 'pending', 'paid', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'];

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'text-amber-600 bg-amber-50 border-amber-200', icon: 'schedule' },
  paid:       { label: 'Paid',       color: 'text-blue-600 bg-blue-50 border-blue-200', icon: 'payments' },
  processing: { label: 'Processing', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: 'autorenew' },
  shipping:   { label: 'On the Way', color: 'text-sky-600 bg-sky-50 border-sky-200', icon: 'local_shipping' },
  delivered:  { label: 'Delivered',  color: 'text-green-600 bg-green-50 border-green-200', icon: 'check_circle' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-600 bg-red-50 border-red-200', icon: 'cancel' },
  refunded:   { label: 'Refunded',   color: 'text-gray-600 bg-gray-50 border-gray-200', icon: 'currency_exchange' },
};

const STATS = [
  { label: 'Pending', key: 'pending', count: 12, icon: 'schedule', bg: 'bg-amber-50', text: 'text-amber-600' },
  { label: 'Processing', key: 'processing', count: 28, icon: 'autorenew', bg: 'bg-purple-50', text: 'text-purple-600' },
  { label: 'On the Way', key: 'shipping', count: 45, icon: 'local_shipping', bg: 'bg-sky-50', text: 'text-sky-600' },
  { label: 'Delivered Today', key: 'delivered', count: 18, icon: 'check_circle', bg: 'bg-green-50', text: 'text-green-600' },
];

const MOCK_ORDERS = [
  { id: 'GG-849201', customer: 'Alex Johnson', date: '2023-10-24', status: 'pending', total: 195.00, items: 3 },
  { id: 'GG-842155', customer: 'Sarah Bloom', date: '2023-09-12', status: 'processing', total: 45.00, items: 1 },
  { id: 'GG-839100', customer: 'Chris Green', date: '2023-08-20', status: 'shipping', total: 120.00, items: 2 },
  { id: 'GG-831045', customer: 'Emily White', date: '2023-08-10', status: 'delivered', total: 89.00, items: 2 },
  { id: 'GG-825890', customer: 'John Plant', date: '2023-07-22', status: 'cancelled', total: 67.00, items: 1 },
  { id: 'GG-819234', customer: 'Mia Leaf', date: '2023-07-01', status: 'paid', total: 244.00, items: 4 },
];

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadOrders = async (status = '') => {
    setLoading(true);
    try {
      const data = await apiAdminGetOrders(status === 'all' ? '' : status);
      setOrders(data?.orders || data || MOCK_ORDERS);
    } catch {
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(filterStatus); }, [filterStatus]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await apiAdminUpdateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      // In dev, just update locally
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o =>
    (filterStatus === 'all' || o.status === filterStatus) &&
    (o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     o.customer?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 font-display">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined text-white">potted_plant</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight dark:text-white">Green Garden</h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {[
            { icon: 'dashboard', label: 'Dashboard', to: '/app/admin' },
            { icon: 'inventory_2', label: 'Products', to: '/app/admin/plants' },
            { icon: 'shopping_cart', label: 'Orders', to: '/app/admin/orders', active: true },
            { icon: 'group', label: 'Customers', to: '/app/admin/users' },
            { icon: 'bar_chart', label: 'Analytics', to: '#' },
            { icon: 'settings', label: 'Settings', to: '/app/admin/settings' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl font-semibold transition-colors ${item.active ? 'bg-primary/10 text-primary font-bold' : 'text-text-secondary dark:text-slate-400 hover:bg-primary/5 hover:text-primary'}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm">AU</div>
            <div>
              <p className="font-bold text-sm dark:text-white">Admin User</p>
              <p className="text-xs text-text-secondary dark:text-slate-400">Store Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-text-main dark:text-white">Order Management</h2>
            <p className="text-sm text-text-secondary font-medium">Review and process all incoming greenhouse orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center text-text-secondary">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm">AU</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.key} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-text-secondary uppercase tracking-wider">{stat.label}</span>
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <span className={`material-symbols-outlined text-lg ${stat.text}`}>{stat.icon}</span>
                  </div>
                </div>
                <p className="text-3xl font-black dark:text-white">{stat.count}</p>
                <p className="text-xs text-text-secondary font-medium mt-1">Orders</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 relative min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID or customer..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-black capitalize transition-all ${filterStatus === s ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-gray-100 dark:bg-slate-800 text-text-secondary hover:bg-primary/10 hover:text-primary'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Order Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-3">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
                <span className="font-semibold text-text-secondary">Loading orders...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <span className="material-symbols-outlined text-text-secondary text-5xl">receipt_long</span>
                <p className="font-bold text-text-secondary">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-800">
                      {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-5 py-4 text-left text-xs font-black text-text-secondary uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {filtered.map((order) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-4 font-black text-primary">#{order.id}</td>
                          <td className="px-5 py-4 font-semibold text-text-main dark:text-white">{order.customer}</td>
                          <td className="px-5 py-4 text-text-secondary font-medium">
                            {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4 text-text-secondary font-medium">{order.items} items</td>
                          <td className="px-5 py-4 font-black text-text-main dark:text-white">${order.total?.toFixed(2)}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border ${cfg.color}`}>
                              <span className="material-symbols-outlined text-xs">{cfg.icon}</span>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <select
                                disabled={updatingId === order.id}
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                className="text-xs font-bold border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none disabled:opacity-50 cursor-pointer"
                              >
                                {ALL_STATUSES.filter(s => s !== 'all').map(s => (
                                  <option key={s} value={s}>{STATUS_CONFIG[s]?.label}</option>
                                ))}
                              </select>
                              {updatingId === order.id && (
                                <span className="material-symbols-outlined text-primary text-lg animate-spin">progress_activity</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderManagement;
