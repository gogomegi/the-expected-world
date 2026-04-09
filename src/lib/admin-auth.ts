import { cookies } from "next/headers";

const ADMIN_COOKIE = "tew-admin-session";

export async function isAuthenticated(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === password;
}

export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return input === password;
}

export { ADMIN_COOKIE };
