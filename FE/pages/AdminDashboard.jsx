
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard Overview', icon: 'dashboard', path: '/app/admin', active: true },
    { name: 'Shop Management', icon: 'storefront', path: '/app/admin/plants' },
    { name: 'Financial Management', icon: 'account_balance_wallet', path: '/app/admin/financials' },
    { name: 'Manage User Plants', icon: 'potted_plant', path: '/app/admin/user-plants' },
    { name: 'User List', icon: 'group', path: '/app/admin/users' },
    { name: 'Manage Mail Messages', icon: 'mail', path: '/app/admin/messages' },
    { name: 'Order Management', icon: 'shopping_bag', path: '/app/admin/orders' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 font-display antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#4CAF50] size-10 rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">potted_plant</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">DeskBoost</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
                item.active 
                  ? 'bg-[#4CAF50]/20 text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
          <div className="pt-4 pb-2 px-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</p>
          </div>
          <Link
            to="/app/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-sm">Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-8">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h2>
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/app/admin" className="text-sm font-bold text-slate-900 dark:text-white border-b-2 border-[#4CAF50] pb-5 mt-5">Dashboard</Link>
              <Link to="/plants" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#4CAF50] transition-colors">Shop</Link>
              <Link to="/cart" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#4CAF50] transition-colors flex items-center gap-1">
                Cart
                <span className="bg-[#4CAF50]/20 text-[#4CAF50] text-[10px] px-1.5 py-0.5 rounded-full font-bold">3</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 w-48"
                placeholder="Quick Search..."
                type="text"
              />
            </div>
            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Alex Rivera</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Super Admin</p>
              </div>
              <img
                className="size-10 rounded-full border-2 border-[#4CAF50]/20 object-cover"
                alt="Admin user profile picture"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIMOGyjJzE0rFYkuQ20u9IX_25dU84smpTBoKRtW28AjN6NOhhUAkPHbkavdawW6Udr00aA2vjHHEhsqqhTTw1jTBtrvC5tb3NewRbtxYbr7AqQPcoaAYwbSX-KnzcKkhKd9vLnl0TY5HgnPTcvTAT5JoOpjm_WV9V_OVDebRhUDHMtzf1oV0F2o4SWULgSoVQeDTDp6TfmvMag70Lr_wqnZWpJbZSPxTvGlnqYRF3wAtQzntum7DHUTtOu5_2mGcig3M92uZAAro"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', val: '1,240', trend: '+12%', icon: 'group' },
              { label: 'Shop Management', val: '48 Products', trend: 'Stable', icon: 'storefront' },
              { label: 'User Plants', val: '3,405', trend: '+5%', icon: 'potted_plant' },
              { label: 'Monthly Profit', val: '5,420,000₫', trend: '+8%', icon: 'payments' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#4CAF50]/10 rounded-lg text-[#4CAF50]">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className={`text-xs font-bold flex items-center px-2 py-1 rounded-full ${stat.trend === 'Stable' ? 'text-slate-400 bg-slate-100 dark:bg-slate-800' : 'text-[#4CAF50] bg-[#4CAF50]/10'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.val}</h3>
              </div>
            ))}
          </div>

          {/* Recent Activity & Navigation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Section */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                <button className="text-[#4CAF50] text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { action: 'New user registered', user: 'Sarah Jenkins', date: 'Just now', status: 'Success', icon: 'person_add', color: 'blue' },
                      { action: 'Plant diagnosed: Monstera', user: 'David Miller', date: '2 min ago', status: 'Attention', icon: 'medical_services', color: 'orange' },
                      { action: 'New plant added to library', user: 'Admin Team', date: '1 hour ago', status: 'Success', icon: 'add_circle', color: 'primary' },
                      { action: 'Profile updated', user: 'Michael Chen', date: '3 hours ago', status: 'Info', icon: 'edit', color: 'slate' },
                    ].map((item, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-full flex items-center justify-center ${
                              item.color === 'primary' ? 'bg-[#4CAF50]/20 text-[#4CAF50]' :
                              item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                              item.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                              'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              <span className="material-symbols-outlined text-sm">{item.icon}</span>
                            </div>
                            <span className="text-sm font-medium dark:text-slate-200">{item.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.user}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            item.status === 'Success' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' :
                            item.status === 'Attention' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white px-2">Quick Navigation</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: 'Manage Users', icon: 'manage_accounts', bg: 'bg-slate-900', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA6YuR6nctYovHHVQjGhfodqDruisveACQiw3vaLugtrYrK7qd1vTzmGpi6a_5Tjq8Y0KJgcNO7-KRvNBiVK8WyAejRukE4BrEGb_6_ETZxUPU7peSHSbv4jdTBUKM5dKgQq2zUhoWxM2M89zWwB4FHCrM0fyPDki93ZNFRn4fdgGTe8K94Q9AIAK3LkXbDoM2_hXls8-OldsAXCdQKD0mRFulJkSiPNk4hR0Ksk0vAWRaPmd_zC0je-nZqU7GU3zJVYI--SQRGJo', path: '/app/admin/users' },
                  { title: 'Shop Management', icon: 'storefront', bg: 'bg-green-900', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx4Sa9UooGjM2cFrTdhJK34sNM3UFqSp4qBFMRMzkU5CNo0kx5xwFUR5uL56YUK8WFMUBzG4D8TssO5qdNJz3YZK4wiLz9YqVpcZDbYRktN8Ys8GTxnXlALMJm8ghmbBcA-1ww0fgJ47ILKLLIOqKo2gIqf6e_iLw1lD-E47u6dXEUw_lstklXYhvD4xXHjheGVYD6cfxQ_zGE3Mki410moPZlKMlNwu5mPIh6YJdtJaPYeTnGkWnbJHkn8oWh8-1l1VRBg0ghrsY', path: '/app/admin/plants' },
                  { title: 'Financial Management', icon: 'account_balance_wallet', bg: 'bg-blue-900', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOwQ5i79-5RfIvSH5LZAU_Topia6U5Vjy3tIhan4PsGUGy6PwOa94hpt_zOTkN01_NqHrL9QOFYAhhayjjRaXwcGQ5kKIMyF5vvqSyqAKD4vZA6k_Exs4p_dR2X-gzLaVchiyzjpZF96cTIoS7diE4orNLVxgQ5E4cqiJzAAL-K7YqmaoRwZVjz4ZiqT3Yke0bJIL21cjx5Peb0enh2g_82gcCZUKcZWfn2JAcTIVf6cRLbri7OhCW3GJ5Ht-Ghblsxhp_pJQqoe8', path: '/app/admin/financials' },
                  { title: 'User Plants', icon: 'potted_plant', bg: 'bg-green-800', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVEvQkjeoJ3zxfAJaKEciR761BKpNBRiVkbTgY0AW55PKypn7HtnN1oKBDC5RvNkIl3pusUM_X_HXtvl-q-1lC-uOKhIL3aBJI6AB03H8O2g9dBsqe_EWdl4Js33OxZpLVBDIntnDltPQ_tC3iXSnMC_su9LgXBWPTe1NZN_aNH-RURuNnfuggfjHeW2U3tYeVCIs6mzYGPep6tXveD_ZpkYDLvJPErFkXlJ479Mnm8kCZpRvf9RpRAupir2SnMjeKv8H8Jpv6iGY', path: '/app/admin/user-plants' },
                ].map((nav, i) => (
                  <button key={i} onClick={() => navigate(nav.path)} className={`group relative overflow-hidden rounded-xl h-24 flex items-center p-6 ${nav.bg}`}>
                    <img
                      className="absolute inset-0 size-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
                      src={nav.img}
                      alt={nav.title}
                    />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-[#4CAF50]/20 text-[#4CAF50] backdrop-blur flex items-center justify-center">
                        <span className="material-symbols-outlined">{nav.icon}</span>
                      </div>
                      <span className="text-white font-bold">{nav.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
