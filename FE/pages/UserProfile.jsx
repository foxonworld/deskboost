import React from 'react';
import UserLayout from '../components/UserLayout';

const UserProfile = () => {
  return (
    <UserLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-10 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Hồ sơ người dùng</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg italic">Nâng tầm nghệ thuật chăm sóc cây cảnh trong nhà.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Hủy bỏ</button>
            <button className="px-8 py-3 rounded-2xl bg-[#4CAF50] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4CAF50]/20 hover:scale-105 active:scale-95 transition-all">Lưu thay đổi</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Identity Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#4CAF50]"></div>
              <div className="relative inline-block mb-6">
                <div className="size-36 rounded-full border-4 border-[#4CAF50] p-1.5 shadow-2xl">
                  <img alt="User Profile" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwtOPjZ2-FOeAcMDcmIhMcUzzaLNQrs8BptWKABgS5XBqaKTZ9fURtN5btwU4zbVYIL9zXEttn-r1pqc96x16chz_YvxcevznFXhcFmnNTwdqsmygM0C4eP48o0LjWtDBYoG_kCbm2l3ErAZzMZbm94A5gpamq_7gX44kFE0ZbPWazZhOAPEusmYenNzdAQxOAzdd2HIadO3xpslF6ZWnbNMrD0llQhqRHltEjAaHT7O5Wyrtxa0DEs_JNU-_CcX717MUC9dFat04"/>
                </div>
                <button className="absolute bottom-2 right-2 size-10 bg-slate-900 text-white rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center hover:bg-[#4CAF50] transition-colors">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Alex Gardener</h3>
              <p className="text-[#4CAF50] font-black text-[10px] uppercase tracking-[0.2em] mb-8">Chuyên gia trồng cây • Cấp 04</p>
              
              <div className="space-y-6 text-left pt-8 border-t border-slate-50 dark:border-slate-800">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Địa chỉ Email</label>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">alex.gardener@deskboost.ai</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Thành viên từ</label>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">2024.Q1</p>
                </div>
              </div>
            </div>

            <div className="bg-[#4CAF50] p-8 rounded-[40px] text-white shadow-xl shadow-[#4CAF50]/20">
               <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-3xl">star_half</span>
                  <p className="text-xs font-black uppercase tracking-widest">Tiến trình phát triển</p>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                     <span>Độ thuần thục</span>
                     <span>85%</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white w-[85%]"></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm space-y-10">
              <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <span className="size-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[#4CAF50]">
                    <span className="material-symbols-outlined text-sm">badge</span>
                  </span>
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên hiển thị</label>
                    <input className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/5 outline-none" type="text" defaultValue="Alex Gardener"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liên lạc</label>
                    <input className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/5 outline-none" type="email" defaultValue="alex.gardener@deskboost.ai"/>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Châm ngôn yêu cây</label>
                    <textarea className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/5 outline-none resize-none" placeholder="Ngôn ngữ thầm lặng của cây cối..." rows={4}></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-8 pt-10 border-t border-slate-50 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <span className="size-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[#4CAF50]">
                    <span className="material-symbols-outlined text-sm">security</span>
                  </span>
                  Khóa bảo mật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu hiện tại</label>
                    <input className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold" type="password" defaultValue="********"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu mới</label>
                    <input className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-6 text-sm font-bold" placeholder="Nhập mật khẩu mới..." type="password"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfile;
