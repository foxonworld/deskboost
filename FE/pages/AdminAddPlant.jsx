import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminAddPlant = () => {
  const navigate = useNavigate();

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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header / Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/app/admin/plants')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-lg font-bold">Add New Species</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/app/admin/plants')} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button onClick={() => navigate('/app/admin/plants')} className="px-5 py-2.5 rounded-xl bg-[#4CAF50] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#4CAF50]/20">Save Plant</button>
          </div>
        </header>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f6f8f8] dark:bg-[#10221f]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Side: Basic Info */}
              <div className="md:col-span-2 space-y-6">
                <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">General Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Common Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all placeholder:text-slate-400 font-display" placeholder="e.g., Fiddle Leaf Fig" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scientific Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all placeholder:text-slate-400 italic font-display" placeholder="e.g., Ficus lyrata" type="text" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brief Description</label>
                      <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all placeholder:text-slate-400 font-display min-h-[120px]" placeholder="Describe the plant species..."></textarea>
                    </div>
                  </div>
                </section>

                <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Care Requirements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Light Level</label>
                      <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all font-display appearance-none">
                        <option>Direct Sunlight</option>
                        <option>Bright Indirect</option>
                        <option>Partial Shade</option>
                        <option>Low Light</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Watering Frequency</label>
                      <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all font-display appearance-none">
                        <option>Every 2-3 days</option>
                        <option>Once a week</option>
                        <option>Every 2 weeks</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Side: Media and Visibility */}
              <div className="space-y-6 text-slate-900 dark:text-slate-100">
                <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Plant Media</h3>
                  <div className="aspect-square bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-[#4CAF50] hover:text-[#4CAF50] transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">add_photo_alternate</span>
                    <span className="text-xs font-bold mt-2">Upload Image</span>
                  </div>
                  <p className="text-[10px] text-center text-slate-400">Recommended: 800x800px, JPG or PNG</p>
                </section>

                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">Published</p>
                      <p className="text-[10px] text-slate-500">Visible in user library</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" defaultChecked type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                    </label>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAddPlant;
