
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatbotWidget from '../components/ChatbotWidget';
import { PLANTS } from '../data/mockData';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-slate-100">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-20">
          <div className="flex flex-col-reverse gap-8 md:gap-12 md:flex-row items-center">
            <div className="flex flex-col gap-6 flex-1 text-center md:text-left items-center md:items-start">
              <h1 className="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Green plants for <span className="text-primary">busy workspaces</span>
              </h1>
              <h2 className="text-text-secondary dark:text-slate-400 text-lg md:text-xl font-medium max-w-xl">
                Low-maintenance greenery delivered to your desk. Managed by AI, enjoyed by you.
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/plants" className="flex w-full sm:w-auto min-w-[160px] h-12 items-center justify-center rounded-xl bg-primary px-6 text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
                  View Plants
                </Link>
                <button className="flex w-full sm:w-auto min-w-[160px] h-12 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 text-text-main dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  How it Works
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-3/5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzaus0c0LOhf2NX2DHlSrgoj7WJftqhZWnq2AaXvZGH_juFX-tzXsGtxKpiUTKI7o1qep8M-_mblF5fLwbfUAZBkbXNAwgdif6Fbd_TTDmR3Fn4bwl0C_sxr66ytyPsaniXtPwZovv8Jj2hG-6jQRdKjFy4Qi9xY456Jx4mhj-YhMXZQom8xGz0E9YuDuNOy_Q7EbzlxZ1eDTQLLSET3rEsIWX0QNNd0-56C2eO61nuFnUF_4wxoXrJY9-HR7VgsF4XTBDdH0Ytpg" 
                  className="w-full h-full object-cover" 
                  alt="Workspace plants" 
                />
                <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-xl p-4 shadow-xl border border-white/20 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg">water_drop</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-main dark:text-white">Thirsty!</p>
                      <p className="text-[10px] text-text-secondary dark:text-slate-400">Snake Plant • Desk 2</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 w-[20%]"></div>
                  </div>
                  <p className="text-[10px] text-right mt-1 text-red-500 font-medium">Needs water today</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why DeskBoost Section */}
        <section className="bg-white dark:bg-slate-900 py-16 md:py-24 border-y border-gray-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4 dark:text-white">Why DeskBoost?</h2>
              <p className="text-text-secondary dark:text-slate-400 text-lg max-w-xl mx-auto">Designed for the modern professional who loves nature but lacks the time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'verified_user', title: 'Hard to Kill', text: 'Curated species that thrive in low light and irregular watering schedules common in offices.' },
                { icon: 'desk', title: 'Desk Ready', text: 'Compact, leak-proof pots designed specifically for modern workstations and limited space.' },
                { icon: 'smart_toy', title: 'AI Plant Doctor', text: 'Snap a photo anytime. Our AI instantly diagnoses issues and tells you exactly what to do.' }
              ].map((f, i) => (
                <div key={i} className="group p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all hover:border-primary/30">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{f.title}</h3>
                  <p className="text-text-secondary dark:text-slate-400 text-base leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Favorites Carousel Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Desk Favorites</h2>
            <Link to="/plants" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-6 pb-4">
            {PLANTS.map((p) => (
              <Link to={`/plants/${p.id}`} key={p.id} className="flex flex-col min-w-[280px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold dark:text-white">{p.name}</h3>
                    <span className="text-primary font-bold">${p.price}</span>
                  </div>
                  <button className="w-full h-11 rounded-xl bg-gray-100 dark:bg-slate-800 text-text-main dark:text-white text-sm font-bold hover:bg-primary hover:text-white transition-all">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-12 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary font-bold">potted_plant</span>
            <span className="text-lg font-bold dark:text-white">DeskBoost</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-text-secondary dark:text-slate-400">
            <a href="#" className="hover:text-primary">Support</a>
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500">© 2024 DeskBoost Inc. All plants reserved.</p>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
};

export default Home;
