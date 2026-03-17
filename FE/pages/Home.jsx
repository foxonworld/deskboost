
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatbotWidget from '../components/ChatbotWidget';
import { PLANTS } from '../data/mockData';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main font-display antialiased">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-4 md:px-10 py-12 md:py-20">
          <div className="flex flex-col-reverse gap-8 md:gap-12 md:flex-row items-center">
            {/* Hero Content */}
            <div className="flex flex-col gap-6 flex-1 text-center md:text-left items-center md:items-start">
              <div className="flex flex-col gap-4">
                <h1 className="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                  Green plants for <span className="text-primary">busy workspaces</span>
                </h1>
                <h2 className="text-text-secondary dark:text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                  Low-maintenance greenery delivered to your desk. Managed by AI, enjoyed by you.
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/plants" className="flex w-full sm:w-auto min-w-[160px] h-12 items-center justify-center rounded-lg bg-primary px-6 text-text-main text-base font-bold shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200">
                  View Plants
                </Link>
                <button className="flex w-full sm:w-auto min-w-[160px] h-12 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark px-6 text-text-main dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  How it Works
                </button>
              </div>
            </div>
            {/* Hero Image */}
            <div className="w-full md:w-1/2 lg:w-3/5 flex justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAzaus0c0LOhf2NX2DHlSrgoj7WJftqhZWnq2AaXvZGH_juFX-tzXsGtxKpiUTKI7o1qep8M-_mblF5fLwbfUAZBkbXNAwgdif6Fbd_TTDmR3Fn4bwl0C_sxr66ytyPsaniXtPwZovv8Jj2hG-6jQRdKjFy4Qi9xY456Jx4mhj-YhMXZQom8xGz0E9YuDuNOy_Q7EbzlxZ1eDTQLLSET3rEsIWX0QNNd0-56C2eO61nuFnUF_4wxoXrJY9-HR7VgsF4XTBDdH0Ytpg')" }}
                />
                {/* Floating UI Card decoration */}
                <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-64 bg-white/90 dark:bg-surface-dark/95 backdrop-blur rounded-xl p-4 shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg">water_drop</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-main dark:text-white">Thirsty!</p>
                      <p className="text-[10px] text-text-secondary">Snake Plant • Desk 2</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 w-[20%]"></div>
                  </div>
                  <p className="text-[10px] text-right mt-1 text-red-500 font-medium">Needs water today</p>
                </div>
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
                  Why DeskBoost?
                </h2>
                <p className="text-text-secondary dark:text-gray-300 text-lg font-normal max-w-xl">
                  Designed for the modern professional who loves nature but lacks the time.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {[
                  { icon: 'verified_user', title: 'Hard to Kill', text: 'Curated species that thrive in low light and irregular watering schedules common in offices.' },
                  { icon: 'desk', title: 'Desk Ready', text: 'Compact, leak-proof pots designed specifically for modern workstations and limited space.' },
                  { icon: 'smart_toy', title: 'AI Plant Doctor', text: 'Snap a photo anytime. Our AI instantly diagnoses issues and tells you exactly what to do.' }
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
              <h2 className="text-text-main dark:text-white text-2xl md:text-3xl font-bold tracking-tight">Desk Favorites</h2>
              <Link to="/plants" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
                          <span className="text-primary font-bold">${p.price}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-text-secondary dark:text-gray-400 text-sm">
                          <span className="material-symbols-outlined text-sm">
                            {p.id % 2 === 0 ? 'water_drop' : 'dark_mode'}
                          </span>
                          <span>{p.id % 2 === 0 ? 'Drought Tolerant' : 'Low Light Friendly'}</span>
                        </div>
                      </div>
                      <button className="w-full h-10 rounded-lg bg-[#f0f4f2] dark:bg-gray-700 text-text-main dark:text-white text-sm font-bold hover:bg-primary hover:text-text-main transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-white dark:bg-background-dark border-t border-[#f0f4f2] dark:border-[#1e3a29] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-text-main dark:text-white">
            <span className="material-symbols-outlined text-2xl text-primary">potted_plant</span>
            <span className="text-lg font-bold">DeskBoost</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-text-secondary dark:text-gray-400">
            <a className="hover:text-primary transition-colors" href="#">Support</a>
            <a className="hover:text-primary transition-colors" href="#">About</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          </div>
          <div className="flex gap-4">
            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
            <a className="text-text-secondary dark:text-gray-400 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">mail</span>
            </a>
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-gray-400 dark:text-gray-600">
          © 2024 DeskBoost Inc. All plants reserved.
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
};

export default Home;
