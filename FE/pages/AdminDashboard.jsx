
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-main dark:text-slate-100 font-display">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">potted_plant</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-main dark:text-white text-base font-bold leading-none">DeskBoost</h1>
              <p className="text-text-secondary dark:text-slate-400 text-xs font-medium">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            to="/app/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link
            to="/app/admin/users"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-text-secondary dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors font-medium"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm">Users</span>
          </Link>
          <Link
            to="/app/admin/plants"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-text-secondary dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors font-medium"
          >
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-sm">Catalog</span>
          </Link>
          <Link
            to="/app/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-text-secondary dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors font-medium"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
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
        <header className="h-16 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold tracking-tight text-text-main dark:text-white">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-text-secondary text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-text-secondary w-48"
                placeholder="Quick Search..."
                type="text"
              />
            </div>
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-text-secondary dark:text-slate-400 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 dark:border-slate-800 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-text-main dark:text-white leading-none">Alex Rivera</p>
                <p className="text-xs font-medium text-text-secondary dark:text-slate-400">Super Admin</p>
              </div>
              <img
                className="size-10 rounded-full border-2 border-primary/20 object-cover"
                alt="Admin user profile picture"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIMOGyjJzE0rFYkuQ20u9IX_25dU84smpTBoKRtW28AjN6NOhhUAkPHbkavdawW6Udr00aA2vjHHEhsqqhTTw1jTBtrvC5tb3NewRbtxYbr7AqQPcoaAYwbSX-KnzcKkhKd9vLnl0TY5HgnPTcvTAT5JoOpjm_WV9V_OVDebRhUDHMtzf1oV0F2o4SWULgSoVQeDTDp6TfmvMag70Lr_wqnZWpJbZSPxTvGlnqYRF3wAtQzntum7DHUTtOu5_2mGcig3M92uZAAro"
                referrerPolicy="no-referrer"
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
              { label: 'Plant Library', val: '48 Species', trend: 'Stable', icon: 'library_books' },
              { label: 'User Plants', val: '3,405', trend: '+5%', icon: 'potted_plant' },
              { label: 'Total Diagnoses', val: '856', trend: '+8%', icon: 'biotech' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className={`text-xs font-bold flex items-center px-2 py-1 rounded-full ${stat.trend === 'Stable' ? 'text-text-secondary bg-gray-100 dark:bg-slate-800' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-text-secondary dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-text-main dark:text-white mt-1">{stat.val}</h3>
              </div>
            ))}
          </div>

          {/* Recent Activity & Navigation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Section */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-text-main dark:text-white">Recent Activity</h3>
                <button className="text-primary text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
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
                              item.color === 'primary' ? 'bg-primary/20 text-primary' :
                              item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                              item.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                              'bg-gray-100 dark:bg-slate-800 text-text-secondary'
                            }`}>
                              <span className="material-symbols-outlined text-sm">{item.icon}</span>
                            </div>
                            <span className="text-sm font-medium dark:text-slate-200">{item.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary dark:text-slate-400">{item.user}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary dark:text-slate-400">{item.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            item.status === 'Success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            item.status === 'Attention' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-gray-100 text-text-secondary dark:bg-slate-800 dark:text-slate-400'
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
              <h3 className="font-bold text-text-main dark:text-white px-2">Quick Navigation</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: 'Manage Users', icon: 'manage_accounts', bg: 'bg-[#1a2c20]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA6YuR6nctYovHHVQjGhfodqDruisveACQiw3vaLugtrYrK7qd1vTzmGpi6a_5Tjq8Y0KJgcNO7-KRvNBiVK8WyAejRukE4BrEGb_6_ETZxUPU7peSHSbv4jdTBUKM5dKgQq2zUhoWxM2M89zWwB4FHCrM0fyPDki93ZNFRn4fdgGTe8K94Q9AIAK3LkXbDoM2_hXls8-OldsAXCdQKD0mRFulJkSiPNk4hR0Ksk0vAWRaPmd_zC0je-nZqU7GU3zJVYI--SQRGJo', path: '/app/admin/users' },
                  { title: 'Plant Library', icon: 'menu_book', bg: 'bg-[#2e4a3b]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx4Sa9UooGjM2cFrTdhJK34sNM3UFqSp4qBFMRMzkU5CNo0kx5xwFUR5uL56YUK8WFMUBzG4D8TssO5qdNJz3YZK4wiLz9YqVpcZDbYRktN8Ys8GTxnXlALMJm8ghmbBcA-1ww0fgJ47ILKLLIOqKo2gIqf6e_iLw1lD-E47u6dXEUw_lstklXYhvD4xXHjheGVYD6cfxQ_zGE3Mki410moPZlKMlNwu5mPIh6YJdtJaPYeTnGkWnbJHkn8oWh8-1l1VRBg0ghrsY', path: '/app/admin/plants' },
                  { title: 'User Plants', icon: 'potted_plant', bg: 'bg-[#3d5a4a]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVEvQkjeoJ3zxfAJaKEciR761BKpNBRiVkbTgY0AW55PKypn7HtnN1oKBDC5RvNkIl3pusUM_X_HXtvl-q-1lC-uOKhIL3aBJI6AB03H8O2g9dBsqe_EWdl4Js33OxZpLVBDIntnDltPQ_tC3iXSnMC_su9LgXBWPTe1NZN_aNH-RURuNnfuggfjHeW2U3tYeVCIs6mzYGPep6tXveD_ZpkYDLvJPErFkXlJ479Mnm8kCZpRvf9RpRAupir2SnMjeKv8H8Jpv6iGY', path: '/app/admin/user-plants' },
                  { title: 'Diagnosis Logs', icon: 'clinical_notes', bg: 'bg-[#4a6b5a]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpZS0kVnSjfMtgJ7HX8PH9O_t0Wpah9ltucX6xJpt69Ro7qoa1cDXLGAaOhIa_wLTwbjgvZwX1HPlvWckyHFsMyrdl4b9E9bKTTEiYye_4F1NFxHX1W7j_Cm72L0-GmM-Ygb4g_y0QAOH9bcBYJx53ApHaORA5dKI8fSJgwQlC1dEte-Dd9CAMsvadLaeDePiuZHDCygX4L8jyHF9EyjK6kXdhefsOByzhB6OML4W_v5xwRuKrrsU6tz50Wyej9-nEsOkY-ROziw0', path: '/app/admin/diagnosis-logs' },
                ].map((nav, i) => (
                  <button key={i} onClick={() => navigate(nav.path)} className={`group relative overflow-hidden rounded-xl h-24 flex items-center p-6 ${nav.bg}`}>
                    <img
                      className="absolute inset-0 size-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
                      src={nav.img}
                      alt={nav.title}
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-primary/20 text-primary backdrop-blur flex items-center justify-center">
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
