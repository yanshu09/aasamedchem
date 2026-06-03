"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (email === "admin@medchem.com" && pass === "admin123") {
      router.push("/admin");
    } else if (email === "user@test.com" && pass === "user123") {
      router.push("/");
    } else {
      alert("Invalid Credentials! Use admin@medchem.com or user@test.com");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">AasaMedChem Login</h2>
        <input type="email" placeholder="Email" required className="w-full p-3 mb-4 bg-slate-800 rounded border border-slate-700 text-white" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full p-3 mb-6 bg-slate-800 rounded border border-slate-700 text-white" onChange={e => setPass(e.target.value)} />
        <button className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition">Login</button>
      </form>
    </div>
  );
}