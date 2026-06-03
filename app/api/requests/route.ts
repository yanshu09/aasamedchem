import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { chemical_name, required_qty, preferred_unit, urgency_notes } = await request.json();
    await sql`
      INSERT INTO custom_requests (chemical_name, required_qty, preferred_unit, urgency_notes)
      VALUES (${chemical_name}, ${required_qty}, ${preferred_unit}, ${urgency_notes})
    `;
    return NextResponse.json({ success: true, message: "Custom sourcing ticket generated!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await sql`SELECT * FROM custom_requests ORDER BY created_at DESC`;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}