
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
    <div className="flex h-screen bg-background-light">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r border-[#f0f4f2] bg-white h-full">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white">potted_plant</span>
            </div>
            <h1 className="text-xl font-bold">DeskBoost</h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
          <Link to="/app/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/20 text-text-main font-semibold">
            <span className="material-symbols-outlined fill-1">dashboard</span> Dashboard
          </Link>
          <Link to="/app/my-plants" className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-[#f0f4f2]">
            <span className="material-symbols-outlined">potted_plant</span> My Plants
          </Link>
          <Link to="/plants" className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-[#f0f4f2]">
            <span className="material-symbols-outlined">storefront</span> Shop
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-[#f0f4f2]">
            <span className="material-symbols-outlined">home</span> Home
          </Link>
        </nav>
        <div className="p-4 border-t border-[#f0f4f2] space-y-4">
          <div className="flex items-center gap-3 p-2">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">Sarah Jenkins</span>
              <span className="text-xs text-text-secondary">Pro Plan</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-[#f0f4f2]">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-gray-100 md:hidden"></div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black">Good morning, Sarah! 🌱</h1>
            <p className="text-text-secondary font-medium">Your Monstera needs some love today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm font-medium">Total Plants</span>
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-md">potted_plant</span>
              </div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-primary font-bold">+2 this month</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm font-medium">Care Streak</span>
                <span className="material-symbols-outlined text-orange-400 bg-orange-100 p-2 rounded-md">local_fire_department</span>
              </div>
              <p className="text-3xl font-bold">15 Days</p>
              <p className="text-xs text-text-secondary">Keep it up!</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm font-medium">Recommendation</span>
                <span className="material-symbols-outlined text-blue-500 bg-blue-100 p-2 rounded-md">shopping_bag</span>
              </div>
              <p className="text-3xl font-bold">Snake Plant</p>
              <p className="text-xs text-text-secondary">Low maintenance choice</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Today's Care</h2>
                <button className="text-sm font-bold text-primary">View Calendar</button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Water the Snake Plant', desc: 'Approx 200ml • Soil is dry', icon: 'water_drop', color: 'blue' },
                  { title: 'Rotate Pothos', desc: 'Turn 180° towards window', icon: 'wb_sunny', color: 'yellow' },
                  { title: 'Mist Fiddle Leaf Fig', desc: 'Humidity boost needed', icon: 'opacity', color: 'cyan' }
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                    <div className="flex-1">
                      <p className="font-bold">{task.title}</p>
                      <p className="text-sm text-text-secondary">{task.desc}</p>
                    </div>
                    <span className={`material-symbols-outlined text-${task.color}-500`}>{task.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold">Quick Actions</h2>
              <button className="w-full bg-primary text-text-main p-4 rounded-xl shadow-md font-bold text-lg flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                Scan New Plant
              </button>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/app/my-plants" className="bg-white p-4 rounded-xl border border-gray-100 text-center flex flex-col items-center gap-2 hover:border-primary transition-all">
                  <div className="p-2 bg-green-100 rounded-full text-green-700">
                    <span className="material-symbols-outlined">psychiatry</span>
                  </div>
                  <span className="font-bold text-sm">My Jungle</span>
                </Link>
                <button className="bg-white p-4 rounded-xl border border-gray-100 text-center flex flex-col items-center gap-2 hover:border-primary transition-all">
                  <div className="p-2 bg-purple-100 rounded-full text-purple-700">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <span className="font-bold text-sm">Ask AI</span>
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
