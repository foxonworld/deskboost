import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MOCK_USERS, 
  MOCK_MESSAGES, 
  MESSAGE_TYPE_CONFIG 
} from '../data/mockData';

const AdminMailManagement = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    type: 'custom',
    recipients: [], // array of user ids
    channel: 'both',
    content: ''
  });

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
    { name: 'User List', icon: 'group', path: '/app/admin/users' },
    { name: 'Manage Mail Messages', icon: 'mail', path: '/app/admin/messages', active: true },
    { name: 'Order Management', icon: 'shopping_bag', path: '/app/admin/orders' },
  ];

  const filteredMessages = useMemo(() => {
    if (activeFilter === 'all') return messages;
    return messages.filter(m => m.type === activeFilter);
  }, [messages, activeFilter]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.content || formData.recipients.length === 0) {
      alert('Vui lòng nhập đầy đủ thông tin (Tiêu đề, Nội dung và Người nhận)');
      return;
    }

    const recipientNames = formData.recipients.includes('all') 
      ? 'Tất cả người dùng' 
      : MOCK_USERS
          .filter(u => formData.recipients.includes(u.id))
          .map(u => u.fullName)
          .join(', ');

    const newMessage = {
      id: `msg-${Date.now()}`,
      ...formData,
      recipientNames,
      status: 'sent',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setMessages([newMessage, ...messages]);
    setIsComposeOpen(false);
    setFormData({ subject: '', type: 'custom', recipients: [], channel: 'both', content: '' });
  };

  const toggleRecipient = (uid) => {
    if (uid === 'all') {
      setFormData(prev => ({ ...prev, recipients: ['all'] }));
      return;
    }
    
    setFormData(prev => {
      let newReps = prev.recipients.filter(r => r !== 'all');
      if (newReps.includes(uid)) {
        newReps = newReps.filter(r => r !== uid);
      } else {
        newReps = [...newReps, uid];
      }
      return { ...prev, recipients: newReps };
    });
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
            <h2 className="text-xl font-black italic tracking-tight">Mail Messages</h2>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsComposeOpen(true)}
               className="flex items-center gap-2 px-6 py-2.5 bg-[#4CAF50] text-white rounded-xl font-black text-sm shadow-lg shadow-[#4CAF50]/20 hover:scale-[1.02] active:scale-95 transition-all"
             >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Soạn tin nhắn mới
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f8faf9] dark:bg-[#0c1614] p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Tổng tin nhắn</p>
                  <h3 className="text-2xl font-black mt-2">{messages.length}</h3>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-emerald-500">Đã gửi thành công</p>
                  <h3 className="text-2xl font-black mt-2 text-emerald-500">{messages.filter(m => m.status === 'sent').length}</h3>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-amber-500">Đang chờ (Pending)</p>
                  <h3 className="text-2xl font-black mt-2 text-amber-500">{messages.filter(m => m.status === 'pending').length}</h3>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-pink-500">Khuyến mãi</p>
                  <h3 className="text-2xl font-black mt-2 text-pink-500">{messages.filter(m => m.type === 'promotional').length}</h3>
               </div>
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex gap-4">
                    {['all', 'promotional', 'update', 'care-tip', 'custom'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setActiveFilter(t)}
                        className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${
                          activeFilter === t 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                          : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {t === 'all' ? 'Tất cả' : MESSAGE_TYPE_CONFIG[t].label}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="overflow-x-auto font-display">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <th className="px-6 py-4">Tiêu đề & Nội dung</th>
                       <th className="px-6 py-4 text-center">Người nhận</th>
                       <th className="px-6 py-4">Kênh</th>
                       <th className="px-6 py-4">Ngày gửi</th>
                       <th className="px-6 py-4 text-right">Trạng thái</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {filteredMessages.map(msg => (
                       <tr key={msg.id} className="hover:bg-slate-50/30 transition-colors group">
                         <td className="px-6 py-5 max-w-sm">
                            <div className="flex items-center gap-3 mb-2">
                               <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${MESSAGE_TYPE_CONFIG[msg.type].color}`}>
                                 {MESSAGE_TYPE_CONFIG[msg.type].label}
                               </span>
                            </div>
                            <h4 className="text-sm font-black truncate">{msg.subject}</h4>
                            <p className="text-[11px] text-slate-500 truncate mt-1 italic">{msg.content}</p>
                         </td>
                         <td className="px-6 py-5 text-center">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                               {msg.recipientNames}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-1.5 text-slate-500">
                               {msg.channel === 'email' || msg.channel === 'both' ? <span className="material-symbols-outlined text-sm">mail</span> : null}
                               {msg.channel === 'notification' || msg.channel === 'both' ? <span className="material-symbols-outlined text-sm">notifications</span> : null}
                               <span className="text-[10px] font-black uppercase tracking-widest">{msg.channel}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5 text-xs text-slate-500 font-bold whitespace-nowrap">
                            {msg.createdAt}
                         </td>
                         <td className="px-6 py-5 text-right">
                           <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${
                             msg.status === 'sent' ? 'text-emerald-500 bg-emerald-50' : 
                             msg.status === 'pending' ? 'text-amber-500 bg-amber-50' : 'text-red-500 bg-red-50'
                           }`}>
                             {msg.status.toUpperCase()}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>

        {/* Compose Modal */}
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10 flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30">
                   <div>
                      <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 italic">
                         <span className="material-symbols-outlined text-emerald-500 text-3xl">send</span>
                         Soạn tin nhắn mới
                      </h3>
                      <p className="text-xs text-slate-500 font-bold mt-1">Gửi thông báo tới người dùng hệ thống</p>
                   </div>
                   <button onClick={() => setIsComposeOpen(false)} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400 font-bold">
                     <span className="material-symbols-outlined">close</span>
                   </button>
                </div>

                <form onSubmit={handleSendMessage} className="p-8 space-y-6 overflow-y-auto">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại tin nhắn</label>
                         <select 
                           value={formData.type}
                           onChange={e => setFormData({...formData, type: e.target.value})}
                           className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-[#4CAF50]/30 rounded-2xl outline-none font-bold text-sm transition-all"
                         >
                            <option value="custom">Tin nhắn tùy chỉnh</option>
                            <option value="promotional">Khuyến mãi / Marketing</option>
                            <option value="update">Cập nhật hệ thống</option>
                            <option value="care-tip">Hướng dẫn chăm sóc</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kênh gửi</label>
                         <select 
                           value={formData.channel}
                           onChange={e => setFormData({...formData, channel: e.target.value})}
                           className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-[#4CAF50]/30 rounded-2xl outline-none font-bold text-sm transition-all"
                         >
                            <option value="both">Email & Notification</option>
                            <option value="email">Chỉ Gửi Email</option>
                            <option value="notification">Chỉ App Notification</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Người nhận (Multiple Select)</label>
                      <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent">
                         <button 
                           type="button"
                           onClick={() => toggleRecipient('all')}
                           className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${
                             formData.recipients.includes('all') ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                           }`}
                         >
                            Gửi tất cả
                         </button>
                         {MOCK_USERS.filter(u => u.role === 'user').map(u => (
                           <button 
                             key={u.id}
                             type="button"
                             onClick={() => toggleRecipient(u.id)}
                             className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${
                               formData.recipients.includes(u.id) ? 'bg-[#4CAF50] text-white' : 'bg-slate-200 text-slate-500'
                             }`}
                           >
                              {u.fullName}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiêu đề tin nhắn</label>
                      <input 
                        type="text" 
                        placeholder="Nhập tiêu đề hấp dẫn..."
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-[#4CAF50]/30 rounded-2xl outline-none font-bold text-sm transition-all"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung chi tiết</label>
                      <textarea 
                        rows="4"
                        placeholder="Nội dung gửi tới người dùng..."
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-[#4CAF50]/30 rounded-2xl outline-none font-bold text-sm transition-all resize-none"
                      ></textarea>
                   </div>

                   <div className="pt-4 flex gap-4">
                      <button 
                        type="submit"
                        className="flex-1 py-4 bg-[#4CAF50] text-white font-black rounded-2xl shadow-xl shadow-[#4CAF50]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
                      >
                         Phát tin nhắn ngay
                      </button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMailManagement;
