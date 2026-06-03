"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]); // New state for market demand
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("g");
  const [price, setPrice] = useState("");
  const router = useRouter();

  const fetchSellerData = async () => {
    try {
      // Parallel fetch for active inventory and buyer sourcing requests
      const [resProducts, resRequests] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/requests")
      ]);

      setProducts(await resProducts.json());
      setRequests(await resRequests.json());
    } catch (error) {
      console.error("Error fetching seller dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, base_unit: unit, price_per_base_unit: price }),
    });
    if (res.ok) {
      alert("Chemical Successfully Added to Catalog!");
      setName(""); 
      setPrice("");
      fetchSellerData(); // Refresh both inventory list
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure this product is unavailable? It will be removed from the marketplace.")) {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Product removed from catalog!");
        fetchSellerData(); // Refresh list
      }
    }
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white font-sans">
      {/* Header Panel */}
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-blue-400 tracking-tight">Seller Dashboard</h1>
          <p className="text-slate-500 text-sm">Manage chemical inventory and fulfill open market demands</p>
        </div>
        <button 
          onClick={() => router.push('/login')} 
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Form Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl h-fit">
          <h2 className="text-xl font-bold mb-6 text-blue-300">Add New Chemical</h2>
          <form onSubmit={handleAdd} className="space-y-4 text-sm">
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Chemical Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full p-3 mt-1 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:border-blue-500 transition-all" 
                placeholder="e.g. Sodium Chloride (NaCl)" 
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Base Unit</label>
                <select 
                  value={unit} 
                  onChange={e => setUnit(e.target.value)} 
                  className="w-full p-3 mt-1 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none cursor-pointer"
                >
                  <option value="g">Grams (g)</option>
                  <option value="mL">Milliliters (mL)</option>
                  <option value="item">Items</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Price per Unit (₹)</label>
                <input 
                  type="number" 
                  step="any" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  required 
                  className="w-full p-3 mt-1 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:border-blue-500 transition-all" 
                  placeholder="0.00" 
                />
              </div>
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-900/20 transform active:scale-[0.98]">
              List Product Live
            </button>
          </form>
        </div>

        {/* Right Column: Active Inventory & Custom Demand Sections */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: Active Marketplace Inventory */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-blue-300 flex items-center gap-2">
              📦 Your Active Catalog <span className="text-xs bg-blue-900/30 px-2 py-1 rounded text-blue-400">{products.length}</span>
            </h2>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 flex justify-between items-center group hover:border-blue-500 transition-all">
                    <div>
                      <h3 className="font-bold text-slate-200">{p.name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">₹{p.price_per_base_unit} / {p.base_unit}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-xs font-bold px-3 py-1.5 border border-red-500/20 rounded-lg text-red-400 bg-red-950/10 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                      Mark Unavailable
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">No products listed under your seller profile yet.</p>
            )}
          </div>

          {/* Section 2: Market Demand Sourcing Requests (The feature you added!) */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-orange-400 flex items-center gap-2">
              🔥 Live Market Demand (Custom Requests) <span className="text-xs bg-orange-950/40 px-2 py-1 rounded text-orange-400">{requests.length}</span>
            </h2>
            
            {requests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map(r => (
                  <div key={r.id} className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl hover:border-orange-500/30 transition">
                    <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider bg-orange-950/30 px-2 py-0.5 rounded float-right">
                      Open Inquiry
                    </span>
                    <h3 className="font-bold text-slate-200 text-base">{r.chemical_name}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Required Volume: <span className="text-emerald-400 font-mono font-bold">{r.required_qty} {r.preferred_unit}</span>
                    </p>
                    {r.urgency_notes && (
                      <p className="text-xs text-slate-500 mt-3 italic bg-slate-950/50 p-2 rounded border border-slate-800">
                        Specs: "{r.urgency_notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">No custom procurement requests from buyers at the moment.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}