import { NextResponse } from "next/server";

// In-memory store for MVP (replace with Supabase in production)
const subscribers = new Set<string>();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    if (subscribers.has(email)) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
    }

    subscribers.add(email);
    console.log(`[Newsletter] New subscriber: ${email} (total: ${subscribers.size})`);

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
