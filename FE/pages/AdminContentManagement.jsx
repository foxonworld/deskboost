import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminContentManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f8f8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 min-h-screen font-['Manrope']">
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#10221f]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-10 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between whitespace-nowrap">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="size-8 bg-[#2beecd] rounded-lg flex items-center justify-center text-[#10221f]">
                  <span className="material-symbols-outlined">potted_plant</span>
                </div>
                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">DeskBoost Admin</h2>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <button onClick={() => navigate('/app/admin')} className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Dashboard</button>
                <button onClick={() => navigate('/app/admin/content')} className="text-[#2beecd] text-sm font-bold border-b-2 border-[#2beecd] pb-1">Content</button>
                <button onClick={() => navigate('/app/admin/plants')} className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Plants</button>
                <button onClick={() => navigate('/app/admin/users')} className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Users</button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#2beecd] w-64" placeholder="Search content..." />
              </div>
              <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">notifications</span>
              </button>
              <div className="size-10 rounded-full bg-[#2beecd]/20 border-2 border-[#2beecd] flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKwZqTSyoSrawi6pNoTMuliW85Xy77VGmamIz23JJ9K316-CSNgODOiXEhdFyiQ7RKsoGyApuOhuVw2j6YPtLWHQvwBp_KsdO5eufV2oAMQzgQRBgMYMYhoUDHC1ka21MwsYRz8NaMAhQc_aD0FCeBYdBqJ-E563bgPyGudYf9sIzMwsy1cHZJA2cVEuY-XsQcoLRBH93MEgh-Esu9X_PR8VpSqDH6JGZ6U056A2-flSYXP3gOWXdhOoD6tkN3tCLDru6Tb9M7iiU" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Content Management</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Configure and update your website's public-facing content.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Discard</button>
              <button className="bg-[#2beecd] hover:bg-[#2beecd]/90 text-[#10221f] px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#2beecd]/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">save</span>
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Nav */}
            <aside className="lg:col-span-3 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#2beecd]/10 text-[#2beecd] rounded-xl font-bold text-left">
                <span className="material-symbols-outlined">home</span>
                Homepage
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-left">
                <span className="material-symbols-outlined">featured_seasonal_and_gifts</span>
                Featured Plants
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-left">
                <span className="material-symbols-outlined">menu_book</span>
                Care Guides
              </button>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Global Settings</p>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-left">
                  <span className="material-symbols-outlined">settings</span>
                  SEO & Metadata
                </button>
              </div>
            </aside>

            {/* Content Area */}
            <div className="lg:col-span-9 space-y-8">
              {/* Section 1: Homepage Content */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800" id="homepage">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#2beecd]/10 text-[#2beecd] rounded-lg">
                    <span className="material-symbols-outlined">web</span>
                  </div>
                  <h3 className="text-xl font-bold">Homepage Content</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hero Title</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-[#2beecd] focus:border-[#2beecd] text-sm p-2.5" type="text" defaultValue="Elevate Your Workspace" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hero Subtitle</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-[#2beecd] focus:border-[#2beecd] text-sm p-2.5" type="text" defaultValue="Professional desk plants for every environment" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Short Description</label>
                    <textarea className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-[#2beecd] focus:border-[#2beecd] text-sm p-2.5" rows={3} defaultValue="DeskBoost helps you transform your home office or corporate workspace with hand-selected plants that improve air quality and productivity." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Featured Message (Banner)</label>
                    <div className="flex gap-3">
                      <input className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-[#2beecd] focus:border-[#2beecd] text-sm p-2.5" type="text" defaultValue="Flash Sale: 20% off all Snake Plants this weekend!" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Visible</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#2beecd]">
                          <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Featured Plants */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800" id="plants">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2beecd]/10 text-[#2beecd] rounded-lg">
                      <span className="material-symbols-outlined">star</span>
                    </div>
                    <h3 className="text-xl font-bold">Featured Plants</h3>
                  </div>
                  <button onClick={() => navigate('/app/admin/plants/add')} className="text-[#2beecd] text-sm font-bold hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Plant
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plant Item 1 */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
                    <div className="size-20 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe3puU4MPDeDd_pLCJkb6TdKVBwJPvyC6Vy_Y3Ch4JoJzn0zWLC2H0nsATMFJT9LmxGa3_yAqLUvv-ZSh8-0mDrVr8KgwAO2h3xMclG5qQ0mHxIG63b-RxLeTx6Fq8xVnSn6_WNVPlh2CpWpPG7BifY2RZM0zk24wmfNRjnpqdmQ1n88kq0nMsG722n8yRN9MNwQ5DGWoJBP0UYoUyFI3hYBspOviEEScb0meTgO1GaID6WA2We4eQcGLuYY2BZzA1xlfvTg6Su34" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm truncate">Monstera Deliciosa</h4>
                        <button className="text-slate-400 hover:text-red-500">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                      <input className="mt-2 w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md text-xs p-2" placeholder="Highlight text..." type="text" defaultValue="Perfect for bright offices" />
                    </div>
                  </div>
                  {/* Plant Item 2 */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
                    <div className="size-20 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHo0YQcyEjNkPzeOKtnfcNY959KpQI-kyVXF4wGKXrX90FMcLz_tQ3kQUWi0LOcNLCgNI8pTbiPxiLxPGyIMEYtmhelC9z_6neeJQeAg5LYFWChmYRboeiIY837JqA0dTnrNLHcAjuGiJw3IcxwEWoG0HXnbtvdZ9l0M-Gqx2x1eUAxRzCsDm8UOfbgG6SUTZ2cJFiPFqvMqyWEBHWz-fVkymV4eo-teqMyb7l80j5hE1LzStLXDP2r7QeZcu971s8YfFgymcwXe0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm truncate">Sansevieria Trifasciata</h4>
                        <button className="text-slate-400 hover:text-red-500">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                      <input className="mt-2 w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md text-xs p-2" placeholder="Highlight text..." type="text" defaultValue="Indestructible desk companion" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Plant Care Guides */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800" id="guides">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2beecd]/10 text-[#2beecd] rounded-lg">
                      <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <h3 className="text-xl font-bold">Plant Care Guides</h3>
                  </div>
                  <button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Create Guide
                  </button>
                </div>
                <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold">
                      <tr>
                        <th className="px-4 py-3">Guide Title</th>
                        <th className="px-4 py-3">Related Plant</th>
                        <th className="px-4 py-3">Last Edited</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="px-4 py-4">
                          <p className="font-bold">Watering Basics</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">How to tell when your desk plant is thirsty...</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">General Care</span>
                        </td>
                        <td className="px-4 py-4 text-slate-500">Oct 12, 2023</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4">
                          <p className="font-bold">The Low-Light Guide</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">Best plants for windowless cubicles...</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-[#2beecd]/10 text-[#2beecd] rounded text-xs">Zanzibar Gem</span>
                        </td>
                        <td className="px-4 py-4 text-slate-500">Sep 28, 2023</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <span className="material-symbols-outlined">info</span>
                  <p className="text-sm">Click "Create Content" to start a new care guide draft here.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10221f]">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm">© 2024 DeskBoost System. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a className="text-slate-400 hover:text-[#2beecd] text-xs uppercase font-bold tracking-widest transition-colors" href="#">Documentation</a>
              <a className="text-slate-400 hover:text-[#2beecd] text-xs uppercase font-bold tracking-widest transition-colors" href="#">Support</a>
              <a className="text-slate-400 hover:text-[#2beecd] text-xs uppercase font-bold tracking-widest transition-colors" href="#">API Status</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminContentManagement;
