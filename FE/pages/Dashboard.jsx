
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-slate-100 font-display">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined text-white">potted_plant</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight dark:text-white">DeskBoost</h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
          <Link to="/app/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary font-bold">
            <span className="material-symbols-outlined fill-1">dashboard</span> Dashboard
          </Link>
          <Link to="/app/my-plants" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary dark:text-slate-400 font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">potted_plant</span> My Plants
          </Link>
          <Link to="/app/profile" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary dark:text-slate-400 font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">person</span> Profile
          </Link>
          <Link to="/plants" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary dark:text-slate-400 font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">storefront</span> Shop
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary dark:text-slate-400 font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">receipt_long</span> My Orders
          </Link>
          <Link to="/cart" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary dark:text-slate-400 font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">shopping_cart</span> Cart
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary dark:text-slate-400 font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">home</span> Home
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 p-2">
            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"></div>
            <div className="flex flex-col">
              <span className="text-sm font-bold dark:text-white">Sarah Jenkins</span>
              <span className="text-xs text-text-secondary dark:text-slate-400 font-medium">Pro Plan</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold text-sm"
          >
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-bold tracking-tight dark:text-white">Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center relative text-text-secondary dark:text-slate-400">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-slate-800 md:hidden border border-gray-200 dark:border-slate-700"></div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black dark:text-white">Good morning, Sarah! 🌱</h1>
            <p className="text-text-secondary dark:text-slate-400 font-medium">Your Monstera needs some love today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Total Plants</span>
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">potted_plant</span>
              </div>
              <p className="text-3xl font-black dark:text-white">12</p>
              <p className="text-xs text-primary font-bold">+2 this month</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Care Streak</span>
                <span className="material-symbols-outlined text-orange-500 bg-orange-50 dark:bg-orange-500/10 p-2 rounded-xl">local_fire_department</span>
              </div>
              <p className="text-3xl font-black dark:text-white">15 Days</p>
              <p className="text-xs text-text-secondary dark:text-slate-400 font-medium">Keep it up!</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Recommendation</span>
                <span className="material-symbols-outlined text-blue-500 bg-blue-50 dark:bg-blue-500/10 p-2 rounded-xl">shopping_bag</span>
              </div>
              <p className="text-3xl font-black dark:text-white">Snake Plant</p>
              <p className="text-xs text-text-secondary dark:text-slate-400 font-medium">Low maintenance choice</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold dark:text-white">Today's Care</h2>
                <button className="text-sm font-bold text-primary hover:underline">View Calendar</button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Water the Snake Plant', desc: 'Approx 200ml • Soil is dry', icon: 'water_drop', color: 'blue' },
                  { title: 'Rotate Pothos', desc: 'Turn 180° towards window', icon: 'wb_sunny', color: 'amber' },
                  { title: 'Mist Fiddle Leaf Fig', desc: 'Humidity boost needed', icon: 'opacity', color: 'cyan' }
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="w-6 h-6 rounded-lg border-gray-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer bg-transparent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">{task.title}</p>
                      <p className="text-sm text-text-secondary dark:text-slate-400 font-medium">{task.desc}</p>
                    </div>
                    <div className={`p-2 rounded-xl bg-${task.color}-50 dark:bg-${task.color}-500/10 text-${task.color}-600 dark:text-${task.color}-400`}>
                      <span className="material-symbols-outlined text-xl">{task.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold px-2 dark:text-white">Quick Actions</h2>
              <button className="w-full bg-primary text-white p-5 rounded-2xl shadow-lg shadow-primary/20 font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all">
                <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                Scan New Plant
              </button>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/app/my-plants" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center gap-3 hover:border-primary hover:shadow-md transition-all group">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">psychiatry</span>
                  </div>
                  <span className="font-bold text-sm dark:text-white">My Jungle</span>
                </Link>
                <button className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center gap-3 hover:border-primary hover:shadow-md transition-all group">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">smart_toy</span>
                  </div>
                  <span className="font-bold text-sm dark:text-white">Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

  );
};

export default Dashboard;
