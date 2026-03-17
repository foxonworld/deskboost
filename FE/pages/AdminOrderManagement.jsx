import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiAdminGetOrders, apiAdminUpdateOrderStatus } from '../services/commerceApi';

const ALL_STATUSES = ['all', 'pending', 'paid', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'];

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    bg: 'bg-amber-100 text-amber-700', icon: 'schedule' },
  paid:       { label: 'Paid',       bg: 'bg-blue-100 text-blue-700', icon: 'payments' },
  processing: { label: 'Processing', bg: 'bg-purple-100 text-purple-700', icon: 'autorenew' },
  shipping:   { label: 'Shipping',   bg: 'bg-sky-100 text-sky-700', icon: 'local_shipping' },
  delivered:  { label: 'Delivered',  bg: 'bg-green-100 text-green-700', icon: 'check_circle' },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-100 text-red-700', icon: 'cancel' },
  refunded:   { label: 'Refunded',   bg: 'bg-gray-100 text-gray-700', icon: 'currency_exchange' },
};

const MOCK_ORDERS = [
  { id: 'GG-849201', customer: 'Alex Johnson', date: 'Oct 24, 2023', status: 'pending', total: 195.00, items: 3 },
  { id: 'GG-842155', customer: 'Sarah Bloom', date: 'Sep 12, 2023', status: 'processing', total: 45.00, items: 1 },
  { id: 'GG-839100', customer: 'Chris Green', date: 'Aug 20, 2023', status: 'shipping', total: 120.00, items: 2 },
  { id: 'GG-831045', customer: 'Emily White', date: 'Aug 10, 2023', status: 'delivered', total: 89.00, items: 2 },
];

const AdminOrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard Overview', icon: 'dashboard', path: '/app/admin' },
    { name: 'Shop Management', icon: 'storefront', path: '/app/admin/plants' },
    { name: 'Financial Management', icon: 'account_balance_wallet', path: '/app/admin/financials' },
    { name: 'Manage User Plants', icon: 'potted_plant', path: '/app/admin/user-plants' },
    { name: 'User List', icon: 'group', path: '/app/admin/users' },
    { name: 'Manage Mail Messages', icon: 'mail', path: '/app/admin/messages' },
    { name: 'Order Management', icon: 'shopping_bag', path: '/app/admin/orders', active: true },
  ];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiAdminGetOrders(filterStatus === 'all' ? '' : filterStatus);
      setOrders(data?.orders || data || MOCK_ORDERS);
    } catch {
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [filterStatus]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await apiAdminUpdateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const filtered = orders.filter(o =>
    (filterStatus === 'all' || o.status === filterStatus) &&
    (o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     o.customer?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 font-display antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4CAF50] flex items-center justify-center text-white cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">potted_plant</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-slate-50 font-bold text-lg leading-none">DeskBoost</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-semibold ${
                item.active 
                  ? 'bg-[#4CAF50]/10 text-[#4CAF50]' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`material-symbols-outlined ${item.active ? 'fill-1' : ''}`}>{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <Link to="/app/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-semibold">Settings</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left">
            <span className="material-symbols-outlined font-normal">logout</span>
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header / Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Order Management</h2>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/plants" className="text-sm font-bold text-slate-500 hover:text-[#4CAF50] transition-colors">Shop</Link>
              <Link to="/cart" className="text-sm font-bold text-slate-500 hover:text-[#4CAF50] transition-colors">Cart</Link>
              <Link to="/app/admin" className="text-sm font-bold text-[#4CAF50] border-b-2 border-[#4CAF50] py-5">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold text-sm text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined text-[20px]">file_download</span>
              Export
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f6f8f8] dark:bg-[#10221f]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Orders</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-black">124</h3>
                  <span className="text-[#4CAF50] font-bold text-xs">+12%</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Revenue (MTD)</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-black">$42,850</h3>
                  <span className="text-[#4CAF50] font-bold text-xs">+5%</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Processing</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-black text-amber-500">28</h3>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Avg Value</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">$82.40</h3>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] outline-none transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 shadow-sm font-display text-sm"
                  placeholder="Filter by Order ID or Customer Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'processing', 'shipping'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all ${filterStatus === s ? 'bg-[#4CAF50] text-white' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#4CAF50]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-slate-900 dark:text-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-display">
                    {filtered.map((order) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-5 font-bold text-sm text-[#4CAF50]">#{order.id}</td>
                          <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">{order.customer}</td>
                          <td className="px-6 py-5 text-xs text-slate-500 font-medium">{order.date}</td>
                          <td className="px-6 py-5 text-sm font-black">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${cfg.bg}`}>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select 
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                className="text-[10px] font-bold border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-1 focus:ring-[#4CAF50]"
                              >
                                {ALL_STATUSES.filter(s => s !== 'all').map(s => (
                                  <option key={s} value={s}>{s.toUpperCase()}</option>
                                ))}
                              </select>
                              <button className="p-1.5 text-slate-400 hover:text-[#4CAF50] transition-colors"><span className="material-symbols-outlined text-sm">visibility</span></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                End of List • Load More
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderManagement;
