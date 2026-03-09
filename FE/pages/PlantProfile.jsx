
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MY_PLANTS } from '../data/mockData';

const PlantProfile = () => {
  const { id } = useParams();
  const plant = MY_PLANTS.find(p => p.id === id) || MY_PLANTS[0];

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-10 w-full space-y-8">
        <nav className="flex gap-2 text-sm font-bold text-text-secondary">
          <Link to="/app/dashboard" className="hover:text-primary transition-colors">Dashboard</Link> <span>/</span> <Link to="/app/my-plants" className="hover:text-primary transition-colors">My Jungle</Link> <span>/</span> <span className="text-text-main font-black">{plant.nickname}</span>
        </nav>

        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-text-main tracking-tight">{plant.nickname}</h1>
            <p className="text-lg text-text-secondary font-medium italic">{plant.species} • Healthy</p>
          </div>
          <button className="flex items-center gap-2 px-6 h-12 rounded-xl bg-white border border-gray-200 font-bold text-text-main hover:border-primary hover:text-primary transition-all shadow-sm">
            <span className="material-symbols-outlined">edit</span> Edit Profile
          </button>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4 items-start shadow-sm shadow-primary/5">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-text-main">DeskBoost Insight</p>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">Your Aloe is looking great! Based on your office temperature (22°C), we recommend moving it closer to the window for better indirect light exposure.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <img src={plant.image} className="w-full aspect-[3/4] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-sm" alt={plant.name} />
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/5">
                <span className="size-2 bg-primary rounded-full animate-pulse"></span> HEALTHY
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link to={`/app/my-plants/${plant.id}/analyze`} className="flex flex-col items-center justify-center gap-1 h-20 rounded-xl bg-primary hover:bg-primary-dark text-white transition-all shadow-md shadow-primary/20">
                  <span className="material-symbols-outlined">photo_camera</span>
                  <span className="text-xs font-bold">Analyze</span>
                </Link>
                <button className="flex flex-col items-center justify-center gap-1 h-20 rounded-xl bg-background-light hover:bg-gray-100 text-text-main transition-all border border-gray-100">
                  <span className="material-symbols-outlined">notifications_active</span>
                  <span className="text-xs font-bold">Reminders</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center text-amber-500">
                  <p className="text-xs font-black uppercase tracking-widest text-text-secondary">Light Exposure</p>
                  <span className="material-symbols-outlined">wb_sunny</span>
                </div>
                <p className="text-2xl font-black text-text-main">Low Indirect</p>
                <div className="h-2 w-full bg-background-light rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-1/3 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center text-sky-500">
                  <p className="text-xs font-black uppercase tracking-widest text-text-secondary">Soil Moisture</p>
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <p className="text-2xl font-black text-text-main">85%</p>
                <div className="h-2 w-full bg-background-light rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 w-[85%] rounded-full"></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 col-span-2 md:col-span-1 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center text-primary">
                  <p className="text-xs font-black uppercase tracking-widest text-text-secondary">Next Water</p>
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <p className="text-2xl font-black text-text-main">In 2 Days</p>
                <p className="text-xs text-text-secondary font-medium italic">Last watered: Oct 24</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-background-light/30">
                <h3 className="text-xl font-bold text-text-main">Care Schedule</h3>
                <button className="text-primary font-black text-sm uppercase tracking-widest hover:text-primary-dark transition-colors">View Calendar</button>
              </div>
              <div className="p-8 space-y-8 relative">
                <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-background-light"></div>
                {[
                  { date: 'Upcoming • Oct 28', title: 'Watering Day', active: true },
                  { date: 'Nov 15', title: 'Fertilizer Boost', future: true },
                  { date: 'Completed • Oct 24', title: 'Watering Day', done: true }
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-6 relative z-10 ${item.done ? 'opacity-50' : ''}`}>
                    <div className={`size-4 rounded-full border-4 border-white mt-1.5 shadow-sm ${item.active ? 'bg-primary' : item.future ? 'bg-gray-300' : 'bg-text-secondary'}`}></div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.active ? 'text-primary' : 'text-text-secondary'}`}>{item.date}</p>
                        <p className={`font-bold text-text-main ${item.done ? 'line-through' : ''}`}>{item.title}</p>
                      </div>
                      {item.active && (
                        <button className="px-5 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm shadow-primary/5">Mark Done</button>
                      )}
                      {item.done && <span className="material-symbols-outlined text-emerald-500">check_circle</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default PlantProfile;
