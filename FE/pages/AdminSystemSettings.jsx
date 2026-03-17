import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminSystemSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('AI Management');

  // Hardcoded AI Usage stats for demonstration
  const aiStats = {
    totalTokens: 1000000,
    usedTokens: 642380,
    model: 'Gemini 3.5 Pro Vision',
    status: 'Operational',
    lastReset: '2026-03-01',
    topUsers: [
      { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', tokens: 45200, uses: 124 },
      { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@example.com', tokens: 38100, uses: 98 },
      { id: 3, name: 'Michael Chen', email: 'm.chen@example.com', tokens: 29500, uses: 82 },
      { id: 4, name: 'Elena Rodriguez', email: 'elena.rod@example.com', tokens: 12400, uses: 45 },
    ]
  };

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
    { name: 'Order Management', icon: 'shopping_bag', path: '/app/admin/orders' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'AI Management':
        return (
          <div className="space-y-6">
            {/* AI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">Mô hình hiện tại</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{aiStats.model}</h3>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-0.5 rounded-lg w-fit">
                  <div className="size-1.5 rounded-full bg-[#4CAF50] animate-pulse"></div>
                  {aiStats.status}
                </div>
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-slate-100 dark:text-slate-800 opacity-50">smart_toy</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">Hạn mức Token hàng tháng</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {aiStats.usedTokens.toLocaleString()} <span className="text-slate-400 font-bold text-sm">/ {aiStats.totalTokens.toLocaleString()}</span>
                    </h3>
                  </div>
                  <p className="text-sm font-black text-[#4CAF50]">{Math.round((aiStats.usedTokens / aiStats.totalTokens) * 100)}% đã dùng</p>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4CAF50] transition-all duration-1000" style={{ width: `${(aiStats.usedTokens / aiStats.totalTokens) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Ngày làm mới tiếp theo: 2026-04-01</p>
              </div>
            </div>

            {/* Top Users Using AI */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-slate-900 dark:text-slate-100">
               <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-tight">Người dùng sử dụng AI nhiều nhất</h3>
                  <button className="text-xs font-bold text-[#4CAF50] hover:underline transition-all">Chi tiết báo cáo</button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <th className="px-6 py-4">Người dùng</th>
                       <th className="px-6 py-4 text-center">Số lần Diagnosis</th>
                       <th className="px-6 py-4 text-right">Tổng Token đã dùng</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {aiStats.topUsers.map(user => (
                       <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-500">
                               {user.name.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-bold leading-none">{user.name}</p>
                               <p className="text-[10px] text-slate-500 mt-1">{user.email}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-300">
                           {user.uses}
                         </td>
                         <td className="px-6 py-4 text-right">
                           <span className="text-sm font-black text-slate-900 dark:text-white">{user.tokens.toLocaleString()}</span>
                           <span className="text-[10px] text-slate-400 ml-1">tokens</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* AI Settings Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6 text-slate-900 dark:text-slate-100">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
                <div className="size-10 bg-[#4CAF50]/10 text-[#4CAF50] rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined">settings_suggest</span>
                </div>
                <div>
                  <h3 className="text-lg font-black">Cấu hình mô hình AI</h3>
                  <p className="text-xs text-slate-500">Tùy chỉnh các thông số hoạt động của Engine chẩn đoán.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Selection</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm">
                    <option>Gemini 3.5 Pro Vision (Khuyên dùng)</option>
                    <option>Gemini 3.5 Flash (Tốc độ cao)</option>
                    <option>GPT-4o Vision API</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Độ chính xác (Threshold)</label>
                  <div className="flex items-center gap-4">
                    <input type="range" className="flex-1 accent-[#4CAF50]" min="0" max="100" defaultValue="85" />
                    <span className="text-sm font-black text-[#4CAF50]">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Security':
        return (
          <div className="space-y-6">
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6 text-slate-900 dark:text-slate-100">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-4">
                <div className="size-10 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Security Preferences</h3>
                  <p className="text-xs text-slate-500">Manage how administrators access the console.</p>
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Require a security code to sign in to the admin panel.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" defaultChecked type="checkbox" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Session Timeout</p>
                    <p className="text-xs text-slate-500">Automatically logout after a period of inactivity.</p>
                  </div>
                  <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-4 py-2 text-slate-600 dark:text-slate-300 outline-none focus:ring-1 focus:ring-[#4CAF50]">
                    <option>30 Minutes</option>
                    <option selected>1 Hour</option>
                    <option>4 Hours</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-20 text-center text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined text-6xl text-slate-200">build</span>
            <p className="text-slate-500 font-bold mt-4">Tính năng {activeTab} đang được phát triển</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9F8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 font-display antialiased">
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
          <Link to="/app/admin/settings" className="flex items-center gap-3 px-3 py-2.5 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg transition-colors">
            <span className="material-symbols-outlined fill-1">settings</span>
            <span className="text-sm font-bold">Settings</span>
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">System Settings</h2>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/plants" className="text-sm font-bold text-slate-500 hover:text-[#4CAF50] transition-colors">Shop</Link>
              <Link to="/cart" className="text-sm font-bold text-slate-500 hover:text-[#4CAF50] transition-colors">Cart</Link>
              <Link to="/app/admin" className="text-sm font-bold text-[#4CAF50] border-b-2 border-[#4CAF50] py-5">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 transition-colors">Reset</button>
            <button className="px-5 py-2.5 rounded-xl bg-[#4CAF50] text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span>
              Save Changes
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f6f8f8] dark:bg-[#10221f]">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8">
              {['Profile', 'AI Management', 'Security', 'Notifications'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Render Active Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSystemSettings;
