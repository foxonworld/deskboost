
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
    <div className="flex h-screen bg-[#f6f8f8]">
      <aside className="w-64 hidden lg:flex flex-col bg-white border-r border-gray-100">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white">
              <span className="material-symbols-outlined">potted_plant</span>
            </div>
            <div>
              <h1 className="text-base font-bold">DeskBoost</h1>
              <p className="text-xs text-text-secondary">Admin Portal</p>
            </div>
          </Link>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 font-bold">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-gray-50">
            <span className="material-symbols-outlined">group</span> Users
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-gray-50">
            <span className="material-symbols-outlined">inventory_2</span> Catalog
          </button>
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-gray-50">
            <span className="material-symbols-outlined">home</span> Home Page
          </Link>
        </nav>
        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold"
          >
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold">Admin Dashboard</h2>
          <div className="flex items-center gap-6">
            <span className="bg-primary/20 text-primary-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Demo Mode</span>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-text-secondary">notifications</span>
              <div className="h-10 w-10 rounded-full bg-primary border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Users', val: '1,240', trend: '+12%', icon: 'group' },
              { label: 'Plants Sold', val: '3,405', trend: '+5%', icon: 'shopping_bag' },
              { label: 'Care Quality', val: '85%', trend: '+2%', icon: 'health_and_safety' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-text-secondary">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stat.val}</span>
                  <span className="text-green-600 text-xs font-bold">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[500px]">
            <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-50">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary text-lg">search</span>
                  <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {['Sarah Jenkins', 'Michael Chen', 'David Ross', 'Emily Blunt'].map((user, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${i === 0 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50 border border-transparent'}`}>
                    <div className="size-10 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{user}</p>
                      <p className="text-xs text-text-secondary">{user.toLowerCase().replace(' ', '.')}@example.com</p>
                    </div>
                    {i === 0 && <span className="material-symbols-outlined text-primary">chevron_right</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <div className="p-8 border-b border-gray-50 flex items-start justify-between bg-gray-50/50">
                <div className="flex gap-4">
                  <div className="size-16 rounded-2xl bg-gray-200 shadow-md"></div>
                  <div>
                    <h3 className="text-xl font-bold">Sarah Jenkins</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="size-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-text-secondary">Active Member</span>
                    </div>
                  </div>
                </div>
                <button className="text-text-secondary hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-text-secondary tracking-widest">Assigned Plants</h4>
                  <button className="bg-primary text-text-main px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span> Add Plant
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['Snake Plant', 'Monstera'].map((p, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                      <p className="font-bold text-sm">{p}</p>
                      <p className="text-xs text-text-secondary mt-1">Water in {i + 1} days</p>
                      <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-dashed border-primary/30 text-center">
                   <p className="text-sm font-medium">Care Recommendation</p>
                   <p className="text-xs text-text-secondary mt-1">This user is doing great! Suggest adding a humidifier.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
