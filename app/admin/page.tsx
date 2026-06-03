"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminMasterDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]); // New state
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

    // 3. Fetching Custom Sourcing Requests
    const resReq = await fetch("/api/requests");
    const dataReq = await resReq.json();
    setCustomRequests(dataReq);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete Product Handler
  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to remove this product from the marketplace?")) {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Product deleted successfully");
        fetchData(); // Refresh list
      }
    }
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">Admin Master Panel</h1>
          <p className="text-slate-500 text-sm italic">Monitoring Seller Inventory, Buyer Orders & Requests</p>
        </div>
        <button 
          onClick={() => router.push('/login')} 
          className="bg-red-900/20 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg text-sm hover:bg-red-900/40"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 gap-10">
        
        {/* Section 1: Buyer Orders Control */}
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
                  <tr key={o.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                    <td className="p-4 font-medium">{o.product_name}</td>
                    <td className="p-4">{o.quantity} <span className="text-emerald-500 font-bold">{o.unit}</span></td>
                    <td className="p-4 text-emerald-400">₹{o.total_price_inr}</td>
                    <td className="p-4">
                        {o.status === 'Pending' ? (
                            <button 
                            onClick={async () => {
                                const res = await fetch("/api/orders", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: o.id, status: "Completed" })
                                });
                                if(res.ok) { alert("Order Marked as Completed!"); fetchData(); }
                            }}
                            className="bg-emerald-900/30 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-emerald-500 hover:text-black transition"
                            >
                            Mark Complete
                            </button>
                        ) : (
                            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest bg-blue-900/20 px-3 py-1 rounded-lg">
                            ✓ Completed
                            </span>
                        )}
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Seller Inventory Control */}
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
                <button 
                  onClick={() => handleDeleteProduct(p.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition text-xs font-bold px-2 py-1 border border-red-500/20 rounded hover:bg-red-500 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Custom Sourcing Requests (Procurement) */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl mb-10">
          <h2 className="text-xl font-bold mb-6 text-orange-400 flex items-center gap-2">
            📋 Custom Procurement Inquiries <span className="text-xs bg-orange-950/40 px-2 py-1 rounded text-orange-400">{customRequests.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customRequests.length > 0 ? (
              customRequests.map((cr: any) => (
                <div key={cr.id} className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl relative hover:border-orange-500/50 transition">
                  <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-900/80 px-2 py-1 rounded">Sourcing Ticket</span>
                  <h3 className="font-bold text-slate-200 text-base">{cr.chemical_name}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Target Volume: <span className="text-emerald-400 font-mono font-bold">{cr.required_qty} {cr.preferred_unit}</span>
                  </p>
                  {cr.urgency_notes && (
                    <p className="text-xs text-slate-500 mt-2 italic bg-slate-900/40 p-2 rounded border border-slate-800">
                      Specs: "{cr.urgency_notes}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic text-sm">No custom sourcing requests found.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}