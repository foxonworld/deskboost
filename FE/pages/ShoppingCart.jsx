
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart, formatVND } from '../context/CartContext';

const ShoppingCart = () => {
  const { items, subtotal, shippingFee, total, isFreeShipping, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex mb-8 gap-2 text-sm font-bold text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium font-bold">Giỏ hàng</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cart Items (70%) */}
          <div className="lg:w-[70%] space-y-6">
            <div className="flex items-baseline justify-between">
              <h1 className="text-3xl font-extrabold tracking-tight">Giỏ hàng</h1>
              <span className="text-slate-500 font-bold">{items.length} sản phẩm</span>
            </div>

            {/* Cart List */}
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-sm border border-primary/5 flex flex-col sm:flex-row gap-6 items-center group transition-all hover:bg-white dark:hover:bg-slate-800 focus-within:ring-2 focus-within:ring-primary/20">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">Còn hàng</p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                        <div className="flex items-center bg-primary/5 rounded-lg border border-primary/10">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 px-3 hover:bg-primary/10 text-primary transition-colors rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-3 hover:bg-primary/10 text-primary transition-colors rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Xóa
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right sm:min-w-[120px]">
                       <p className="text-xl font-black text-primary">{formatVND(item.price * item.quantity)}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{formatVND(item.price)} / cái</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-slate-800/50 p-12 rounded-xl border border-dashed border-primary/20 text-center space-y-4">
                  <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-4xl">shopping_cart_off</span>
                  </div>
                  <h3 className="text-xl font-bold">Giỏ hàng trống</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">Có vẻ như bạn chưa chọn được người bạn xanh nào cho không gian của mình.</p>
                  <Link to="/plants" className="inline-flex items-center gap-2 bg-primary text-text-main font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all">
                    Bắt đầu mua sắm
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Link to="/plants" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                <span className="material-symbols-outlined">keyboard_backspace</span>
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Right Column: Summary (30%) */}
          <div className="lg:w-[30%]">
            <div className="sticky top-24 bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-primary/10 space-y-6">
              <h2 className="text-xl font-bold border-b border-primary/10 pb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm font-medium">
                  <span>Tạm tính</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm font-medium">
                  <span>Phí vận chuyển</span>
                  {isFreeShipping
                    ? <span className="text-[#4CAF50] font-bold">Miễn phí 🎉</span>
                    : <span className="text-slate-900 dark:text-slate-100 font-bold">{formatVND(shippingFee)}</span>
                  }
                </div>
                {!isFreeShipping && subtotal > 0 && (
                  <p className="text-xs text-slate-400 font-medium">Mua thêm {formatVND(500000 - subtotal)} để miễn phí vận chuyển</p>
                )}
              </div>
              
              <div className="border-t border-primary/10 pt-4">
                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{formatVND(total)}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Đã bao gồm VAT</p>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className={`w-full bg-primary hover:bg-primary/90 text-text-main font-bold py-4 rounded-xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 mb-4 group ${items.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Tiến hành thanh toán
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <div className="space-y-4 pt-4 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                    <p>Thanh toán bảo mật mã hóa SSL</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">local_shipping</span>
                    <p>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</p>
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

export default ShoppingCart;
