import type { Analysis } from "@/types";
const tone = { qualified: "bg-emerald-100 text-emerald-800", unqualified: "bg-rose-100 text-rose-800", needs_follow_up: "bg-amber-100 text-amber-800" };
const list = (a: string[]) => (a.length ? a.join(", ") : "Information not provided.");
export default function AnalysisCard({ a }: { a: Analysis }) {
  return (
    <div className="card space-y-3 text-sm">
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 font-semibold ${tone[a.qualification]}`}>{a.qualification.replace("_", " ")}</span>
        <span className="text-2xl font-semibold">{a.score}<span className="text-sm text-slate-500">/100</span></span>
        <span className="text-slate-500">Intent: {a.intent} · Budget: {a.budget.replace("_", " ")}</span>
      </div>
      <p><b>Reason:</b> {a.reason}</p>
      <p><b>Requirements:</b> {list(a.requirements)}</p>
      <p><b>Objections:</b> {list(a.objections)}</p>
      <p><b>Recommended action:</b> {a.recommended_action}</p>
      {a.follow_up_message && <p className="rounded-lg bg-mist p-3"><b>Follow-up draft:</b> {a.follow_up_message}</p>}
    </div>
  );
}
