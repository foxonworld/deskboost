import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddPlantUser = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 dark:bg-[#10221f] text-slate-900 dark:text-slate-100 min-h-screen font-['Manrope']">
      <div className="flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-[#2beecd] p-1.5 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#10221f]">potted_plant</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tight">DeskBoost</h1>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <button onClick={() => navigate('/app/dashboard')} className="text-sm font-semibold hover:text-[#2beecd] transition-colors">Dashboard</button>
                <button onClick={() => navigate('/app/my-plants')} className="text-sm font-semibold text-[#2beecd] transition-colors">My Plants</button>
                <button className="text-sm font-semibold hover:text-[#2beecd] transition-colors">Care Guide</button>
                <button className="text-sm font-semibold hover:text-[#2beecd] transition-colors">Settings</button>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-[#2beecd]/50" placeholder="Search plants..." type="text"/>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200 dark:border-slate-800">
                <img alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1elVyVTBi9c3THuwP-bSh35iQtZee5F5zT_EC6c4KMZ1B02GIX1ZQdXMnA1V0W5XobmhOtsg9ZN-hwR2QBGvoBCRu5ygDyACKTvjrqFLJgjGXttYGeM32tbnw0Fmk21r92VfnKj_H-6grQFC7SRWjszU4SEYUkeKUfkcA0oBThpgVINpBvDgkb9cFBzyS8j49WP0fFRoFreyISd5LYv04XvTykEG8FvFQnfcirQopWKMulgcbaMdGyX-fcEdMHl17o5fKscwde8M"/>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-start py-12 px-4">
          <div className="max-w-4xl w-full">
            {/* Page Header */}
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-4xl font-extrabold tracking-tight mb-2">Add New Plant</h2>
              <p className="text-slate-500 dark:text-slate-400">Expand your green workspace with a new botanical companion.</p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row">
                {/* Left: Image Preview */}
                <div className="lg:w-1/3 bg-[#2beecd]/10 relative min-h-[300px] lg:min-h-full">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg mb-4 w-full aspect-square flex items-center justify-center">
                      <img alt="Plant Preview" className="rounded-lg object-cover h-full w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5UtIT4zAbJXsJSg4fCceVRDiOzTB1Upekt9ZNC4QsKHJRmRSAtsKi1C6WYZgj3_8BwgbdazgDGygYIILcVU2wVLBwncGx63Ecc72ci7ny6HMAMMV1a-1WY-iJUiWH4LOPU7EwIoZoWTIIJnxtWvQMdKx2FK52PHPn_OrI8Vm6DoJeiM_9DbiKyTkXkPX5lZHnp9oYSDh-k7odTspkCkE2V1JiZuUKNrmf6AlBBjk4_7_WpQoVQXAWHXnaU52lYFFgB5562zEko_I"/>
                    </div>
                    <div className="text-[#2beecd] font-bold text-sm tracking-wide uppercase">Preview</div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-2">Selecting a plant will update this view</p>
                  </div>
                </div>

                {/* Right: Form Fields */}
                <div className="lg:w-2/3 p-8 md:p-12">
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Plant Selector */}
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">Select Plant Type</label>
                      <div className="relative">
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 appearance-none focus:ring-2 focus:ring-[#2beecd]/50 focus:border-[#2beecd] outline-none transition-all">
                          <option value="">Search the plant library...</option>
                          <option selected value="monstera">Monstera Deliciosa</option>
                          <option value="snake">Snake Plant (Sansevieria)</option>
                          <option value="pothos">Golden Pothos</option>
                          <option value="fiddle">Fiddle Leaf Fig</option>
                          <option value="zz">ZZ Plant</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">unfold_more</span>
                      </div>
                    </div>

                    {/* Nickname */}
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">Plant Nickname</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#2beecd]/50 focus:border-[#2beecd] outline-none transition-all" placeholder="e.g. Monty the Monstera" type="text"/>
                    </div>

                    {/* Location and Customization Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">Placement</label>
                        <div className="relative">
                          <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 appearance-none focus:ring-2 focus:ring-[#2beecd]/50 focus:border-[#2beecd] outline-none transition-all">
                            <option value="home">Home Desk</option>
                            <option value="office">Office Desk</option>
                            <option value="balcony">Balcony</option>
                            <option value="living">Living Room</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">location_on</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">Reminders</label>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 h-[50px]">
                          <span className="material-symbols-outlined text-[#2beecd]">notifications_active</span>
                          <span className="text-sm font-medium">Smart Care Alerts</span>
                          <input defaultChecked className="ml-auto w-5 h-5 rounded border-slate-300 text-[#2beecd] focus:ring-[#2beecd]" type="checkbox"/>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">Notes (Optional)</label>
                      <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#2beecd]/50 focus:border-[#2beecd] outline-none transition-all resize-none" placeholder="Add details about sunlight, specific soil, or memories..." rows={3}></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                      <button onClick={() => navigate('/app/my-plants')} className="w-full sm:flex-1 bg-[#2beecd] text-[#10221f] font-extrabold py-4 rounded-xl hover:brightness-105 transition-all shadow-lg shadow-[#2beecd]/20 flex items-center justify-center gap-2" type="submit">
                        <span className="material-symbols-outlined">add_circle</span>
                        Add Plant
                      </button>
                      <button onClick={() => navigate('/app/my-plants')} className="w-full sm:w-auto px-8 py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-colors" type="button">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Quick Help / Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-[#2beecd]">lightbulb</span>
                <div>
                  <h4 className="text-sm font-bold">Pro Tip</h4>
                  <p className="text-xs text-slate-500">Most desktop plants prefer indirect light. Avoid direct noon sun.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-[#2beecd]">water_drop</span>
                <div>
                  <h4 className="text-sm font-bold">Smart Watering</h4>
                  <p className="text-xs text-slate-500">We'll calculate the watering schedule based on your office humidity.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-[#2beecd]">auto_awesome</span>
                <div>
                  <h4 className="text-sm font-bold">Library Access</h4>
                  <p className="text-xs text-slate-500">Browse 200+ species with detailed care requirements in our library.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Simple Footer */}
        <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
            <p>© 2024 DeskBoost Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-[#2beecd]" href="#">Privacy Policy</a>
              <a className="hover:text-[#2beecd]" href="#">Terms of Service</a>
              <a className="hover:text-[#2beecd]" href="#">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AddPlantUser;
