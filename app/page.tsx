"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. Import router

export default function BuyerPage() {
  const router = useRouter(); // 2. Initialize router
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [inputQty, setInputQty] = useState<any>({});
  const [selectedUnit, setSelectedUnit] = useState<any>({});

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?search=${search}`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const calculateTotal = (p: any) => {
    const qty = parseFloat(inputQty[p.id] || 0);
    const unit = selectedUnit[p.id] || p.base_unit;
    let factor = 1;

    if (unit === "kg" || unit === "L") factor = 1000;
    
    return (qty * factor * parseFloat(p.price_per_base_unit)).toFixed(2);
  };

  const placeOrder = async (p: any) => {
    const qty = inputQty[p.id];
    const unit = selectedUnit[p.id] || p.base_unit;
    if (!qty) return alert("Enter Quantity!");

    const total = calculateTotal(p);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_name: p.name, quantity: qty, unit, total_price_inr: total }),
    });

    if (res.ok) alert(`Order Placed for ${p.name}!`);
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-400 tracking-tight">AasaMedChem Buyer Portal</h1>
        <button 
          onClick={() => router.push('/login')} 
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          Logout
        </button>
      </header>
      
      <input 
        type="text" placeholder="Search products (e.g. Paracetamol)..." 
        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl mb-10 outline-none focus:border-emerald-500 shadow-lg transition-all text-white"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-all shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{p.name}</h2>
              <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-400 uppercase tracking-tighter">Base: {p.base_unit}</span>
            </div>
            <p className="text-emerald-400 font-mono text-lg mb-6">₹{p.price_per_base_unit} / {p.base_unit}</p>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="number" placeholder="Qty" 
                  className="w-full p-2 bg-slate-900 rounded-lg border border-slate-700 text-white"
                  onChange={(e) => setInputQty({...inputQty, [p.id]: e.target.value})}
                />
                <select 
                  className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-sm text-white"
                  onChange={(e) => setSelectedUnit({...selectedUnit, [p.id]: e.target.value})}
                >
                  <option value={p.base_unit}>{p.base_unit}</option>
                  {p.base_unit === 'g' && <option value="kg">kg</option>}
                  {p.base_unit === 'mL' && <option value="L">L</option>}
                </select>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total: ₹{calculateTotal(p)}</span>
                <button 
                  onClick={() => placeOrder(p)}
                  className="bg-emerald-500 text-black px-5 py-2 rounded-xl font-bold text-sm hover:bg-emerald-400 transition transform active:scale-95"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}