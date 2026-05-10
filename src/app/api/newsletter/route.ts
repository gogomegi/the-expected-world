import { NextRequest, NextResponse } from "next/server";
import { readSubscribers, writeSubscribers } from "@/lib/newsletter-store";

export async function GET() {
  try {
    const subscribers = await readSubscribers();
    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json(
      { error: "Failed to load subscribers." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const subscribers = await readSubscribers();

    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json({ message: "You're already subscribed!" });
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    await writeSubscribers(subscribers);

    return NextResponse.json({ message: "Welcome aboard." });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
