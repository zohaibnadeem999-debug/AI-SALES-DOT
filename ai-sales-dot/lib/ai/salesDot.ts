import type { Analysis, Business, Lead } from "@/types";
import { analysisSchema } from "@/lib/validation";
import { AiError, complete } from "./gemini";
const str = { type: "string" }, arr = { type: "array", items: str };
const jsonSchema = { type: "object", additionalProperties: false, required: ["qualification", "score", "intent", "budget", "requirements", "objections", "reason", "recommended_action", "follow_up_message"],
  properties: { qualification: { type: "string", enum: ["qualified", "unqualified", "needs_follow_up"] }, score: { type: "integer" }, intent: { type: "string", enum: ["high", "medium", "low", "unknown"] }, budget: { type: "string", enum: ["provided", "not_provided"] }, requirements: arr, objections: arr, reason: str, recommended_action: str, follow_up_message: str } };
export function systemPrompt(b: Business) {
  return `You are the Sales Dot, a professional AI sales assistant for ${b.name}.
Business: ${b.description}
Products/services: ${b.products}
Ideal customer: ${b.targetCustomer}
Qualification rules: ${b.qualificationRules}
Sales instructions: ${b.salesInstructions}
Rules: understand purchase intent, budget, requirements and objections; judge qualification against the rules (score 0-100); recommend one concrete next action and draft a short follow-up message. Never invent information. If something is missing, say "Information not provided." Use only facts you were given.`;
}
export async function analyze(b: Business, text: string): Promise<Analysis> {
  const raw = await complete([{ role: "system", content: systemPrompt(b) }, { role: "user", content: `Analyze this lead:\n${text}` }], jsonSchema);
  try { return analysisSchema.parse(JSON.parse(raw)); } catch { throw new AiError("The Sales Dot returned an unreadable answer. Please try again."); }
}
export const leadText = (l: Pick<Lead, "name" | "contact" | "requirement" | "budget" | "notes">) =>
  `Name: ${l.name}\nContact: ${l.contact || "Information not provided."}\nRequirement: ${l.requirement || "Information not provided."}\nBudget: ${l.budget || "Information not provided."}\nNotes: ${l.notes || "Information not provided."}`;
export async function chat(b: Business, message: string, leads: Lead[]) {
  const ctx = leads.slice(0, 20).map((l) => `- ${l.name}: ${l.analysis?.qualification ?? l.status}`).join("\n");
  return complete([{ role: "system", content: systemPrompt(b) + `\nKnown leads:\n${ctx}\nAnswer briefly.` }, { role: "user", content: message }]);
}
