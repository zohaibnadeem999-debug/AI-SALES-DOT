export type Status = "new" | "qualified" | "unqualified" | "follow_up";
export interface Analysis { qualification: "qualified" | "unqualified" | "needs_follow_up"; score: number; intent: "high" | "medium" | "low" | "unknown"; budget: "provided" | "not_provided"; requirements: string[]; objections: string[]; reason: string; recommended_action: string; follow_up_message: string }
export interface Lead { id: string; name: string; contact: string; requirement: string; budget: string; notes: string; status: Status; analysis?: Analysis; createdAt: string }
export interface Business { name: string; description: string; products: string; targetCustomer: string; qualificationRules: string; salesInstructions: string }
export interface Activity { id: string; leadId?: string; text: string; at: string }
