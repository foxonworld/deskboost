import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PRODUCTS, formatVND } from '../data/mockData';

// ── Sidebar menu (shared across admin pages) ──────────────────────────────────
const MENU_ITEMS = [
  { name: 'Tổng quan Dashboard', icon: 'dashboard', path: '/app/admin' },
  { name: 'Quản lý cửa hàng', icon: 'storefront', path: '/app/admin/plants', active: true },
  { name: 'Quản lý tài chính', icon: 'account_balance_wallet', path: '/app/admin/financials' },
  { name: 'Bản đồ cây người dùng', icon: 'potted_plant', path: '/app/admin/user-plants' },
  { name: 'Danh sách người dùng', icon: 'group', path: '/app/admin/users' },
  { name: 'Quản lý tin nhắn', icon: 'mail', path: '/app/admin/messages' },
  { name: 'Quản lý đơn hàng', icon: 'shopping_bag', path: '/app/admin/orders' },
];

const CATEGORIES = ['Tất cả', 'Trong nhà', 'Ngoài trời', 'Sen đá', 'Nhiệt đới', 'Cây có hoa', 'Thân gỗ', 'Chậu cây', 'Đất trồng', 'Phân bón', 'Phụ kiện'];

const INITIAL_PRODUCTS = PRODUCTS;

const formatPrice = formatVND;

const statusConfig = {
  Active: { label: 'Đang bán', cls: 'bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20' },
  Hidden: { label: 'Đã ẩn', cls: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700' },
  'Out of Stock': { label: 'Hết hàng', cls: 'bg-red-50 text-red-500 border-red-100 dark:bg-red-900/20 dark:border-red-800' },
};

const EMPTY_FORM = { 
  name: '', 
  category: 'Indoor', 
  price: '', 
  originalPrice: '',
  stock: '', 
  status: 'Active', 
  description: '', 
  image: '', 
  relatedProductIds: [], 
  comboDiscount: 0 
};

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.15s ease' }}>
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
         style={{ animation: 'slideUp 0.2s ease' }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <h3 className="font-black text-slate-900 dark:text-white">{title}</h3>
        <button onClick={onClose} className="size-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 darker:hover:text-slate-300 transition-colors">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
      <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
    </div>
    <style>{`
      @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
    `}</style>
  </div>
);

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ product, onConfirm, onClose }) => (
  <Modal title="Xác nhận xóa sản phẩm" onClose={onClose}>
    <div className="text-center space-y-4 py-4">
      <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-red-500 text-3xl">delete_forever</span>
      </div>
      <div>
        <p className="font-bold text-slate-800 dark:text-white">Bạn có chắc muốn xóa?</p>
        <p className="text-sm text-slate-500 mt-1">
          Sản phẩm <span className="font-bold text-slate-700 dark:text-slate-300">"{product.name}"</span> sẽ bị xóa vĩnh viễn và không thể khôi phục.
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Hủy
        </button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black hover:bg-red-600 active:scale-95 transition-all">
          Xóa sản phẩm
        </button>
      </div>
    </div>
  </Modal>
);

