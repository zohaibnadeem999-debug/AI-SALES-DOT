"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Lead } from "@/types";
const empty = { name: "", contact: "", requirement: "", budget: "", notes: "" };
export default function Leads() {
  const [leads, setL] = useState<Lead[]>([]), [f, setF] = useState(empty), [open, setOpen] = useState(false), [err, setErr] = useState(""), [busy, setBusy] = useState("");
  const load = useCallback(() => fetch("/api/leads").then((r) => r.json()).then(setL).catch(() => setErr("Could not load leads.")), []);
  useEffect(() => { load(); }, [load]);
  async function add() {
    setErr(""); const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (!r.ok) return setErr((await r.json()).error); setF(empty); setOpen(false); load();
  }
  async function analyze(id: string) {
    setErr(""); setBusy(id); try { const r = await fetch("/api/leads/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (!r.ok) setErr((await r.json()).error); } catch { setErr("Network error. Try again."); }
    setBusy(""); load();
  }
  async function del(id: string) { await fetch(`/api/leads/${id}`, { method: "DELETE" }); load(); }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Leads</h1><button className="btn" onClick={() => setOpen(!open)}>Add lead</button></div>
      {err && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{err}</p>}
      {open && <div className="card grid gap-3 sm:grid-cols-2">{(Object.keys(empty) as (keyof typeof empty)[]).map((k) => <input key={k} className="inp" placeholder={k[0].toUpperCase() + k.slice(1)} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />)}<button className="btn w-fit" onClick={add}>Save lead</button></div>}
      <div className="card overflow-x-auto p-0"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50 text-slate-500"><tr>{["Name", "Contact", "Requirement", "Budget", "Status", "AI score", "Next action", ""].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>{leads.map((l) => <tr key={l.id} className="border-b last:border-0"><td className="px-3 py-2 font-medium">{l.name}</td><td className="px-3 py-2">{l.contact}</td><td className="px-3 py-2">{l.requirement}</td><td className="px-3 py-2">{l.budget}</td><td className="px-3 py-2">{l.status.replace("_", " ")}</td><td className="px-3 py-2">{l.analysis?.score ?? "–"}</td><td className="px-3 py-2">{l.analysis?.recommended_action ?? "Analyze to get one"}</td>
          <td className="space-x-2 whitespace-nowrap px-3 py-2"><button className="text-dot" disabled={busy === l.id} onClick={() => analyze(l.id)}>{busy === l.id ? "Analyzing…" : "Analyze"}</button><Link className="text-dot" href={`/leads/${l.id}`}>View</Link><button className="text-rose-600" onClick={() => del(l.id)}>Delete</button></td></tr>)}</tbody></table>
        {leads.length === 0 && <p className="p-4 text-sm text-slate-500">No leads yet. Add your first lead.</p>}</div>
    </div>
  );
}
