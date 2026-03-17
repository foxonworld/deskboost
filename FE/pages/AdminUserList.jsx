import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminUserList = () => {
  const navigate = useNavigate();

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
    { name: 'User List', icon: 'group', path: '/app/admin/users', active: true },
    { name: 'Manage Mail Messages', icon: 'mail', path: '/app/admin/messages' },
    { name: 'Order Management', icon: 'shopping_bag', path: '/app/admin/orders' },
  ];

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
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">User Management</h2>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-[#4CAF50] text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Add User
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f6f8f8] dark:bg-[#10221f]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats / Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Users</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">12,842</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Today</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">1,240</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">New Registrations</p>
                <h3 className="text-2xl font-black text-[#4CAF50] mt-1">+84</h3>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] outline-none transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 shadow-sm"
                  placeholder="Search users by name, email, or role..."
                  type="text"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                Filters
              </button>
            </div>

            {/* User Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-slate-900 dark:text-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plants</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Admin', plants: 12, date: 'Oct 12, 2023', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmijFWGoiGx6X9_-Wl7peiz6DeIcyixNreEu5GRQE4CNgCw04v5KZVSBf5AbEYiyao7F7EFjBzaI1t-vLM8SJeqolAAu61qI4sAncWUo6QUqPz1wFNOdVN08aDEGV0j3dvWrpAaWhmm9uUrfYg2siiTZEPhc1299m2tcxuSKAp98fiPxSOL7T7lEU3bPxj6yEq7L-PFIQugpNsrratwPjbxangyERP-b1pYV46SKBPAk1CaUN8fihPV_X17_X3uyQJ4j4k8bIqcwE' },
                      { id: 2, name: 'Michael Chen', email: 'm.chen@example.com', role: 'User', plants: 5, date: 'Nov 03, 2023', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWVEfyBVnp-ldceoCIB-kfdbjUqKfOp9YxO6S0nduZwyvGLLrL5ec3Tiwe4HtpRbb49YwqcaPNh7VEd3GMfrR2ztDc11EMNVX0eB2Wt-5S8gDPo8mJVI-uwcSsAxqxHAMEnN6O9zYrDd6XC_9ihER0pXOkxCPEpQEEslj3Q6ykNkSnjQ1AvwJk-nialG5y9S5KToAVQRQN-dU65XUpbHvhy8fYfsPG5fBFSA2PgKJdTxDojrau9BwylRtcFWNpt-rUjrvhQGXRmNU' },
                      { id: 3, name: 'Elena Rodriguez', email: 'elena.rod@example.com', role: 'User', plants: 8, date: 'Dec 20, 2023', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzMb1wY-M_mqswYVKs6INdhMbyzpX7O9EwgTpk8m5AjiEYVFAxoIwhnLpop5o9lW5qBR81_yHxP--Wia6exF51el8nZaS1C-t6pP2wKVF3OU_6Brv-8g3OMBSfLqY09nrm7-UvRowYlM3HvWraO7YBcZoEEsHjKYqFFNUX96fbQs_XAkqSztsL14-HRLzFWsE6egTdCXhvihD7IhgPStkEWHnWg-sjaHpCXbOi9x-cRkmQ5fpyD17CHlwR_Aw9Qlyb8V2ZxwfCVLo' },
                      { id: 4, name: 'James Wilson', email: 'james.w@example.com', role: 'User', plants: 2, date: 'Jan 15, 2024', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOwQ5i79-5RfIvSH5LZAU_Topia6U5Vjy3tIhan4PsGUGy6PwOa94hpt_zOTkN01_NqHrL9QOFYAhhayjjRaXwcGQ5kKIMyF5vvqSyqAKD4vZA6k_Exs4p_dR2X-gzLaVchiyzjpZF96cTIoS7diE4orNLVxgQ5E4cqiJzAAL-K7YqmaoRwZVjz4ZiqT3Yke0bJIL21cjx5Peb0enh2g_82gcCZUKcZWfn2JAcTIVf6cRLbri7OhCW3GJ5Ht-Ghblsxhp_pJQqoe8' },
                    ].map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url('${user.avatar}')` }}></div>
                            <span className="font-bold">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'Admin' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold">{user.plants}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{user.date}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => navigate(`/app/admin/users/${user.id}`)} className="p-2 text-slate-400 hover:text-[#4CAF50] transition-colors" title="View Detail">
                              <span className="material-symbols-outlined">visibility</span>
                            </button>
                            <button className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all">Disable</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-sm text-slate-500 font-medium">Showing 1 to 4 of 12,842 results</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 cursor-not-allowed">Previous</button>
                  <button className="px-4 py-2 text-sm font-bold bg-[#4CAF50] text-white rounded-lg shadow-sm">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUserList;
