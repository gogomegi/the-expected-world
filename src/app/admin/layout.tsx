import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — The Expected World",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        // Force light theme for admin panel
        background: "#FAF6F0",
        color: "#1a1a1a",
        minHeight: "100vh",
        // Override CSS variables for any child components
        // that reference the site's dark theme vars
        ["--color-bg" as string]: "#FAF6F0",
        ["--color-text" as string]: "#1a1a1a",
        ["--color-secondary" as string]: "#6b6560",
        ["--color-accent" as string]: "#2B5CE6",
        ["--black" as string]: "#FAF6F0",
        ["--text-d" as string]: "#1a1a1a",
        ["--muted-d" as string]: "rgba(10,10,10,0.4)",
        ["--rule-d" as string]: "rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}
