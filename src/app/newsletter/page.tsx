import type { Metadata } from "next";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Get a daily prediction delivered to your inbox. Subscribe to The Expected World newsletter.",
};

export default function NewsletterPage() {
  return (
    <main
      style={{
        background: "var(--cream)",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 48px 80px",
      }}
    >
      <NewsletterSignup variant="inline" />
    </main>
  );
}
