import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MOCK_FINANCIALS, 
  FINANCIAL_CATEGORY_CONFIG, 
  formatVND, 
  MOCK_ORDERS
} from '../data/mockData';

const MENU_ITEMS = [
  { name: 'Dashboard Overview', icon: 'dashboard', path: '/app/admin' },
  { name: 'Shop Management', icon: 'storefront', path: '/app/admin/plants' },
  { name: 'Financial Management', icon: 'account_balance_wallet', path: '/app/admin/financials', active: true },
  { name: 'Manage User Plants', icon: 'potted_plant', path: '/app/admin/user-plants' },
  { name: 'User List', icon: 'group', path: '/app/admin/users' },
  { name: 'Manage Mail Messages', icon: 'mail', path: '/app/admin/messages' },
  { name: 'Order Management', icon: 'shopping_bag', path: '/app/admin/orders' },
];

const AdminFinancials = () => {
  const navigate = useNavigate();
  const [financials, setFinancials] = useState(MOCK_FINANCIALS);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'income' | 'expense'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  // Calculations
  const stats = useMemo(() => {
    const income = financials
      .filter(f => f.type === 'income')
      .reduce((sum, f) => sum + f.amount, 0);
    const expenses = financials
      .filter(f => f.type === 'expense')
      .reduce((sum, f) => sum + f.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      profit: income - expenses,
    };
  }, [financials]);

  const filteredFinancials = useMemo(() => {
    return financials
      .filter(f => {
        const matchesType = filterType === 'all' || f.type === filterType;
        const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
        const matchesSearch = f.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [financials, filterType, filterCategory, searchTerm]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const record = {
      id: `fin-manual-${Date.now()}`,
      type: newTransaction.type,
      amount: Number(newTransaction.amount),
      currency: 'VND',
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
      createdBy: 'admin',
    };
    setFinancials([record, ...financials]);
    setIsModalOpen(false);
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: 'other',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 font-display antialiased">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4CAF50] flex items-center justify-center text-white cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">potted_plant</span>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-slate-50 font-bold text-base leading-none">DeskBoost</h1>
            <p className="text-slate-500 text-xs font-medium mt-0.5">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <Link key={item.name} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                item.active
                  ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${item.active ? 'fill-1' : ''}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-4 pb-1 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</p>
          </div>
          <Link to="/app/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all">
            <span className="material-symbols-outlined">settings</span>Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-sm font-semibold transition-all text-left">
            <span className="material-symbols-outlined text-xl">logout</span>Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Quản lý Tài chính</h2>
            <p className="text-xs text-slate-500">Theo dõi doanh thu, chi phí và lợi nhuận</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4CAF50] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#4CAF50]/30 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Thêm giao dịch
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl text-[#4CAF50]">payments</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Tổng Thu nhập</p>
              <h3 className="text-3xl font-black text-[#4CAF50] mt-2">{formatVND(stats.totalIncome)}</h3>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-1 rounded-lg w-fit">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                +15% so với tháng trước
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl text-red-500">shopping_cart_checkout</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Tổng Chi phí</p>
              <h3 className="text-3xl font-black text-red-500 mt-2">{formatVND(stats.totalExpenses)}</h3>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-lg w-fit">
                <span className="material-symbols-outlined text-xs">info</span>
                Cần lưu ý chi phí nhập hàng
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl text-blue-500">account_balance</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Lợi nhuận ròng</p>
              <h3 className={`text-3xl font-black mt-2 ${stats.profit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                {formatVND(stats.profit)}
              </h3>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg w-fit">
                <span className="material-symbols-outlined text-xs">verified</span>
                Dòng tiền ổn định
              </div>
            </div>
          </div>

          {/* Filter Bar & Table */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Danh sách Giao dịch</h3>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black rounded-lg uppercase">
                  {filteredFinancials.length} bản ghi
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm giao dịch..."
                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]/20 transition-all w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select 
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]/20"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tất cả Loại</option>
                  <option value="income">Chỉ Thu nhập</option>
                  <option value="expense">Chỉ Chi phí</option>
                </select>

                <select 
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]/20"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">Tất cả Hạng mục</option>
                  {Object.entries(FINANCIAL_CATEGORY_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Hạng mục</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Loại</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {filteredFinancials.map((record) => {
                      const cat = FINANCIAL_CATEGORY_CONFIG[record.category];
                      return (
                        <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">
                            {record.date}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{record.description}</p>
                            {record.orderId && (
                              <Link to={`/app/admin/orders`} className="text-[10px] font-bold text-[#4CAF50] hover:underline uppercase">Đơn hàng #{record.orderId}</Link>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${cat.color}`}>
                              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                              {cat.label}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${record.type === 'income' ? 'text-green-600 bg-green-50 dark:bg-green-500/10' : 'text-red-500 bg-red-50 dark:bg-red-500/10'}`}>
                              {record.type === 'income' ? 'Thu nhập' : 'Chi phí'}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-right font-black text-base ${record.type === 'income' ? 'text-[#4CAF50]' : 'text-red-500'}`}>
                            {record.type === 'income' ? '+' : '-'}{formatVND(record.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredFinancials.length === 0 && (
                <div className="py-20 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-200">search_off</span>
                  <p className="text-slate-500 font-bold mt-4">Không tìm thấy giao dịch nào phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 overflow-hidden" style={{ animation: 'slideUp 0.3s ease' }}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-black text-slate-900 dark:text-white">Thêm Giao dịch mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Loại giao dịch</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                      className={`py-2.5 rounded-xl font-bold text-sm transition-all ${newTransaction.type === 'income' ? 'bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                    >
                      Thu nhập
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                      className={`py-2.5 rounded-xl font-bold text-sm transition-all ${newTransaction.type === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                    >
                      Chi phí
                    </button>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Số tiền (VNĐ)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#4CAF50]/20 font-bold"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    placeholder="vd: 500000"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Hạng mục</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#4CAF50]/20"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  >
                    {Object.entries(FINANCIAL_CATEGORY_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Mô tả</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#4CAF50]/20"
                    placeholder="Lý do chi/thu..."
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Ngày thực hiện</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#4CAF50]/20"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                 <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#4CAF50] text-white font-black rounded-xl hover:shadow-lg hover:shadow-[#4CAF50]/20 transition-all active:scale-95"
                >
                  Xác nhận lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminFinancials;
