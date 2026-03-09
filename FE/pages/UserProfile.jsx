import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 flex-col lg:flex-row max-w-[1440px] mx-auto w-full px-4 md:px-10 py-8 gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex flex-col gap-2">
          <Link to="/app/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
            <span className="material-symbols-outlined">dashboard</span>
            <p className="text-sm font-semibold">Dashboard</p>
          </Link>
          <Link to="/app/my-plants" className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
            <span className="material-symbols-outlined">potted_plant</span>
            <p className="text-sm font-semibold">My Collection</p>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
            <span className="material-symbols-outlined">history</span>
            <p className="text-sm font-semibold">Care History</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-primary text-slate-900">
            <span className="material-symbols-outlined">person</span>
            <p className="text-sm font-semibold">User Profile</p>
          </div>
          <hr className="my-4 border-slate-200 dark:border-slate-800"/>
          <div className="bg-primary/10 p-4 rounded-xl">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Plant Pro Tip</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">Monstera plants love bright, indirect light. Rotate every month for even growth!</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-8">
          {/* Page Title & Basic Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Profile</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your account and track your gardening journey.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center rounded-xl h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm">
                Discard Changes
              </button>
              <button className="flex items-center justify-center rounded-xl h-10 px-6 bg-primary text-slate-900 font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Save Profile Changes
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total plants owned</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">14</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined">health_and_safety</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Diagnoses performed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">32</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined">task_alt</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Care activities</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">128</p>
              </div>
            </div>
          </div>

          {/* Account Information & Edit Form */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left: Profile Overview */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="relative inline-block mx-auto mb-4">
                  <div className="size-32 rounded-full border-4 border-primary p-1 overflow-hidden">
                    <img alt="User Profile" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwtOPjZ2-FOeAcMDcmIhMcUzzaLNQrs8BptWKABgS5XBqaKTZ9fURtN5btwU4zbVYIL9zXEttn-r1pqc96x16chz_YvxcevznFXhcFmnNTwdqsmygM0C4eP48o0LjWtDBYoG_kCbm2l3ErAZzMZbm94A5gpamq_7gX44kFE0ZbPWazZhOAPEusmYenNzdAQxOAzdd2HIadO3xpslF6ZWnbNMrD0llQhqRHltEjAaHT7O5Wyrtxa0DEs_JNU-_CcX717MUC9dFat04"/>
                  </div>
                  <button className="absolute bottom-0 right-0 size-10 bg-primary text-slate-900 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">camera_alt</span>
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Alex Gardener</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Master Planter Level 4</p>
                <div className="space-y-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">alex.gardener@email.com</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Created</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">January 14, 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Edit Form */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Personal Details */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
                    <input className="rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary p-2" type="text" defaultValue="Alex Gardener"/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input className="rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary p-2" type="email" defaultValue="alex.gardener@email.com"/>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gardening Bio</label>
                    <textarea className="rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary p-2" placeholder="Tell us about your green thumb..." rows={3}></textarea>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security</h3>
                  <button className="text-primary text-sm font-bold hover:underline">Forgot password?</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                    <input className="rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary p-2" type="password" defaultValue="********"/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                    <input className="rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-primary p-2" placeholder="Enter new password" type="password"/>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-slate-900 dark:bg-primary dark:text-slate-900 text-white font-bold text-sm transition-opacity hover:opacity-90">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">water_drop</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Watering Reminders</p>
                        <p className="text-xs text-slate-500">Get push notifications when plants need water</p>
                      </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Monthly Digest</p>
                        <p className="text-xs text-slate-500">Email summary of your collection's health</p>
                      </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 px-4 md:px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-primary rounded flex items-center justify-center text-slate-900">
              <span className="material-symbols-outlined text-sm">potted_plant</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">DeskBoost</p>
          </div>
          <div className="flex gap-8">
            <a className="text-slate-500 hover:text-primary text-sm transition-colors" href="#">Privacy Policy</a>
            <a className="text-slate-500 hover:text-primary text-sm transition-colors" href="#">Terms of Service</a>
            <a className="text-slate-500 hover:text-primary text-sm transition-colors" href="#">Help Center</a>
          </div>
          <p className="text-slate-400 text-xs">© 2024 DeskBoost Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;
