import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeLead } from "@/lib/services";
import { fail, limited, tooMany } from "@/lib/http";
export async function POST(req: NextRequest) {
  if (limited(req, 10)) return tooMany();
  try { const { id } = z.object({ id: z.string().min(1).max(40) }).parse(await req.json()); const l = await analyzeLead(id); return l ? NextResponse.json(l) : NextResponse.json({ error: "Lead not found." }, { status: 404 }); } catch (e) { return fail(e); }
}
