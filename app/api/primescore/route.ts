import { NextResponse } from "next/server";

export async function GET() {
  // later: compute from habits + activities
  return NextResponse.json({ primeScore: 75 }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
}
