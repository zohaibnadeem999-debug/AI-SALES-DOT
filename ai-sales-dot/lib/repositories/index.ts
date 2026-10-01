import type { Activity, Analysis, Business, Lead } from "@/types";
// Interfaces: in V2 add Supabase* implementations and change only the `repos` export.
export interface LeadRepository { list(): Promise<Lead[]>; get(id: string): Promise<Lead | null>; create(l: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead>; update(id: string, p: Partial<Lead>): Promise<Lead | null>; remove(id: string): Promise<boolean> }
export interface DotRepository { getBusiness(): Promise<Business>; saveBusiness(b: Business): Promise<Business> }
export interface ActivityRepository { list(): Promise<Activity[]>; add(text: string, leadId?: string): Promise<Activity> }
const id = () => Math.random().toString(36).slice(2, 10);
const an = (q: Analysis["qualification"], score: number, reason: string, act: string): Analysis => ({ qualification: q, score, intent: score > 70 ? "high" : "medium", budget: "provided", requirements: [], objections: [], reason, recommended_action: act, follow_up_message: "" });
function seed() {
  const now = new Date().toISOString();
  const leads: Lead[] = [
    { id: "ali", name: "Ali Khan", contact: "ali@example.com", requirement: "3-bed apartment in DHA, ready to move", budget: "PKR 45M", notes: "Wants to visit this week.", status: "qualified", createdAt: now, analysis: an("qualified", 86, "Clear purchase intent, stated budget and timeline.", "Schedule a property viewing.") },
    { id: "sarah", name: "Sarah Ahmed", contact: "+92 300 1234567", requirement: "Investment plot, location open", budget: "", notes: "Asked about payment plans.", status: "follow_up", createdAt: now, analysis: an("needs_follow_up", 55, "Interested, but budget was not provided.", "Ask for a budget range and timeline.") },
    { id: "hamza", name: "Hamza Malik", contact: "hamza@example.com", requirement: "Rent a studio under PKR 50k", budget: "PKR 50k/mo", notes: "", status: "unqualified", createdAt: now, analysis: an("unqualified", 18, "Wants to rent; the business only sells.", "Politely decline and refer elsewhere.") },
  ];
  const activity: Activity[] = leads.map((l, i) => ({ id: "a" + i, leadId: l.id, text: `${l.name} analyzed: ${l.analysis!.qualification.replace("_", " ")}`, at: now }));
  const business: Business = { name: "Nova Real Estate", description: "Boutique agency selling residential property in Karachi.", products: "Apartments, houses and investment plots (sales only).", targetCustomer: "Buyers with a clear budget of PKR 20M+ and a 6-month horizon.", qualificationRules: "Qualified: budget stated, needs match listings, buying within 6 months. Unqualified: renters or no budget.", salesInstructions: "Friendly and concise. Always propose a concrete next step." };
  return { leads, activity, business };
}
const g = globalThis as unknown as { __db?: ReturnType<typeof seed> };
const db = () => (g.__db ??= seed());
class LocalLeadRepository implements LeadRepository {
  async list() { return [...db().leads].reverse(); }
  async get(i: string) { return db().leads.find((l) => l.id === i) ?? null; }
  async create(l: Omit<Lead, "id" | "createdAt" | "status">) { const n: Lead = { ...l, id: id(), status: "new", createdAt: new Date().toISOString() }; db().leads.push(n); return n; }
  async update(i: string, p: Partial<Lead>) { const l = db().leads.find((x) => x.id === i); if (!l) return null; Object.assign(l, p, { id: l.id }); return l; }
  async remove(i: string) { const d = db(), n = d.leads.length; d.leads = d.leads.filter((l) => l.id !== i); return d.leads.length < n; }
}
class LocalDotRepository implements DotRepository { async getBusiness() { return db().business; } async saveBusiness(b: Business) { db().business = b; return b; } }
class LocalActivityRepository implements ActivityRepository {
  async list() { return [...db().activity].reverse().slice(0, 30); }
  async add(text: string, leadId?: string) { const a = { id: id(), leadId, text, at: new Date().toISOString() }; db().activity.push(a); return a; }
}
export const repos = { leads: new LocalLeadRepository() as LeadRepository, dot: new LocalDotRepository() as DotRepository, activity: new LocalActivityRepository() as ActivityRepository };
