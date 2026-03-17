
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('orderCode') || 'GG-82931';
  const { lastOrder } = useCart();

  const items = lastOrder?.items || [];
  const total = lastOrder?.total || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto w-full">
        {/* Hero Success Section */}
        <div className="w-full text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/20 mb-6">
            <div className="bg-primary text-white rounded-full p-4 flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-4">Payment Successful!</h1>
          <p className="text-primary font-medium text-lg">Your plants are being prepared for their new home.</p>
        </div>

        {/* Order Detail Card */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            {/* Order Banner */}
            <div 
              className="rounded-xl h-48 bg-center bg-cover shadow-sm border border-primary/10" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmKBAW068YxHYocaAeQHcPncLrUGhMwKk9ThKVRiDo6kKn5p5twNGXy3ejsN3PoQj_au-6-WjtdJgLt89b_RWqS1s_T88A0P0EtNfnYA6jIOzJCPrn1jOdV0TkkFY5Q4BBTeoiWl8nlK0-zJRJX-TxDIkHGTzwEdBncgXlH-64x34M04COYTryDMe6NLKvdZJhWdyaUSEcDXaVV0_9O-vFp3-I8XPCOxWGnq_SsEfhWemTULbdjpRp8upTg52WNMovL4pyr4k_6o8')" }}
            />
            {/* Order Items */}
            <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-primary/10">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-4">
                {items.length > 0 ? items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 first:border-t-0 pt-4 first:pt-0">
                    <div className="h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                      <img className="h-full w-full object-cover" src={item.image} alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                )) : (
                  <p className="text-slate-500 italic">No items found in this order record.</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Stats Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-primary/10 flex flex-col items-center text-center">
              <span className="text-sm font-medium text-slate-500 mb-1">Order ID</span>
              <span className="text-2xl font-black text-primary tracking-tight">#{orderId}</span>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Total Paid</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(total * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-primary font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-primary/20 mt-4 pt-4 flex justify-between items-end">
                  <span className="font-bold">Total</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-slate-100">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-primary/10 flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-500 uppercase">Estimated Delivery</p>
                <p className="text-sm font-bold">Oct 24 - Oct 26</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center border-t border-primary/10 pt-8 mt-4">
          <Link to="/" className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-primary/25">
            <span className="material-symbols-outlined">home</span>
            Back to Home
          </Link>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold py-4 px-10 rounded-xl transition-all">
            <span className="material-symbols-outlined">download</span>
            Download Receipt
          </button>
        </div>
        
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>A confirmation email has been sent to your inbox.</p>
          <p className="mt-1">Need help? <Link to="/app/support" className="text-primary font-bold hover:underline">Contact Support</Link></p>
        </div>
      </main>
      
      <footer className="mt-auto py-8 text-center border-t border-primary/5">
        <p className="text-slate-500 text-xs">© 2024 DeskBoost. All plants reserved.</p>
      </footer>
    </div>
  );
};

export default PaymentSuccess;
