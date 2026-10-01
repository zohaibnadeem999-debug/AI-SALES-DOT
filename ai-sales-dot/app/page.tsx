import Link from "next/link";
import { Dot } from "@/components/Nav";
const features = [["Qualifies leads", "Scores each lead against your own rules and says why."], ["Knows your business", "Answers using only the instructions you give it."], ["Suggests the next move", "Every lead gets a clear action and a draft follow-up."], ["Keeps a history", "See what the Sales Dot did and when."]];
const steps = ["Describe your business", "Add or paste a lead", "Get a verdict and next action"];
export default function Home() {
  return (
    <div className="space-y-16 py-6">
      <section className="max-w-2xl space-y-5">
        <Dot s={16} />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Your AI Sales Employee</h1>
        <p className="text-lg text-slate-600">Qualify leads, understand customers, and recommend the next action.</p>
        <div className="flex gap-3"><Link href="/settings" className="btn">Create Your Sales Dot</Link><Link href="/dashboard" className="btn2">Try Demo</Link></div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">{features.map(([t, d]) => <div key={t} className="card"><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></div>)}</section>
      <section className="flex flex-wrap items-center gap-3 text-sm">{steps.map((s, i) => <span key={s} className="flex items-center gap-3"><span className="rounded-full border border-slate-300 bg-white px-4 py-2">{s}</span>{i < 2 && <span className="text-slate-400">then</span>}</span>)}</section>
    </div>
  );
}
