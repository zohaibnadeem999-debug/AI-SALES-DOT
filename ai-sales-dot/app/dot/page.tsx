"use client";
import { useEffect, useState } from "react";
import { Dot } from "@/components/Nav";
import AnalysisCard from "@/components/AnalysisCard";
import type { Analysis, Business } from "@/types";
type Msg = { role: "user" | "dot"; text: string; analysis?: Analysis; error?: boolean };
export default function DotPage() {
  const [biz, setBiz] = useState<Business | null>(null), [msgs, setMsgs] = useState<Msg[]>([]), [text, setText] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/business").then((r) => r.json()).then(setBiz).catch(() => {}); }, []);
  async function send() {
    const message = text.trim(); if (!message || busy) return;
    setMsgs((m) => [...m, { role: "user", text: message }]); setText(""); setBusy(true);
    try {
      const r = await fetch("/api/agent/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) }), j = await r.json();
      setMsgs((m) => [...m, r.ok ? { role: "dot", text: j.reply, analysis: j.analysis } : { role: "dot", text: j.error || "Something went wrong.", error: true }]);
    } catch { setMsgs((m) => [...m, { role: "dot", text: "Network error. Check your connection and try again.", error: true }]); }
    setBusy(false);
  }
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <aside className="card space-y-2 text-sm md:col-span-1">
        <div className="flex items-center gap-2"><Dot s={14} /><b>{biz?.name ?? "Sales Dot"}</b><span className="text-emerald-700">Active</span></div>
        <p className="text-slate-600">{biz?.description}</p><p><b>Qualifies:</b> {biz?.qualificationRules}</p><p><b>Tone:</b> {biz?.salesInstructions}</p>
      </aside>
      <section className="space-y-3 md:col-span-2">
        <div className="space-y-3">{msgs.length === 0 && <p className="text-sm text-slate-500">Try: “Analyze this lead: Name Omar, wants a 2-bed flat, budget PKR 30M, ready to buy next month.”</p>}
          {msgs.map((m, i) => <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-xl bg-dot p-3 text-sm text-white" : `max-w-[95%] space-y-2 rounded-xl p-3 text-sm ${m.error ? "bg-rose-50 text-rose-800" : "bg-white"}`}><p className="whitespace-pre-wrap">{m.text}</p>{m.analysis && <AnalysisCard a={m.analysis} />}</div>)}
          {busy && <p className="text-sm text-slate-500">Sales Dot is thinking…</p>}</div>
        <div className="flex gap-2"><textarea className="inp" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about the business or paste a lead to analyze" aria-label="Message" /><button className="btn" disabled={busy} onClick={send}>Send</button></div>
      </section>
    </div>
  );
}