// ── Product Form ──────────────────────────────────────────────────────────────
const ProductForm = ({ form, onChange, onSubmit, onClose, isEdit }) => {
  const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] outline-none transition-all";
  const labelCls = "block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>Tên sản phẩm *</label>
          <input required className={inputCls} placeholder="vd: Monstera Deliciosa" value={form.name} onChange={e => onChange('name', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Danh mục *</label>
          <select required className={inputCls} value={form.category} onChange={e => onChange('category', e.target.value)}>
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Trạng thái</label>
          <select className={inputCls} value={form.status} onChange={e => onChange('status', e.target.value)}>
            <option value="Active">Đang bán</option>
            <option value="Hidden">Ẩn</option>
            <option value="Out of Stock">Hết hàng</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Giá (VNĐ) *</label>
          <div className="relative">
            <input required type="number" min="0" className={inputCls + ' pr-12'} placeholder="0" value={form.price} onChange={e => onChange('price', e.target.value)} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₫</span>
          </div>
        </div>
        <div>
          <label className={labelCls}>Giá gốc (không bắt buộc)</label>
          <div className="relative">
            <input type="number" min="0" className={inputCls + ' pr-12'} placeholder="0" value={form.originalPrice} onChange={e => onChange('originalPrice', e.target.value)} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₫</span>
          </div>
        </div>
        <div>
          <label className={labelCls}>Tồn kho *</label>
          <input required type="number" min="0" className={inputCls} placeholder="0" value={form.stock} onChange={e => onChange('stock', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>URL hình ảnh</label>
          <input className={inputCls} placeholder="https://..." value={form.image} onChange={e => onChange('image', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Mô tả</label>
          <textarea rows={3} className={inputCls + ' resize-none'} placeholder="Mô tả ngắn về sản phẩm..." value={form.description} onChange={e => onChange('description', e.target.value)} />
        </div>

        {/* RELATED PRODUCTS / COMBO SETTINGS */}
        <div className="col-span-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">auto_awesome</span> Cài đặt Combo gợi ý
          </p>
          <div>
            <label className={labelCls}>Sản phẩm gợi ý mua cùng</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PRODUCTS.filter(p => !['Indoor', 'Outdoor', 'Succulent', 'Tropical', 'Flowering', 'Tree'].includes(p.category)).map(p => {
                const isSelected = form.relatedProductIds?.includes(p.id);
                return (
                  <button 
                    key={p.id} 
                    type="button"
                    onClick={() => {
                      const current = form.relatedProductIds || [];
                      const next = isSelected 
                        ? current.filter(id => id !== p.id) 
                        : [...current, p.id];
                      onChange('relatedProductIds', next);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className={labelCls}>Giảm giá Combo (%)</label>
            <div className="relative w-32">
              <input 
                type="number" 
                min="0" 
                max="100" 
                className={inputCls + ' pr-8'} 
                value={form.comboDiscount} 
                onChange={e => onChange('comboDiscount', Number(e.target.value))} 
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price preview */}
      {form.price && (
        <div className="flex items-center gap-2 p-3 bg-[#4CAF50]/5 border border-[#4CAF50]/15 rounded-xl">
          <span className="material-symbols-outlined text-[#4CAF50] text-sm">sell</span>
          <span className="text-sm font-bold text-[#4CAF50]">Giá hiển thị: {formatPrice(Number(form.price))}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Hủy
        </button>
        <button type="submit" className="flex-1 py-3 rounded-xl bg-[#4CAF50] text-white font-black hover:shadow-lg hover:shadow-[#4CAF50]/30 active:scale-95 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">{isEdit ? 'save' : 'add_circle'}</span>
          {isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        </button>
      </div>
    </form>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const AdminPlantList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'price' | 'stock'
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null); // product
  const [deleteModal, setDeleteModal] = useState(null); // product
  const [detailModal, setDetailModal] = useState(null); // product
  const [notification, setNotification] = useState(null);

  // Form state
  const [form, setForm] = useState(EMPTY_FORM);
  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  // ── CRUD ──
  const handleAdd = (e) => {
    e.preventDefault();
    const newProd = { 
      ...form, 
      id: Date.now(), 
      price: Number(form.price), 
      stock: Number(form.stock),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined
    };
    setProducts(p => [newProd, ...p]);
    setAddModal(false);
    setForm(EMPTY_FORM);
    notify(`✅ Đã thêm "${newProd.name}" vào Shop`);
  };

  const handleEditOpen = (product) => {
    setForm({ 
      ...product, 
      price: String(product.price), 
      stock: String(product.stock),
      originalPrice: product.originalPrice ? String(product.originalPrice) : ''
    });
    setEditModal(product);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setProducts(p => p.map(prod => prod.id === editModal.id
      ? { ...form, id: editModal.id, price: Number(form.price), stock: Number(form.stock), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined }
      : prod
    ));
    setEditModal(null);
    setForm(EMPTY_FORM);
    notify(`✅ Đã cập nhật "${form.name}"`);
  };

  const handleDelete = () => {
    setProducts(p => p.filter(prod => prod.id !== deleteModal.id));
    notify(`🗑️ Đã xóa "${deleteModal.name}"`, 'error');
    setDeleteModal(null);
  };

  const toggleStatus = (id) => {
    setProducts(p => p.map(prod => {
      if (prod.id !== id) return prod;
      const next = prod.status === 'Active' ? 'Hidden' : 'Active';
      notify(`${next === 'Active' ? '✅' : '👁️'} Đã ${next === 'Active' ? 'hiện' : 'ẩn'} "${prod.name}"`);
      return { ...prod, status: next };
    }));
  };

  // ── Filtering + Sorting ──
  const filtered = useMemo(() => {
    let data = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
    data.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return data;
  }, [products, search, categoryFilter, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ col }) => (
    <span className="material-symbols-outlined text-xs ml-0.5" style={{ fontSize: '14px' }}>
      {sortBy === col ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
    </span>
  );

  // Stats
  const totalActive = products.filter(p => p.status === 'Active').length;
  const totalHidden = products.filter(p => p.status === 'Hidden').length;
  const totalOOS = products.filter(p => p.status === 'Out of Stock').length;
  const totalValue = products.filter(p => p.status === 'Active').reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9F8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 antialiased">

      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4CAF50] flex items-center justify-center text-white cursor-pointer shadow-sm" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">potted_plant</span>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-slate-50 font-bold text-base leading-none">DeskBoost</h1>
            <p className="text-slate-500 text-xs font-medium mt-0.5">Trình quản trị</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <Link key={item.name} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                item.active
                  ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${item.active ? 'fill-1' : ''}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-4 pb-1 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</p>
          </div>
          <Link to="/app/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all">
            <span className="material-symbols-outlined">settings</span>Cài đặt
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-sm font-semibold transition-all text-left">
            <span className="material-symbols-outlined">logout</span>Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Quản lý cửa hàng</h2>
            <p className="text-xs text-slate-500">{products.length} sản phẩm · {totalActive} đang bán</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setForm(EMPTY_FORM); setAddModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4CAF50] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#4CAF50]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Thêm sản phẩm
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Đang bán', value: totalActive, icon: 'storefront', color: 'text-[#4CAF50]', bg: 'bg-[#4CAF50]/5 border-[#4CAF50]/15' },
              { label: 'Đã ẩn', value: totalHidden, icon: 'visibility_off', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700' },
              { label: 'Hết hàng', value: totalOOS, icon: 'inventory', color: 'text-red-500', bg: 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800' },
              { label: 'Giá trị tồn kho', value: formatPrice(totalValue), icon: 'payments', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' },
            ].map((s, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${s.bg} flex items-center gap-3`}>
                <div className={`size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm ${s.color}`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <div>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] outline-none transition-all"
                placeholder="Tìm sản phẩm..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            {/* Category filter */}
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCategoryFilter(c); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    categoryFilter === c
                      ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#4CAF50]/50'
                  }`}
                >{c}</button>
              ))}
            </div>
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Active">Đang bán</option>
              <option value="Hidden">Đã ẩn</option>
              <option value="Out of Stock">Hết hàng</option>
            </select>
            {/* View toggle */}
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#4CAF50] text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50'}`}>
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
              <button onClick={() => setViewMode('table')} className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-[#4CAF50] text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50'}`}>
                <span className="material-symbols-outlined text-lg">table_rows</span>
              </button>
            </div>
            <p className="text-sm text-slate-500 font-medium ml-auto">{filtered.length} kết quả</p>
          </div>

          {/* ── GRID VIEW ── */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map(product => (
                <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#4CAF50]/20 transition-all group flex flex-col">
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-50 dark:bg-slate-800">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                    )}
                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg border ${statusConfig[product.status]?.cls}`}>
                      {statusConfig[product.status]?.label}
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-lg">Sắp hết</span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-black text-xs px-2 py-1 bg-red-500 rounded-lg">Hết hàng</span>
                      </div>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg shadow-lg">
                        SALE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-50 text-sm leading-tight mt-0.5 line-clamp-1">{product.name}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-[#4CAF50]">{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-slate-400 line-through font-bold">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Kho: {product.stock}</span>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-1.5 pt-1 border-t border-slate-50 dark:border-slate-800 mt-auto">
                      <button onClick={() => setDetailModal(product)} title="Xem chi tiết" className="flex-1 py-1.5 rounded-lg text-slate-400 hover:text-[#4CAF50] hover:bg-[#4CAF50]/5 transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                      <button onClick={() => handleEditOpen(product)} title="Sửa" className="flex-1 py-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button onClick={() => toggleStatus(product.id)} title={product.status === 'Active' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'} className="flex-1 py-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">{product.status === 'Active' ? 'visibility_off' : 'visibility'}</span>
                      </button>
                      <button onClick={() => setDeleteModal(product)} title="Xóa" className="flex-1 py-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TABLE VIEW ── */}
          {viewMode === 'table' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Danh mục</th>
                      <th className="px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#4CAF50] select-none" onClick={() => toggleSort('price')}>
                        <span className="flex items-center gap-1">Giá <SortIcon col="price" /></span>
                      </th>
                      <th className="px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#4CAF50] select-none" onClick={() => toggleSort('stock')}>
                        <span className="flex items-center gap-1">Tồn kho <SortIcon col="stock" /></span>
                      </th>
                      <th className="px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {paginated.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                            {product.image
                              ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                            }
                          </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-sm">{product.name}</p>
                              <p className="text-xs text-slate-500 line-clamp-1 max-w-[180px]">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg">{product.category}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-black text-[#4CAF50] text-sm">{formatPrice(product.price)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-bold text-sm ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                            {product.stock}
                          </span>
                          {product.stock === 0 && <span className="ml-1 text-[10px] text-red-500 font-bold">Hết</span>}
                          {product.stock > 0 && product.stock <= 5 && <span className="ml-1 text-[10px] text-amber-500 font-bold">Sắp hết</span>}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${statusConfig[product.status]?.cls}`}>
                            {statusConfig[product.status]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => setDetailModal(product)} className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#4CAF50] hover:bg-[#4CAF50]/5 transition-all" title="Xem">
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </button>
                            <button onClick={() => handleEditOpen(product)} className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Sửa">
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button onClick={() => toggleStatus(product.id)} className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all" title="Ẩn/Hiện">
                              <span className="material-symbols-outlined text-base">{product.status === 'Active' ? 'visibility_off' : 'visibility'}</span>
                            </button>
                            <button onClick={() => setDeleteModal(product)} className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Xóa">
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-6xl mb-4">🌿</div>
              <p className="font-bold text-slate-600 dark:text-slate-400">Không tìm thấy sản phẩm</p>
              <p className="text-sm text-slate-400 mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Trang {page}/{totalPages} · {filtered.length} sản phẩm
              </p>
              <div className="flex gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors">
                  ← Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-10 h-10 text-sm font-bold rounded-xl transition-all ${page === p ? 'bg-[#4CAF50] text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors">
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── MODALS ── */}
      {addModal && (
        <Modal title="➕ Thêm sản phẩm mới" onClose={() => setAddModal(false)}>
          <ProductForm form={form} onChange={setField} onSubmit={handleAdd} onClose={() => setAddModal(false)} isEdit={false} />
        </Modal>
      )}

      {editModal && (
        <Modal title="✏️ Chỉnh sửa sản phẩm" onClose={() => setEditModal(null)}>
          <ProductForm form={form} onChange={setField} onSubmit={handleEditSave} onClose={() => setEditModal(null)} isEdit={true} />
        </Modal>
      )}

      {deleteModal && (
        <DeleteModal product={deleteModal} onConfirm={handleDelete} onClose={() => setDeleteModal(null)} />
      )}

      {detailModal && (
        <Modal title="🌿 Chi tiết sản phẩm" onClose={() => setDetailModal(null)}>
          <div className="space-y-4">
            {detailModal.image && (
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <img src={detailModal.image} alt={detailModal.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">{detailModal.name}</h3>
                  <span className="text-sm text-slate-500">{detailModal.category}</span>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${statusConfig[detailModal.status]?.cls}`}>
                  {statusConfig[detailModal.status]?.label}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{detailModal.description || 'Chưa có mô tả.'}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#4CAF50]/5 border border-[#4CAF50]/15 rounded-xl">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Giá bán</p>
                  <p className="text-xl font-black text-[#4CAF50] mt-1">{formatPrice(detailModal.price)}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tồn kho</p>
                  <p className={`text-xl font-black mt-1 ${detailModal.stock === 0 ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>{detailModal.stock} cái</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setDetailModal(null); handleEditOpen(detailModal); }}
                  className="flex-1 py-3 bg-[#4CAF50] text-white font-black rounded-xl hover:shadow-lg hover:shadow-[#4CAF50]/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">edit</span>Chỉnh sửa
                </button>
                <button onClick={() => { setDetailModal(null); setDeleteModal(detailModal); }}
                  className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-500 font-bold rounded-xl hover:bg-red-100 transition-all">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[999] px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 border ${
          notification.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800'
            : 'bg-white text-slate-800 border-slate-100 dark:bg-slate-900 dark:text-white dark:border-slate-800'
        }`} style={{ animation: 'slideUp 0.2s ease' }}>
          {notification.msg}
        </div>
      )}
    </div>
  );
};

export default AdminPlantList;
