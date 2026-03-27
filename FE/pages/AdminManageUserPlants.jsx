import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_ALL_USER_PLANTS } from '../data/mockData';

const AdminManageUserPlants = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // all, critical, sick, healthy
  const [searchTerm, setSearchTerm] = useState('');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [reminderForm, setReminderForm] = useState({
    message: '',
    channel: 'notification', // notification, email, both
  });
  const [isSending, setIsSending] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const menuItems = [
    { name: 'Tổng quan Dashboard', icon: 'dashboard', path: '/app/admin' },
    { name: 'Quản lý cửa hàng', icon: 'storefront', path: '/app/admin/plants' },
    { name: 'Quản lý tài chính', icon: 'account_balance_wallet', path: '/app/admin/financials' },
    { name: 'Bản đồ cây người dùng', icon: 'potted_plant', path: '/app/admin/user-plants', active: true },
    { name: 'Danh sách người dùng', icon: 'group', path: '/app/admin/users' },
    { name: 'Quản lý tin nhắn', icon: 'mail', path: '/app/admin/messages' },
    { name: 'Quản lý đơn hàng', icon: 'shopping_bag', path: '/app/admin/orders' },
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

  const handleViewProfile = (plantId) => {
    // Navigate to the plant profile page
    // Note: In a real app, this would be an admin view or the user-facing profile
    navigate(`/app/my-plants/${plantId}/profile`);
  };

  const openReminderModal = (plant) => {
    setSelectedPlant(plant);
    setReminderForm({
      message: `Chào ${plant.ownerName}, cây ${plant.nickname} của bạn đang ở trạng thái ${getStatusConfig(plant.status).label}. Bạn hãy kiểm tra lại chế độ chăm sóc nhé!`,
      channel: 'notification'
    });
    setIsReminderModalOpen(true);
  };

  const handleSendReminder = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Sending reminder:', {
      plantId: selectedPlant.id,
      ownerEmail: selectedPlant.ownerEmail,
      ...reminderForm
    });
    
    setIsSending(false);
    setIsReminderModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
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
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Bảng điều khiển Admin</p>
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
            <span className="text-sm font-semibold">Cài đặt</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left">
            <span className="material-symbols-outlined font-normal">logout</span>
            <span className="text-sm font-semibold">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-slate-900 dark:text-slate-100">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black">Theo dõi sức khỏe</h2>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-3">
               <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                 <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                 {stats.critical} Nguy kịch
               </span>
               <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                 <span className="size-2 rounded-full bg-amber-500"></span>
                 {stats.unhealthy} Vấn đề
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
                         <button 
                           onClick={() => handleViewProfile(plant.id)}
                           className="flex-1 py-2.5 bg-[#4CAF50] text-white font-black text-xs rounded-xl hover:opacity-90 transition-opacity"
                         >
                           Xem hồ sơ cây
                         </button>
                         <button 
                           onClick={() => openReminderModal(plant)}
                           className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-center"
                         >
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

        {/* Reminder Modal */}
        {isReminderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-[#4CAF50]/10 text-[#4CAF50] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">campaign</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Gửi nhắc nhở</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{selectedPlant?.nickname} • {selectedPlant?.ownerName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsReminderModalOpen(false)}
                  className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSendReminder} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phương thức gửi</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'notification', label: 'Thông báo', icon: 'notifications' },
                      { id: 'email', label: 'Email', icon: 'mail' },
                      { id: 'both', label: 'Cả hai', icon: 'all_inclusive' },
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setReminderForm({ ...reminderForm, channel: method.id })}
                        className={`py-3 px-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                          reminderForm.channel === method.id 
                            ? 'border-[#4CAF50] bg-[#4CAF50]/5 text-[#4CAF50]' 
                            : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{method.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-tight">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nội dung nhắc nhở</label>
                  <textarea 
                    rows="4"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#4CAF50]/50 outline-none resize-none"
                    placeholder="Nhập nội dung nhắc nhở..."
                    value={reminderForm.message}
                    onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsReminderModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="flex-1 py-4 bg-[#4CAF50] text-white font-black text-xs rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-[#4CAF50]/20 uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi ngay'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed bottom-8 right-8 z-[110] animate-in slide-in-from-right-full duration-500">
            <div className="bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
              <div className="size-8 rounded-full bg-[#4CAF50] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight">Đã gửi nhắc nhở</p>
                <p className="text-xs text-slate-400 font-bold">Yêu cầu của bạn đang được xử lý.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminManageUserPlants;
