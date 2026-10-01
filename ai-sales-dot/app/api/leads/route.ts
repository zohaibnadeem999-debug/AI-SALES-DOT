import { NextRequest, NextResponse } from "next/server";
import { repos } from "@/lib/repositories";
import { leadInput } from "@/lib/validation";
import { fail } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await repos.leads.list()); }
export async function POST(req: NextRequest) {
  try { const l = await repos.leads.create(leadInput.parse(await req.json())); await repos.activity.add(`${l.name} added`, l.id); return NextResponse.json(l, { status: 201 }); } catch (e) { return fail(e); }
}
