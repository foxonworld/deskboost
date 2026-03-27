
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatbotWidget from '../components/ChatbotWidget';
import { useCare } from '../context/CareContext';
import { useNavigate } from 'react-router-dom';
import { PLANTS, formatVND, MOCK_ALL_USER_PLANTS } from '../data/mockData';

const Home = () => {
  const { pendingTasks } = useCare();
  const navigate = useNavigate();
  const [activeActivityIndex, setActiveActivityIndex] = React.useState(0);

  // Cycle through activities (Pending Tasks from CareContext)
  React.useEffect(() => {
    if (pendingTasks.length <= 1) return;
    const interval = setInterval(() => {
      setActiveActivityIndex((prev) => (prev + 1) % pendingTasks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [pendingTasks.length]);

  const currentTask = pendingTasks[activeActivityIndex] || {
    plantName: 'Cây của bạn',
    taskLabel: 'Theo dõi sức khỏe',
    dueTime: 'Hằng ngày',
    urgency: 'upcoming',
    plantEmoji: '🌿',
    plantPath: '/plants'
  };

  const urgencyConfig = {
    overdue: { color: 'text-red-500', bg: 'bg-red-500', label: 'Trễ hạn', icon: 'notification_important' },
    today: { color: 'text-amber-500', bg: 'bg-amber-500', label: 'Hôm nay', icon: 'schedule' },
    upcoming: { color: 'text-blue-500', bg: 'bg-blue-400', label: 'Sắp tới', icon: 'event' },
  };

  const cfg = urgencyConfig[currentTask.urgency] || urgencyConfig.upcoming;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main font-display antialiased">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-4 md:px-10 py-12 md:py-20 text-text-main dark:text-white">
          <div className="flex flex-col-reverse gap-8 md:gap-12 md:flex-row items-center">
            {/* Hero Content */}
            <div className="flex flex-col gap-6 flex-1 text-center md:text-left items-center md:items-start">
              <div className="flex flex-col gap-4">
                <h1 className="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                  Cây xanh cho <span className="text-primary">không gian làm việc</span>
                </h1>
                <h2 className="text-text-secondary dark:text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                  Cây cảnh dễ chăm sóc giao tận bàn làm việc. Quản lý bởi AI, tận hưởng bởi bạn.
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/plants" className="flex w-full sm:w-auto min-w-[160px] h-12 items-center justify-center rounded-lg bg-primary px-6 text-text-main text-base font-bold shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200">
                  Xem Sản Phẩm
                </Link>
                <button
                  onClick={() => navigate('/reminders-settings')}
                  className="flex w-full sm:w-auto min-w-[160px] h-12 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark px-6 text-text-main dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Lịch chăm sóc
                </button>
              </div>
            </div>
            {/* Hero Image */}
            <div className="w-full md:w-1/2 lg:w-3/5 flex justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAzaus0c0LOhf2NX2DHlSrgoj7WJftqhZWnq2AaXvZGH_juFX-tzXsGtxKpiUTKI7o1qep8M-_mblF5fLwbfUAZBkbXNAwgdif6Fbd_TTDmR3Fn4bwl0C_sxr66ytyPsaniXtPwZovv8Jj2hG-6jQRdKjFy4Qi9xY456Jx4mhj-YhMXZQom8xGz0E9YuDuNOy_Q7EbzlxZ1eDTQLLSET3rEsIWX0QNNd0-56C2eO61nuFnUF_4wxoXrJY9-HR7VgsF4XTBDdH0Ytpg')" }}
                />
                
                {/* Floating Activity Card (Synced with CareContext) */}
                <button 
                  onClick={() => navigate('/reminders-settings')}
                  className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-64 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl p-4 shadow-xl hover:scale-[1.03] active:scale-95 transition-all animate-in slide-in-from-bottom-5 duration-700 group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-white/60 dark:bg-slate-800/60 rounded-xl flex items-center justify-center text-lg shadow-sm">
                      {currentTask.plantEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center pr-1">
                        <p className={`text-[10px] font-black uppercase tracking-[0.1em] ${cfg.color}`}>{cfg.label}</p>
                        <span className={`size-1.5 rounded-full ${currentTask.urgency === 'overdue' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></span>
                      </div>
                      <p className="text-xs font-black text-slate-800 dark:text-white truncate">{currentTask.plantName}</p>
                      <p className="text-[10px] text-slate-500 font-bold italic truncate">{currentTask.taskLabel} · {currentTask.dueTime}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                     <span className="text-[9px] font-black text-slate-400 group-hover:text-[#4CAF50] transition-colors">Bấm để quản lý</span>
                     <span className="material-symbols-outlined text-sm text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="w-full bg-surface-light dark:bg-surface-dark py-16 md:py-24 border-y border-[#f0f4f2] dark:border-[#1e3a29]">
          <div className="w-full max-w-7xl px-4 md:px-10 mx-auto">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4 text-center items-center">
                <h2 className="text-text-main dark:text-white text-3xl md:text-4xl font-black tracking-tight max-w-2xl">
                  Tại sao chọn DeskBoost?
                </h2>
                <p className="text-text-secondary dark:text-gray-300 text-lg font-normal max-w-xl">
                  Thiết kế dành cho những chuyên gia hiện đại yêu thiên nhiên nhưng ít thời gian.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {[
                  { icon: 'verified_user', title: 'Siêu bền bỉ', text: 'Tuyển chọn các loại cây phát triển tốt trong ánh sáng yếu và lịch tưới nước không đều.' },
                  { icon: 'desk', title: 'Sẵn sàng bày bàn', text: 'Chậu cây nhỏ gọn, chống rò rỉ nước được thiết kế dành riêng cho bàn làm việc hiện đại.' },
                  { icon: 'smart_toy', title: 'Bác sĩ cây trồng AI', text: 'Chụp ảnh bất cứ lúc nào. AI của chúng tôi sẽ chẩn đoán ngay lập tức và hướng dẫn bạn.' }
                ].map((f, i) => (
                  <div key={i} className="group flex flex-col gap-4 rounded-xl border border-[#dbe6df] dark:border-gray-700 bg-white dark:bg-background-dark p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-text-main dark:text-white text-xl font-bold">{f.title}</h3>
                      <p className="text-text-secondary dark:text-gray-400 text-base leading-relaxed">{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Favorites Carousel Section */}
        <section className="w-full max-w-7xl px-4 md:px-10 py-16 md:py-24">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-text-main dark:text-white text-2xl md:text-3xl font-bold tracking-tight">Sản phẩm yêu thích</h2>
              <Link to="/plants" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="flex overflow-x-auto no-scrollbar pb-8 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex gap-6">
                {PLANTS.map((p) => (
                  <div key={p.id} className="flex flex-col gap-0 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm w-[280px] group overflow-hidden">
                    <Link to={`/plants/${p.id}`} className="w-full aspect-[4/5] bg-gray-100 relative overflow-hidden">
                      <img 
                        src={p.image} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={p.name} 
                      />
                      {p.id === 1 && <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 px-2 py-1 rounded text-xs font-bold backdrop-blur">Best Seller</div>}
                    </Link>
                    <div className="flex flex-col p-5 gap-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-text-main dark:text-white text-lg font-bold">{p.name}</h3>
                          <span className="text-primary font-bold">{formatVND(p.price)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-text-secondary dark:text-gray-400 text-sm">
                          <span className="material-symbols-outlined text-sm">
                            {p.id % 2 === 0 ? 'water_drop' : 'dark_mode'}
                          </span>
                          <span>{p.id % 2 === 0 ? 'Chịu hạn tốt' : 'Ưa bóng râm'}</span>
                        </div>
                      </div>
                      <button className="w-full h-10 rounded-lg bg-[#f0f4f2] dark:bg-gray-700 text-text-main dark:text-white text-sm font-bold hover:bg-primary hover:text-text-main transition-colors">
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-slate-900 text-white pt-20 pb-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          
          {/* Brand & Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-primary">potted_plant</span>
              <span className="text-2xl font-black tracking-tighter uppercase italic">DeskBoost</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Đưa thiên nhiên vào không gian làm việc của bạn với sự hỗ trợ từ trí tuệ nhân tạo. Chăm sóc cây chưa bao giờ dễ dàng và chuyên nghiệp đến thế.
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-4 group">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Người sáng lập</p>
                    <p className="text-sm font-bold">Nguyễn Anh</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all">
                    <span className="material-symbols-outlined text-xl">phone</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Liên hệ SĐT</p>
                    <p className="text-sm font-bold">0345674779</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email phản hồi</p>
                    <p className="text-sm font-bold">nguyenanh.x724@gmail.com</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Sản phẩm</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li><Link to="/plants" className="hover:text-primary transition-colors">Trong nhà</Link></li>
                <li><Link to="/plants" className="hover:text-primary transition-colors">Ngoài trời</Link></li>
                <li><Link to="/plants" className="hover:text-primary transition-colors">Sen đá</Link></li>
                <li><Link to="/plants" className="hover:text-primary transition-colors">Combo quà tặng</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Cộng đồng</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Blog cây trồng</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cộng đồng DeskBoost</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tuyển dụng</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/50 p-8 rounded-[32px] border border-slate-700/50 backdrop-blur-sm">
              <h4 className="text-xl font-black mb-1">Gửi phản hồi cho chúng tôi</h4>
              <p className="text-slate-400 text-xs font-bold mb-6">Báo cáo sự cố hoặc yêu cầu hỗ trợ nhanh nhất</p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn phản hồi của bạn! Chúng tôi sẽ liên hệ lại sớm.'); }}>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Tên của bạn" 
                    className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    required
                  />
                </div>
                <textarea 
                  rows="3" 
                  placeholder="Vấn đề bạn đang gặp phải..." 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                  required
                ></textarea>
                <button className="w-full bg-primary text-slate-900 font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  Gửi yêu cầu ngay
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-bold">© 2024 DeskBoost Inc. Được phát triển bởi {pendingTasks.length >= 0 ? "Nguyễn Anh" : "Nguyễn Anh"}.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
             <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
             <a href="#" className="hover:text-white transition-colors">Cookie settings</a>
          </div>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
};

export default Home;
