import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPlantList = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f8f8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 min-h-screen font-['Manrope']">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-8 rounded-lg bg-[#4CAF50] flex items-center justify-center text-white">
              <span className="material-symbols-outlined">potted_plant</span>
            </div>
            <h1 className="text-lg font-bold">DeskBoost</h1>
          </div>
          <nav className="flex-1 px-4 space-y-1 mt-4">
            <button onClick={() => navigate('/app/admin')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button onClick={() => navigate('/app/admin/users')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">group</span>
              <span className="text-sm font-medium">Users</span>
            </button>
            <button onClick={() => navigate('/app/admin/plants')} className="w-full flex items-center gap-3 px-3 py-2 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">eco</span>
              <span className="text-sm font-bold">Plant Library</span>
            </button>
            <button onClick={() => navigate('/app/admin/user-plants')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">yard</span>
              <span className="text-sm font-medium">User Plants</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Plant Library</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Manage the global database of plant species.</p>
            </div>
            <button onClick={() => navigate('/app/admin/plants/add')} className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Add New Species
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, name: 'Monstera Deliciosa', scientific: 'Monstera deliciosa', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe3puU4MPDeDd_pLCJkb6TdKVBwJPvyC6Vy_Y3Ch4JoJzn0zWLC2H0nsATMFJT9LmxGa3_yAqLUvv-ZSh8-0mDrVr8KgwAO2h3xMclG5qQ0mHxIG63b-RxLeTx6Fq8xVnSn6_WNVPlh2CpWpPG7BifY2RZM0zk24wmfNRjnpqdmQ1n88kq0nMsG722n8yRN9MNwQ5DGWoJBP0UYoUyFI3hYBspOviEEScb0meTgO1GaID6WA2We4eQcGLuYY2BZzA1xlfvTg6Su34' },
              { id: 2, name: 'Snake Plant', scientific: 'Sansevieria trifasciata', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHo0YQcyEjNkPzeOKtnfcNY959KpQI-kyVXF4wGKXrX90FMcLz_tQ3kQUWi0LOcNLCgNI8pTbiPxiLxPGyIMEYtmhelC9z_6neeJQeAg5LYFWChmYRboeiIY837JqA0dTnrNLHcAjuGiJw3IcxwEWoG0HXnbtvdZ9l0M-Gqx2x1eUAxRzCsDm8UOfbgG6SUTZ2cJFiPFqvMqyWEBHWz-fVkymV4eo-teqMyb7l80j5hE1LzStLXDP2r7QeZcu971s8YfFgymcwXe0' },
              { id: 3, name: 'Fiddle Leaf Fig', scientific: 'Ficus lyrata', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5UtIT4zAbJXsJSg4fCceVRDiOzTB1Upekt9ZNC4QsKHJRmRSAtsKi1C6WYZgj3_8BwgbdazgDGygYIILcVU2wVLBwncGx63Ecc72ci7ny6HMAMMV1a-1WY-iJUiWH4LOPU7EwIoZoWTIIJnxtWvQMdKx2FK52PHPn_OrI8Vm6DoJeiM_9DbiKyTkXkPX5lZHnp9oYSDh-k7odTspkCkE2V1JiZuUKNrmf6AlBBjk4_7_WpQoVQXAWHXnaU52lYFFgB5562zEko_I' },
            ].map((plant) => (
              <div key={plant.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={plant.image} alt={plant.name} />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => navigate(`/app/admin/plants/${plant.id}/edit`)} className="bg-white text-slate-900 p-2 rounded-lg font-bold text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{plant.name}</h3>
                  <p className="text-xs text-slate-500 italic">{plant.scientific}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPlantList;
