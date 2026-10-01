"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AnalysisCard from "@/components/AnalysisCard";
import type { Activity, Lead } from "@/types";
export default function LeadPage() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null), [act, setAct] = useState<Activity[]>([]), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const load = () => { fetch(`/api/leads/${id}`).then(async (r) => (r.ok ? setLead(await r.json()) : setErr("Lead not found."))); fetch("/api/activity").then((r) => r.json()).then((a: Activity[]) => setAct(a.filter((x) => x.leadId === id))); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [id]);
  async function analyze() {
    setBusy(true); setErr(""); try { const r = await fetch("/api/leads/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (!r.ok) setErr((await r.json()).error); } catch { setErr("Network error. Try again."); }
    setBusy(false); load();
  }
  if (!lead) return <p className="text-sm text-slate-500">{err || "Loading…"}</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{lead.name}</h1>
      <div className="card grid gap-1 text-sm sm:grid-cols-2"><p><b>Contact:</b> {lead.contact || "Information not provided."}</p><p><b>Budget:</b> {lead.budget || "Information not provided."}</p><p><b>Requirement:</b> {lead.requirement || "Information not provided."}</p><p><b>Notes:</b> {lead.notes || "Information not provided."}</p></div>
      {err && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{err}</p>}
      <button className="btn" disabled={busy} onClick={analyze}>{busy ? "Analyzing…" : lead.analysis ? "Re-analyze lead" : "Analyze lead"}</button>
      {lead.analysis && <AnalysisCard a={lead.analysis} />}
      <div className="card"><h2 className="mb-2 font-semibold">Activity</h2>{act.length ? <ul className="text-sm">{act.map((a) => <li key={a.id} className="py-1">{a.text}</li>)}</ul> : <p className="text-sm text-slate-500">No activity yet.</p>}</div>
    </div>
  );
}
