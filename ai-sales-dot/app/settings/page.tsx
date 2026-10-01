"use client";
import { useEffect, useState } from "react";
import type { Business } from "@/types";
const fields: [keyof Business, string, boolean][] = [["name", "Business name", false], ["description", "Business description", true], ["products", "Products / services", true], ["targetCustomer", "Target customer", true], ["qualificationRules", "Qualification rules", true], ["salesInstructions", "Sales instructions", true]];
export default function Settings() {
  const [b, setB] = useState<Business | null>(null), [msg, setMsg] = useState("");
  useEffect(() => { fetch("/api/business").then((r) => r.json()).then(setB); }, []);
  async function save() { const r = await fetch("/api/business", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }); setMsg(r.ok ? "Saved." : (await r.json()).error); }
  if (!b) return <p className="text-sm text-slate-500">Loading…</p>;
  return (
    <div className="max-w-2xl space-y-4"><h1 className="text-2xl font-semibold">Sales Dot instructions</h1>
      {fields.map(([k, l, area]) => <label key={k} className="block text-sm font-medium">{l}{area ? <textarea className="inp mt-1" rows={3} value={b[k]} onChange={(e) => setB({ ...b, [k]: e.target.value })} /> : <input className="inp mt-1" value={b[k]} onChange={(e) => setB({ ...b, [k]: e.target.value })} />}</label>)}
      <div className="flex items-center gap-3"><button className="btn" onClick={save}>Save changes</button><span className="text-sm text-slate-600">{msg}</span></div>
    </div>
  );
}
