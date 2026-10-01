import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AiError } from "@/lib/ai/gemini";
const hits = new Map<string, { n: number; t: number }>();
export function limited(req: NextRequest, max = 30) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local", now = Date.now(), h = hits.get(ip);
  if (!h || now - h.t > 60000) { hits.set(ip, { n: 1, t: now }); return false; }
  return ++h.n > max;
}
export const tooMany = () => NextResponse.json({ error: "Too many requests. Wait a minute and try again." }, { status: 429 });
export function fail(e: unknown) {
  if (e instanceof AiError) return NextResponse.json({ error: e.message }, { status: 502 });
  if (e instanceof ZodError) return NextResponse.json({ error: e.issues[0]?.message || "Some fields are invalid." }, { status: 400 });
  if (e instanceof SyntaxError) return NextResponse.json({ error: "Request body was not valid JSON." }, { status: 400 });
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
