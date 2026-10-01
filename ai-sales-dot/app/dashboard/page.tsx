"use client";
import { useEffect, useState } from "react";
import { Dot } from "@/components/Nav";
import type { Activity, Lead } from "@/types";
export default function Dashboard() {
  const [leads, setL] = useState<Lead[]>([]), [act, setA] = useState<Activity[]>([]);
  useEffect(() => { fetch("/api/leads").then((r) => r.json()).then(setL).catch(() => {}); fetch("/api/activity").then((r) => r.json()).then(setA).catch(() => {}); }, []);
  const n = (s: string) => leads.filter((l) => l.status === s).length;
  const stats = [["Total leads", leads.length], ["Qualified", n("qualified")], ["Unqualified", n("unqualified")], ["Pending follow-ups", n("follow_up")]];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><Dot s={14} /><h1 className="text-2xl font-semibold">Sales Dot</h1><span className="text-sm text-emerald-700">Active</span></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{stats.map(([l, v]) => <div key={l} className="card"><div className="text-3xl font-semibold">{v}</div><div className="text-sm text-slate-500">{l}</div></div>)}</div>
      <div className="card"><h2 className="mb-3 font-semibold">Recent activity</h2>
        {act.length === 0 ? <p className="text-sm text-slate-500">Nothing yet. Add a lead to get started.</p> : <ul className="divide-y text-sm">{act.map((a) => <li key={a.id} className="py-2">{a.text}</li>)}</ul>}</div>
    </div>
  );
}
