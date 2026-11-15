import { redirect } from "next/navigation";

// Accuracy verdicts are no longer part of the public editorial approach.
// Keep this route to redirect older bookmarks to the archive.
export default function VerdictsPage() {
  redirect("/timeline");
}
