import { NextRequest, NextResponse } from "next/server";
import { repos } from "@/lib/repositories";
import { businessInput } from "@/lib/validation";
import { fail } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await repos.dot.getBusiness()); }
export async function PUT(req: NextRequest) { try { return NextResponse.json(await repos.dot.saveBusiness(businessInput.parse(await req.json()))); } catch (e) { return fail(e); } }
