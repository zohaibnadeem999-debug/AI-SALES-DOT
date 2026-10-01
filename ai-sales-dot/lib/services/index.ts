import { repos } from "@/lib/repositories";
import { analyze, leadText } from "@/lib/ai/salesDot";
import type { Status } from "@/types";
const map: Record<string, Status> = { qualified: "qualified", unqualified: "unqualified", needs_follow_up: "follow_up" };
export async function analyzeLead(id: string) {
  const lead = await repos.leads.get(id);
  if (!lead) return null;
  const analysis = await analyze(await repos.dot.getBusiness(), leadText(lead));
  const updated = await repos.leads.update(id, { analysis, status: map[analysis.qualification] });
  await repos.activity.add(`${lead.name} analyzed: ${analysis.qualification.replace("_", " ")}`, id);
  return updated;
}
