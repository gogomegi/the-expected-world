import { isAuthenticated, verifyPassword, ADMIN_COOKIE } from "@/lib/admin-auth";
import { cookies } from "next/headers";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const { password } = await request.json();
  if (!verifyPassword(password)) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
