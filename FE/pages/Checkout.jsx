
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart, formatVND } from '../context/CartContext';
import { apiCreatePayment } from '../services/commerceApi';

const Checkout = () => {
  const { items, subtotal, shippingFee, total, clearCart, setLastOrder } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayNow = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city) {
      setError('Vui lòng điền đầy đủ thông tin vận chuyển.');
      return;
    }
    if (items.length === 0) {
      setError('Giỏ hàng của bạn đang trống.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        shippingInfo: form,
        items: items.map((i) => ({ plantId: i.id, quantity: i.quantity, price: i.price })),
        total,
      };
      const data = await apiCreatePayment(payload);
      if (data?.checkoutUrl) {
        setLastOrder({ ...payload, orderId: data.orderId });
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        setError('Không thể tạo phiên thanh toán. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center gap-6 p-10">
          <span className="material-symbols-outlined text-6xl text-primary">shopping_cart</span>
          <h2 className="text-2xl font-black text-text-main dark:text-white">Giỏ hàng của bạn đang trống</h2>
          <Link to="/cart" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-primary-dark transition-all">
            Quay lại giỏ hàng
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors">
      <Navbar />
      <main className="max-w-6xl mx-auto w-full px-4 md:px-10 py-8">
        {/* Breadcrumbs / Steps */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/cart" className="text-primary text-sm font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">shopping_cart</span> Giỏ hàng
          </Link>
          <span className="text-slate-400 material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 text-sm font-bold">Thanh toán</span>
          <span className="text-slate-400 material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-400 text-sm font-medium">Xác nhận</span>
        </div>

        <h1 className="text-3xl font-extrabold mb-8 font-display">Thanh toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-10">
            {/* Section 1: Shipping Information */}
            <section className="bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-xl border border-primary/5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <h2 className="text-xl font-bold font-display">Thông tin vận chuyển</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Họ và tên</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Số điện thoại</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Địa chỉ Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="john@example.com"
                    type="email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Địa chỉ giao hàng</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="Tên đường, số nhà..."
                    type="text"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tỉnh / Thành phố</label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none"
                  >
                    <option value="">Chọn tỉnh / thành phố</option>
                    <option value="HCM">TP. Hồ Chí Minh</option>
                    <option value="HN">Hà Nội</option>
                    <option value="DN">Đà Nẵng</option>
                    <option value="HP">Hải Phòng</option>
                    <option value="CT">Cần Thơ</option>
                    <option value="BH">Bình Dương</option>
                    <option value="HY">Hưng Yên</option>
                    <option value="OTHER">Tỉnh / TP khác</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="Ghi chú về đơn hàng, ví dụ: lưu ý khi giao hàng."
                    rows="3"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Payment Method */}
            <section className="bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-xl border border-primary/5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <h2 className="text-xl font-bold font-display">Phương thức thanh toán</h2>
              </div>
              <div className="space-y-4">
                {/* PayOS Option */}
                <label className="relative flex flex-col p-4 border-2 border-primary rounded-xl cursor-pointer bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input checked readOnly className="w-5 h-5 text-primary border-slate-300 focus:ring-primary" name="payment" type="radio"/>
                      <span className="font-bold text-slate-900 dark:text-slate-100">PayOS</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="material-symbols-outlined text-primary">qr_code_2</span>
                    </div>
                  </div>
                  <div className="ml-8">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Quét mã QR để thanh toán qua ứng dụng ngân hàng. Chuyển hướng an toàn tới PayOS.</p>
                  </div>
                </label>
              </div>
            </section>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <section className="bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-xl border border-primary/5 shadow-sm">
                <h2 className="text-xl font-bold font-display mb-6">Tóm tắt đơn hàng</h2>
                {/* Item List */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold">{item.name}</h3>
                        <p className="text-xs text-slate-500">SL: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <hr className="border-slate-100 dark:border-slate-800 my-6"/>
                
                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Tạm tính</span>
                    <span>{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Phí vận chuyển</span>
                    <span className="text-primary font-medium">{formatVND(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold pt-2 text-slate-900 dark:text-slate-100 border-t border-slate-100 dark:border-slate-800">
                    <span>Tổng cộng</span>
                    <span>{formatVND(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayNow}
                  disabled={loading}
                  className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                
                <p className="text-[10px] text-center text-slate-400 mt-4 px-4 uppercase tracking-widest font-bold">
                  Thanh toán an toàn mã hóa
                </p>
              </section>

              {/* Extra help card */}
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">eco</span>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-slate-100">Bao gồm hướng dẫn chăm sóc</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Mỗi đơn hàng đều đi kèm hướng dẫn kỹ thuật số giúp cây của bạn phát triển tốt nhất.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
