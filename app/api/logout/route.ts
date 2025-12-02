import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // 1. Get the cookie store
  const cookieStore = await cookies();

  // 2. Delete the auth cookie
  cookieStore.delete("prime_user");

  // 3. Return success
  return NextResponse.json({ success: true }, { status: 200 });
}
