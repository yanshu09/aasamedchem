import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  try {
    // Note: sql ke baad ( ) nahi aayenge, sirf backticks aayenge
    const products = await sql`
      SELECT * FROM products 
      WHERE name ILIKE ${'%' + search + '%'}
    `;
    
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Isi file mein niche add karo jahan GET method tha
export async function POST(request: Request) {
  try {
    const { name, description, base_unit, price_per_base_unit } = await request.json();
    
    await sql`
      INSERT INTO products (name, description, base_unit, price_per_base_unit)
      VALUES (${name}, ${description}, ${base_unit}, ${price_per_base_unit})
    `;
    return NextResponse.json({ message: "Product added!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = request;
    const id = new URL(url).searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await sql`DELETE FROM products WHERE id = ${id}`;
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}