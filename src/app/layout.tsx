import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800", "900"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const BASE_URL = "https://theexpectedworld.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "The Expected World",
    template: "%s | The Expected World",
  },
  description:
    "An archive of expired futures — and a watch on the ones still closing.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "The Expected World",
    description:
      "An archive of expired futures — and a watch on the ones still closing.",
    siteName: "The Expected World",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${inter.variable} ${lora.variable} ${jetbrains.variable}`}
    >
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Fixed header with gradient fade */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "20px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <span
              style={{
                width: "36px",
                height: "36px",
                border: "1.5px solid var(--text-on-dark)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-quote)",
                fontSize: "1rem",
                color: "var(--text-on-dark)",
              }}
            >
              E
            </span>
            <span
              className="hide-mobile"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-on-dark)",
              }}
            >
              The Expected World
            </span>
          </Link>
          <nav style={{ display: "flex", gap: "32px", listStyle: "none" }}>
            {[
              ["/timeline", "archive"],
              ["/closing", "closing"],
              ["/about", "about"],
              ["/submit", "submit"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="nav-link-v3">
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        {/* Footer */}
        <footer
          style={{
            padding: "80px 48px",
            background: "var(--black)",
            borderTop: "1px solid var(--rule-dark)",
          }}
        >
          <div
            style={{
              maxWidth: "var(--max-width)",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  border: "1.5px solid var(--text-on-dark)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-quote)",
                  fontSize: "0.8125rem",
                  color: "var(--text-on-dark)",
                }}
              >
                E
              </span>
              <p
                style={{
                  fontFamily: "var(--font-quote)",
                  fontStyle: "italic",
                  fontSize: "0.8125rem",
                  color: "var(--muted-dark)",
                  maxWidth: "360px",
                  margin: 0,
                }}
              >
                An archive of expired futures — and a watch on the ones still
                closing.
              </p>
            </div>
            <nav
              className="hide-mobile"
              style={{ display: "flex", gap: "24px", listStyle: "none" }}
            >
              {[
                ["/timeline", "archive"],
                ["/closing", "closing"],
                ["/about", "about"],
                ["/submit", "submit"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="nav-link-v3">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
