import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_ALL_USER_PLANTS } from '../data/mockData';

const AdminManageUserPlants = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // all, critical, sick, healthy
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard Overview', icon: 'dashboard', path: '/app/admin' },
    { name: 'Shop Management', icon: 'storefront', path: '/app/admin/plants' },
    { name: 'Financial Management', icon: 'account_balance_wallet', path: '/app/admin/financials' },
    { name: 'Manage User Plants', icon: 'potted_plant', path: '/app/admin/user-plants', active: true },
    { name: 'User List', icon: 'group', path: '/app/admin/users' },
    { name: 'Manage Mail Messages', icon: 'mail', path: '/app/admin/messages' },
    { name: 'Order Management', icon: 'shopping_bag', path: '/app/admin/orders' },
  ];

  const filteredPlants = useMemo(() => {
    return MOCK_ALL_USER_PLANTS.filter(plant => {
      // Search logic
      const matchesSearch = 
        plant.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Tab logic
      if (activeTab === 'all') return true;
      if (activeTab === 'critical') return plant.status === 'critical';
      if (activeTab === 'sick') return plant.status === 'recovering' || plant.status === 'needs-water';
      if (activeTab === 'healthy') return plant.status === 'thriving';
      
      return true;
    });
  }, [activeTab, searchTerm]);

  const stats = {
    total: MOCK_ALL_USER_PLANTS.length,
    critical: MOCK_ALL_USER_PLANTS.filter(p => p.status === 'critical').length,
    unhealthy: MOCK_ALL_USER_PLANTS.filter(p => p.status !== 'thriving').length,
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'thriving':
        return { label: 'Khỏe mạnh', color: 'text-green-600 bg-green-50 dark:bg-green-500/10', icon: 'check_circle' };
      case 'needs-water':
        return { label: 'Cần tưới nước', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10', icon: 'water_drop' };
      case 'recovering':
        return { label: 'Đang hồi phục', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10', icon: 'history' };
      case 'critical':
        return { label: 'Cần hỗ trợ gấp', color: 'text-red-600 bg-red-50 dark:bg-red-500/10', icon: 'warning' };
      default:
        return { label: status, color: 'text-slate-600 bg-slate-50', icon: 'help' };
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
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black">Health Monitor</h2>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-3">
               <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                 <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                 {stats.critical} Critical
               </span>
               <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                 <span className="size-2 rounded-full bg-amber-500"></span>
                 {stats.unhealthy} Issues
               </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input 
                  type="text" 
                  placeholder="Tìm cây hoặc chủ sở hữu..." 
                  className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-[#4CAF50]/50 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f8faf9] dark:bg-[#0c1614] p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Action Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
              <div className="flex gap-8">
                {[
                  { id: 'all', label: 'Tất cả cây', count: stats.total },
                  { id: 'critical', label: 'Cần hỗ trợ gấp', count: stats.critical, color: 'text-red-500' },
                  { id: 'sick', label: 'Cần theo dõi', count: stats.unhealthy - stats.critical, color: 'text-amber-500' },
                  { id: 'healthy', label: 'Khỏe mạnh', count: stats.total - stats.unhealthy },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-black transition-all relative ${
                      activeTab === tab.id 
                        ? 'text-[#4CAF50]' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {tab.label}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 ${activeTab === tab.id ? 'text-[#4CAF50]' : 'text-slate-500'}`}>
                        {tab.count}
                      </span>
                    </span>
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4CAF50] rounded-full"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Plants */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlants.map(plant => {
                const config = getStatusConfig(plant.status);
                const isUrgent = plant.status === 'critical';

                return (
                  <div key={plant.id} className={`bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all p-6 space-y-6 ${
                    isUrgent ? 'border-red-500/20 shadow-lg shadow-red-500/5' : 'border-slate-100 dark:border-slate-800'
                  }`}>
                    {/* Header: Plant Info */}
                    <div className="flex items-start gap-4">
                      <div className="size-20 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex-shrink-0">
                        <img src={plant.image} alt={plant.nickname} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                           <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${config.color}`}>
                             <span className="material-symbols-outlined text-xs">{config.icon}</span>
                             {config.label}
                           </span>
                           {isUrgent && (
                             <span className="animate-ping size-2 rounded-full bg-red-500"></span>
                           )}
                        </div>
                        <h4 className="text-lg font-black mt-2 truncate">{plant.nickname}</h4>
                        <p className="text-xs text-slate-500 font-bold italic truncate">{plant.species}</p>
                      </div>
                    </div>

                    {/* Care Stats */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Lần cuối tưới</p>
                        <p className={`text-sm font-black mt-0.5 ${isUrgent ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                          {plant.lastWatered}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Kế hoạch</p>
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200 mt-0.5">{plant.nextWatering}</p>
                      </div>
                    </div>

                    {/* Owner Info & Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <div className="size-8 rounded-full bg-[#4CAF50]/10 text-[#4CAF50] flex items-center justify-center font-black text-xs">
                             {plant.ownerName.charAt(0)}
                           </div>
                           <div className="min-w-0">
                             <p className="text-xs font-black truncate">{plant.ownerName}</p>
                             <p className="text-[10px] text-slate-500 truncate">{plant.ownerEmail}</p>
                           </div>
                        </div>
                        <a href={`tel:${plant.ownerPhone}`} className="p-2 bg-[#4CAF50]/10 text-[#4CAF50] rounded-xl hover:bg-[#4CAF50] hover:text-white transition-all">
                          <span className="material-symbols-outlined text-lg">phone</span>
                        </a>
                      </div>

                      <div className="flex gap-2">
                         <button className="flex-1 py-2.5 bg-[#4CAF50] text-white font-black text-xs rounded-xl hover:opacity-90 transition-opacity">
                           Xem hồ sơ cây
                         </button>
                         <button className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                           Gửi nhắc nhở
                         </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPlants.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-6xl text-slate-200">filter_list_off</span>
                <p className="text-slate-500 font-bold mt-4">Không tìm thấy cây nào phù hợp với bộ lọc này.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManageUserPlants;
