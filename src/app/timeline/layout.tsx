import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline — Archive of Expired Futures",
  description:
    "Browse predictions spanning over 200 years — from 19th century prophecies to modern forecasts — and see what actually happened.",
  alternates: { canonical: "/timeline" },
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
