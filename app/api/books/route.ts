import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${API_KEY}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  return NextResponse.json(data);
}
