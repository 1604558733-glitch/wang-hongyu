import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET() {
  return NextResponse.json(await db.community.findMany({ orderBy: [{ city: "asc" }, { name: "asc" }] }));
}
