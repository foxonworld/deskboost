import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const AdminEditPlant = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard Overview', icon: 'dashboard', path: '/app/admin' },
    { name: 'Shop Management', icon: 'storefront', path: '/app/admin/plants', active: true },
    { name: 'Financial Management', icon: 'account_balance_wallet', path: '/app/admin/financials' },
    { name: 'Manage User Plants', icon: 'potted_plant', path: '/app/admin/user-plants' },
    { name: 'User List', icon: 'group', path: '/app/admin/users' },
    { name: 'Manage Mail Messages', icon: 'mail', path: '/app/admin/messages' },
    { name: 'Order Management', icon: 'shopping_bag', path: '/app/admin/orders' },
  ];

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
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/app/admin/plants')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-lg font-bold">Edit Plant Species</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/app/admin/plants')} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Discard</button>
            <button onClick={() => navigate('/app/admin/plants')} className="px-5 py-2.5 rounded-xl bg-[#4CAF50] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#4CAF50]/20">Update Species</button>
          </div>
        </header>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f6f8f8] dark:bg-[#10221f]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Side: Basic Info */}
              <div className="md:col-span-2 space-y-6">
                <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">General Information</h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md font-bold text-slate-500 uppercase">ID: {id || 'SP502'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Common Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all placeholder:text-slate-400 font-display" defaultValue="Monstera Deliciosa" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scientific Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all placeholder:text-slate-400 italic font-display" defaultValue="Monstera deliciosa Liebm." type="text" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Short Summary</label>
                      <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all placeholder:text-slate-400 font-display min-h-[100px]" defaultValue="The Swiss cheese plant is a species of flowering plant native to tropical forests of southern Mexico, south to Panama."></textarea>
                    </div>
                  </div>
                </section>

                <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Care Guidelines</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Light Level</label>
                        <select className="w-full bg-transparent font-bold mt-1 outline-none text-slate-700 dark:text-slate-200">
                          <option selected>Bright Indirect</option>
                          <option>Direct Sun</option>
                          <option>Low Light</option>
                        </select>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Watering</label>
                        <select className="w-full bg-transparent font-bold mt-1 outline-none text-slate-700 dark:text-slate-200">
                          <option selected>Every 2-3 Days</option>
                          <option>Once a Week</option>
                          <option>Twice a Month</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all placeholder:text-slate-400 font-display min-h-[150px]" defaultValue="Water your Monstera when the top 2-3 inches of soil feel dry. They love to climb, so providing a moss pole will help them grow larger leaves with more fenestrations. Avoid direct hot afternoon sun which can scorch the leaves."></textarea>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Side: Media and Controls */}
              <div className="space-y-6 text-slate-900 dark:text-slate-100">
                <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Featured Image</h3>
                  <div className="aspect-square relative rounded-2xl overflow-hidden group">
                    <img alt="Monstera" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkDYf3lIh84YXVCL1drnlCtbUhF_ktjIskZi48uiRlwv-Sk5bLbwqwcM4YtTt6TSv8yPQIvmFDyqj6FusYlnLmbANPAEozrHpRTqsf3P7OpElxUbUJFm75CCrU6PPvFovCzUPZx6Pm4oKCE8EAsrcwsyfVEBNqgwk-uDDOkBXeycRgHUNa7Fw9ckK8Fiz_oc26RhVagxIiK4H4OgivoP9f_vtmfCHmQET2CVAoJz_3zEwJuqIRJW1t20LADY8T9Nfp-7pVLGXkstE" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white text-slate-900 rounded-lg"><span className="material-symbols-outlined">edit</span></button>
                      <button className="p-2 bg-white text-red-500 rounded-lg"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    Change Image
                  </button>
                </section>

                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Show in Library</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" defaultChecked type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Featured Species</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                    </label>
                  </div>
                </section>

                <button className="w-full py-4 border-2 border-red-500/20 text-red-500 font-bold text-xs rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors uppercase tracking-widest">
                  Archive Species
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEditPlant;
