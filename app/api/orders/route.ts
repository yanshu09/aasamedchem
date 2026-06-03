import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { product_name, quantity, unit, total_price_inr } = await request.json();
  try {
    await sql`
      INSERT INTO orders (product_name, quantity, unit, total_price_inr)
      VALUES (${product_name}, ${quantity}, ${unit}, ${total_price_inr})
    `;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}