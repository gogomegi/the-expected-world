import { isAuthenticated } from "@/lib/admin-auth";
import { getHomepageOrder, saveHomepageOrder } from "@/lib/ordering";
import type { HeroSlideConfig } from "@/lib/ordering";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(getHomepageOrder());
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const order = (await request.json()) as HeroSlideConfig[];
  saveHomepageOrder(order);
  return Response.json({ ok: true });
}
