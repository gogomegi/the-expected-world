import { redirect } from "next/navigation";

// Preserve a useful destination for old accuracy-verdict links.
export default function VerdictPage() {
  redirect("/timeline");
}
