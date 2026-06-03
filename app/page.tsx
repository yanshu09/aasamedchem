"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuyerPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); // New state for history
  const [search, setSearch] = useState("");
  const [inputQty, setInputQty] = useState<any>({});
  const [selectedUnit, setSelectedUnit] = useState<any>({});

  const fetchData = async () => {
    const [resProducts, resOrders] = await Promise.all([
      fetch(`/api/products?search=${search}`),
      fetch("/api/orders") // Fetching orders for history
    ]);
    setProducts(await resProducts.json());
    setOrders(await resOrders.json());
  };

  useEffect(() => { fetchData(); }, [search]);

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

    if (res.ok) {
      alert("Order Placed!");
      fetchData(); // Refresh history instantly
    }
  };

  const handleCustomRequest = async (e: any) => {
    e.preventDefault();
    const target = e.target;
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chemical_name: target.c_name.value,
        required_qty: target.c_qty.value,
        preferred_unit: target.c_unit.value,
        urgency_notes: target.c_notes.value
      })
    });
    if(res.ok) { alert("Request Logged!"); target.reset(); }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">AasaMedChem Portal</h1>
        <button onClick={() => router.push('/login')} className="bg-slate-800 px-4 py-2 rounded-xl text-sm">Logout</button>
      </header>
      
      <input 
        type="text" placeholder="Search chemicals..." 
        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl mb-10 outline-none focus:border-emerald-500"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 1. Product Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {products.map(p => (
          <div key={p.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-all">
            <h2 className="text-xl font-bold mb-2">{p.name}</h2>
            <p className="text-emerald-400 font-mono mb-4">₹{p.price_per_base_unit} / {p.base_unit}</p>
            <div className="flex gap-2 mb-4">
              <input type="number" placeholder="Qty" className="w-full p-2 bg-slate-900 rounded border border-slate-700" onChange={(e) => setInputQty({...inputQty, [p.id]: e.target.value})} />
              <select className="bg-slate-900 p-2 rounded border border-slate-700" onChange={(e) => setSelectedUnit({...selectedUnit, [p.id]: e.target.value})}>
                <option value={p.base_unit}>{p.base_unit}</option>
                {p.base_unit === 'g' && <option value="kg">kg</option>}
                {p.base_unit === 'mL' && <option value="L">L</option>}
              </select>
            </div>
            <div className="flex justify-between items-center border-t border-slate-700 pt-3">
              <span className="text-xs text-slate-400">Total: ₹{calculateTotal(p)}</span>
              <button onClick={() => placeOrder(p)} className="bg-emerald-500 text-black px-4 py-2 rounded-lg font-bold text-xs">Order Now</button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. ORDER HISTORY SECTION (NEW) */}
      <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700 mb-12 shadow-inner">
        <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
          🕒 Your Order History & Status
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700/50">
                <th className="pb-3 px-2">Chemical</th>
                <th className="pb-3 px-2">Quantity</th>
                <th className="pb-3 px-2">Final Price</th>
                <th className="pb-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-slate-800/30">
                  <td className="py-4 px-2 font-medium">{o.product_name}</td>
                  <td className="py-4 px-2">{o.quantity} {o.unit}</td>
                  <td className="py-4 px-2 text-emerald-400">₹{o.total_price_inr}</td>
                  <td className="py-4 px-2 text-right">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${o.status === 'Completed' ? 'bg-blue-900/40 text-blue-400' : 'bg-yellow-900/40 text-yellow-500'}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-6 text-slate-600 italic">No previous orders found.</p>}
        </div>
      </div>

     {/* 3. PROCUREMENT FORM (IMAGE STYLE) */}
      <div className="max-w-4xl mx-auto mb-20 bg-slate-800/40 border border-slate-700 rounded-[2rem] p-12 shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">Can't find a specific chemical?</h2>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
            Submit a specialized procurement inquiry, and our supply network will analyze the availability.
          </p>
        </div>

        <form onSubmit={handleCustomRequest} className="space-y-6">
          <input 
            name="c_name" 
            type="text" 
            placeholder="Chemical / Compound Name or Formula" 
            required 
            className="w-full p-4 bg-[#0f172a] rounded-xl border border-slate-700 text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" 
          />
          
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              name="c_qty" 
              type="number" 
              placeholder="Target Quantity" 
              required 
              className="flex-1 p-4 bg-[#0f172a] rounded-xl border border-slate-700 text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" 
            />
            <select 
              name="c_unit" 
              className="w-full md:w-48 p-4 bg-[#0f172a] rounded-xl border border-slate-700 text-white outline-none cursor-pointer focus:border-emerald-500 transition-all"
            >
              <option value="g">Grams (g)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="mL">Milliliters (mL)</option>
              <option value="L">Liters (L)</option>
            </select>
          </div>

          <textarea 
            name="c_notes" 
            placeholder="Specify purity standards (e.g., USP Grade) or specific usage context..." 
            rows={4} 
            className="w-full p-4 bg-[#0f172a] rounded-xl border border-slate-700 text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 resize-none" 
          />

          <button 
            type="submit" 
            className="w-full bg-[#10b981] hover:bg-[#059669] text-[#0f172a] font-bold text-lg py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
          >
            Submit Sourcing Ticket
          </button>
        </form>
      </div>
    </div>
  );
}
