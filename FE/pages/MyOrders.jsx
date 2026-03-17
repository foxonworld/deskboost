import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { apiGetMyOrders } from '../services/commerceApi';
import { MOCK_ORDERS, ORDER_STATUS_CONFIG, formatVND } from '../data/mockData';



const StatusBadge = ({ status }) => {
  const cfg = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG['pending'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.color}`}>
      <span className="material-symbols-outlined text-xs">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiGetMyOrders();
        setOrders(data?.orders || data || MOCK_ORDERS);
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / perPage);
  const paginated = orders.slice((page - 1) * perPage, page * perPage);

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto p-8 flex flex-col gap-10 pb-20">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black tracking-tight uppercase">Order History</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Manage and track your plant acquisitions from DeskBoost.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Refine Search</label>
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-[#4CAF50] transition-colors">search</span>
              <input className="w-full h-14 pl-12 pr-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] outline-none transition-all text-sm font-bold" placeholder="Reference ID..." />
            </div>
          </div>
          <div className="w-full lg:w-56">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Timeframe</label>
            <select className="w-full h-14 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-[#4CAF50]/10 focus:border-[#4CAF50] outline-none text-sm font-bold cursor-pointer">
              <option>Last Quarter</option>
              <option>Previous 6 Months</option>
              <option>Genesis (All Time)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="size-12 border-4 border-[#4CAF50]/20 border-t-[#4CAF50] rounded-full animate-spin"></div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Logs...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {paginated.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-50 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                {/* Card Header */}
                <div className="bg-slate-50/30 dark:bg-slate-800/20 px-8 py-6 flex flex-wrap justify-between items-center gap-6 border-b border-slate-50 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">ID Ref</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white font-mono">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Executed</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Security State</p>
                       <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="material-symbols-outlined text-[#4CAF50] text-lg">verified_user</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{order.paymentMethod}</p>
                  </div>
                </div>
                {/* Items */}
                <div className="p-8">
                  <div className="flex flex-col gap-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-6 group">
                        <div className="size-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#4CAF50] group-hover:scale-105 transition-transform">
                           <span className="material-symbols-outlined text-4xl">potted_plant</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-slate-900 dark:text-white">{item.name}</h4>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Batch Unit: {item.quantity}</p>
                        </div>
                         <p className="text-xl font-black text-slate-900 dark:text-white capitalize">{formatVND(item.unitPrice * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Aggregate Total:</span>
                   <span className="text-3xl font-black text-[#4CAF50]">{formatVND(order.total)}</span>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Link to={`/orders/${order.id}`} className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all text-center">
                      Full Logs
                    </Link>
                    <button className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl bg-[#4CAF50] text-white font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4CAF50]/20 transition-all">
                      Track Shipment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-black text-xs uppercase tracking-widest text-slate-500 hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all disabled:opacity-30"
            >
              Back
            </button>
            <div className="flex gap-2">
               {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i + 1)}
                    className={`size-10 rounded-xl font-black text-xs transition-all ${page === i + 1 ? 'bg-[#4CAF50] text-white' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400'}`}
                  >
                    {i + 1}
                  </button>
               ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-black text-xs uppercase tracking-widest text-slate-500 hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default MyOrders;
