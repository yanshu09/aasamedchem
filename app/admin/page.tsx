"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white font-sans">
      <h1 className="text-3xl font-bold text-emerald-400 mb-8 tracking-tight">Admin: Order & Inventory Management</h1>
      
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl">
        <h2 className="text-xl font-semibold mb-6 border-b border-slate-700 pb-2">Incoming Quotations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-slate-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Ordered Qty</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Total Price (INR)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="p-4 font-medium">{o.product_name}</td>
                  <td className="p-4">{o.quantity}</td>
                  <td className="p-4 font-bold text-emerald-500">{o.unit}</td>
                  <td className="p-4 text-emerald-400 font-mono">₹{o.total_price_inr}</td>
                  <td className="p-4"><span className="bg-yellow-900/30 text-yellow-500 px-3 py-1 rounded-full text-xs uppercase">Pending</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-10 text-slate-500 italic">No orders placed yet.</p>}
        </div>
      </div>
    </div>
  );
}