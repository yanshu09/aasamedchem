"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("g");
  const [price, setPrice] = useState("");
  const router = useRouter();

  const fetchMyInventory = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchMyInventory(); }, []);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, base_unit: unit, price_per_base_unit: price }),
    });
    if (res.ok) {
      alert("Chemical Added to Catalog!");
      setName(""); setPrice("");
      fetchMyInventory();
    }
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Seller Dashboard</h1>
          <p className="text-slate-500 text-sm">Manage your chemical inventory and pricing</p>
        </div>
        <button onClick={() => router.push('/login')} className="bg-slate-800 px-4 py-2 rounded-lg text-sm">Logout</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl h-fit">
          <h2 className="text-xl font-bold mb-6 text-blue-300">Add New Stock</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold">Chemical Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 mt-1 bg-slate-800 rounded-lg border border-slate-700 outline-none focus:border-blue-500" placeholder="e.g. Sodium Chloride" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-slate-500 uppercase font-bold">Base Unit</label>
                <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-3 mt-1 bg-slate-800 rounded-lg border border-slate-700 outline-none">
                  <option value="g">Grams (g)</option>
                  <option value="mL">Milliliters (mL)</option>
                  <option value="item">Items</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 uppercase font-bold">Price (₹)</label>
                <input type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-3 mt-1 bg-slate-800 rounded-lg border border-slate-700 outline-none focus:border-blue-500" placeholder="0.00" />
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-900/20">List Product</button>
          </form>
        </div>

        {/* Inventory List Section */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-blue-300">Your Active Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-xs text-slate-500">₹{p.price_per_base_unit} / {p.base_unit}</p>
                </div>
                <div className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-1 rounded uppercase font-bold">Active</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}