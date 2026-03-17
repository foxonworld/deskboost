import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const AdminUserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    <div className="relative flex h-screen w-full overflow-hidden bg-[#F7F9F8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 font-display font-display antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#4CAF50] rounded-lg p-1.5 text-white cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined leading-none">potted_plant</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">DeskBoost</h1>
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
              <span className={`material-symbols-outlined text-[22px] ${item.active ? 'fill-1' : ''}`}>{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link to="/app/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[22px]">settings</span>
            <span className="text-sm font-semibold">Settings</span>
          </Link>
          <div className="mt-4 flex items-center gap-3 px-3 py-2">
            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqndAS5KZ1d7UM_dy0EigJ9q7eQL3l7NqZghD2DoprvSDETONHDwoBeUeWOgDThHgrqwQQndAUgIi3YAmqLhRtk2z6nDWlmUbLwzxZ30g5xeC54PHcjaefuMLp5RgXYQFRgcZVse66dC39kqLvuzYZ0_VwnFyRGTVO9QLF2fO87EjrQQUvdcAzcO-klanwTHkDoMR5YgXPAm-SeCdXC92yqZn7J9F8AgbpvE3WQk8-glJ8sBS_qcOHeSTQ0FT02JzhGWfEBrQE7As" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Admin User</p>
              <p className="text-[10px] text-slate-500 truncate">admin@deskboost.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/app/admin/users')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-lg font-bold whitespace-nowrap">User Details</h2>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/app/admin" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] transition-colors">Dashboard</Link>
              <Link to="/plants" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] transition-colors">Shop</Link>
              <Link to="/cart" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] flex items-center gap-1 transition-colors">
                Cart
                <span className="bg-[#4CAF50]/10 text-[#4CAF50] text-[10px] px-1.5 py-0.5 rounded-full">2</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#4CAF50]/50 transition-all font-display" placeholder="Search anything..." type="text" />
            </div>
            <button className="p-2 text-slate-500 hover:text-[#4CAF50] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex text-sm font-medium text-slate-500">
            <Link to="/app/admin/users" className="hover:text-[#4CAF50]">Users</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white">Alex Johnson</span>
          </nav>

          {/* User Info Card */}
          <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="size-24 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden flex-shrink-0">
                  <img alt="Alex Johnson" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1AnbVuQ3P4JEpaJ6_2s9tK6bHIkYIgF0MtLqTI3WDAOcWT4EA2nqPIgAWe6pliOvSVaZfYVku_UoxSxZxcVg7XReEkWIRvpIFjnXkYPKDIASboygnXXd5i_FwQ5m9W3FbZBor146engm87IIDDRN5aTOMkRDAX2PUjQ4quPeXOTzFjrE-4WXpFh8GsWmom_80aJ-jUcKIYT568fT_RFNQb8rxrZomU-1DXwkUvaXhCDVp8SD4wLThu2yfkHHGxRpao10Cgs8XgwU" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold tracking-tight">Alex Johnson</h3>
                  <p className="text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    alex.johnson@example.com
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#4CAF50]/10 text-[#4CAF50]">
                      Premium User
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-slate-500">
                      <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                      Joined: Oct 12, 2023
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all font-display">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  Reset Password
                </button>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-red-500 text-red-500 font-bold text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-all font-display">
                  <span className="material-symbols-outlined text-[20px]">block</span>
                  Disable User
                </button>
              </div>
            </div>
          </section>

          {/* Plants Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold tracking-tight">Owned Plants <span className="text-slate-400 font-normal ml-2">(4)</span></h4>
              <button className="text-sm font-semibold text-[#4CAF50] hover:underline flex items-center gap-1 font-display">
                Manage All <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-900 dark:text-slate-100">
              {[
                { name: 'Snake Plant', status: 'HEALTHY', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1WbuUszois_A9csrrmH3dOJ0CDBW5ZOLa46EoMv8oarvIG8tK2T-n7e4Dpv89-u-9UMVRFGeG7fJMNhXsdr9Y8SyzdEZRm2AvsQiNgr6PTO5ndPtlrj2_Rb3abGSBQP6PftHAC-OGOCs19od89mLVOfDA5dX6POiCbAw2di_72GqABmCvoWrYsFOhO1h9p6vNruT-ue241zHGFZO7nAaUQc-W8Pw8ndHUje2i9gexuf3Jz1Zl1KK0REEMTpo2nKGZOWR6G4a3GY0', water: '2 days ago', light: 'Partial' },
                { name: 'Monstera Deliciosa', status: 'HEALTHY', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5JX4WBB_Tg10pXb26kJyCDJx8MZBMiJUBeRb-Zimr9r4CrNhGOtt8J3XnXtNMBifEqF5JevNBTPS5e644vyIC5Yfw0J_EWaMNySjmoiOMJwSTbCmr-KzVcOdfvBoK1yXstFjcE-QOInpv7yJcZReP_gKABXiqz7BYG3yO3jPUyfd0kqAbzj6M-1jUkzDEQs_K_eiINX29_sj5F-2ovAdIHsb6XerALCjUNR6YTpkp83YtFoxZMT8Paj8YJb_TJdnRTsqOuRCqlNk', water: 'Today', light: 'High' },
                { name: 'Succulent Mix', status: 'THIRSTY', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdeiTIg0KkeORX-tmUYl6OwMbilC6hMEvC6uOtoDr1U95xj3VtJCciQ_y_l-rDPtpE_6HfZ2UTBwIYXwpqjl9onoXt5RlOgaNE1AIfxY69M8emgK-5pyA_Q8eHP5-diAuc3g3EI04PCibVU5y8IkiiTCIhuLKTsbqQM7Eh4px5HaeOkPpAoxtSSZsP7qUEmMYe-PcY_KnazDum3AGbexQIDNfSH0cuk5JHko_WssbdJCeUbpK97gmIrZrXKlGLAEEPgZsNVZ-mF9o', water: '12 days ago', light: 'Direct', warning: true },
                { name: 'Fiddle Leaf Fig', status: 'HEALTHY', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWao7djqiv_jM7Zbdw9UztpwH8hai-rHTbGajLux9JNr_WduIzJye71Z350zjIlicwT6Ezm4A2bZhRI4Ou4iP9Tvi-dI1TQXXW5UdKW3zf_-1C1eNfndclcdN9RpgWBv89KIj5CT5Tgysd9AUc_9TNwuAbKQQAVmnV4kuOUj46aRrCAOAHkJbNfj-ZSsHNFixJ_4OKesQKDdk4ZVEOJ73DGXa1pepKmU2LAxlb1Zx5heQqt8AbGv1cApEGRQtgU8qiV7deMEJWDFE', water: '5 days ago', light: 'Indirect' },
              ].map((plant, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group">
                  <div className="h-48 overflow-hidden relative">
                    <img alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={plant.img} />
                    <div className={`absolute top-3 right-3 rounded-full px-2 py-1 text-[10px] font-bold shadow-sm ${plant.warning ? 'bg-amber-100 text-amber-700' : 'bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur'}`}>
                      {plant.status}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <h5 className="font-bold">{plant.name}</h5>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className={`flex items-center gap-1 ${plant.warning ? 'text-red-500 font-semibold' : ''}`}>
                        <span className={`material-symbols-outlined text-sm ${plant.warning ? 'text-red-500' : 'text-blue-400'}`}>water_drop</span> 
                        {plant.water}
                      </span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-amber-400 text-sm">light_mode</span> {plant.light}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Log Section */}
          <section className="space-y-4">
            <h4 className="text-xl font-bold tracking-tight">Recent Activity</h4>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden text-slate-900 dark:text-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="px-6 py-4 font-medium">Added new plant: Monstera</td>
                    <td className="px-6 py-4"><span className="text-xs font-bold text-[#4CAF50]">SUCCESS</span></td>
                    <td className="px-6 py-4 text-right text-slate-500">Dec 01, 2023 10:24 AM</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Updated watering schedule</td>
                    <td className="px-6 py-4"><span className="text-xs font-bold text-[#4CAF50]">SUCCESS</span></td>
                    <td className="px-6 py-4 text-right text-slate-500">Nov 28, 2023 03:12 PM</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Login attempted from new device</td>
                    <td className="px-6 py-4"><span className="text-xs font-bold text-amber-600">VERIFIED</span></td>
                    <td className="px-6 py-4 text-right text-slate-500">Nov 24, 2023 09:45 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminUserDetail;
