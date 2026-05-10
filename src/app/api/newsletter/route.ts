import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const SUBSCRIBERS_FILE = join(DATA_DIR, "newsletter-subscribers.json");

interface Subscriber {
  email: string;
  subscribedAt: string;
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
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

    const subscribers = await getSubscribers();

    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json({ message: "You're already subscribed!" });
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    await saveSubscribers(subscribers);

    return NextResponse.json({ message: "Welcome aboard." });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
