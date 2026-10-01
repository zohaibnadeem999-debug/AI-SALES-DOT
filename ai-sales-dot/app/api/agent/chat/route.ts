import { NextRequest, NextResponse } from "next/server";
import { repos } from "@/lib/repositories";
import { chatInput } from "@/lib/validation";
import { analyze, chat } from "@/lib/ai/salesDot";
import { fail, limited, tooMany } from "@/lib/http";
export async function POST(req: NextRequest) {
  if (limited(req, 15)) return tooMany();
  try {
    const { message } = chatInput.parse(await req.json());
    const b = await repos.dot.getBusiness();
    if (/analy[sz]e/i.test(message) && message.length > 30) { const analysis = await analyze(b, message); await repos.activity.add(`Chat analysis: ${analysis.qualification.replace("_", " ")}`); return NextResponse.json({ reply: "Here is my analysis.", analysis }); }
    return NextResponse.json({ reply: await chat(b, message, await repos.leads.list()) });
  } catch (e) { return fail(e); }
}
