import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_COOKIE = "tew-admin-session";

function getSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("tew-session").digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  const token = getSessionToken();
  if (!token) return false;
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!cookieValue) return false;
  try {
    return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(token));
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !input) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(password));
  } catch {
    return false;
  }
}

export { ADMIN_COOKIE, getSessionToken };
