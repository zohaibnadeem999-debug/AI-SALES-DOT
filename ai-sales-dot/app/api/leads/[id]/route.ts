import { NextResponse } from "next/server";
import { repos } from "@/lib/repositories";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const l = await repos.leads.get(params.id); return l ? NextResponse.json(l) : NextResponse.json({ error: "Lead not found." }, { status: 404 });
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const ok = await repos.leads.remove(params.id); if (ok) await repos.activity.add("A lead was deleted"); return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
