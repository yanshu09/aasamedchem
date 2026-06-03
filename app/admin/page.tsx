"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminMasterDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    // 1. Fetching Buyers' Orders
    const resOrders = await fetch("/api/orders");
    const dataOrders = await resOrders.json();
    setOrders(dataOrders);

    // 2. Fetching Sellers' Inventory
    const resProducts = await fetch("/api/products");
    const dataProducts = await resProducts.json();
    setProducts(dataProducts);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">Admin Master Panel</h1>
          <p className="text-slate-500 text-sm italic">Monitoring Seller Inventory & Buyer Quotations</p>
        </div>
        <button onClick={() => router.push('/login')} className="bg-red-900/20 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg text-sm hover:bg-red-900/40">Logout</button>
      </header>

      <div className="grid grid-cols-1 gap-10">
        
        {/* Section 1: Buyer Orders Control (Transaction View) */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-emerald-300 flex items-center gap-2">
            🛒 Buyer Transactions <span className="text-xs bg-emerald-900/30 px-2 py-1 rounded text-emerald-500">{orders.length}</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-500 text-xs uppercase">
                <tr className="border-b border-slate-800">
                  <th className="p-4">Product</th>
                  <th className="p-4">Qty (Unit)</th>
                  <th className="p-4">Total Price (INR)</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-4 font-medium">{o.product_name}</td>
                    <td className="p-4">{o.quantity} <span className="text-emerald-500 font-bold">{o.unit}</span></td>
                    <td className="p-4 text-emerald-400">₹{o.total_price_inr}</td>
                    <td className="p-4"><span className="text-yellow-500 text-[10px] border border-yellow-500/30 px-2 py-1 rounded uppercase tracking-widest font-bold">Pending</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Seller Inventory Control (Marketplace View) */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-blue-300 flex items-center gap-2">
            📦 Seller Inventory Management <span className="text-xs bg-blue-900/30 px-2 py-1 rounded text-blue-500">{products.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-blue-500 transition-all">
                <div>
                  <h3 className="font-bold text-slate-200">{p.name}</h3>
                  <p className="text-xs text-slate-500">Rate: ₹{p.price_per_base_unit} / {p.base_unit}</p>
                </div>
                <button className="text-red-500 opacity-0 group-hover:opacity-100 transition text-xs font-bold px-2 py-1 border border-red-500/20 rounded hover:bg-red-500 hover:text-white">Delete</button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}