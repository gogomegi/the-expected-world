import { isAuthenticated } from "@/lib/admin-auth";
import { getArchiveOrder, saveArchiveOrder } from "@/lib/ordering";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(getArchiveOrder());
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const order = (await request.json()) as string[];
  saveArchiveOrder(order);
  return Response.json({ ok: true });
}
