import { NextResponse } from "next/server";
import { repos } from "@/lib/repositories";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await repos.activity.list()); }
