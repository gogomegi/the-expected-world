import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Serif_4, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400"],
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
    description: "An archive of expired futures — and a watch on the ones still closing.",
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
      className={`${cormorant.variable} ${sourceSerif.variable} ${spaceGrotesk.variable} ${ibmMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "var(--color-bg)",
            maxWidth: "var(--max-width-layout)",
            margin: "0 auto",
            width: "100%",
            padding: "var(--space-3) var(--space-6)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.125rem",
              fontWeight: 300,
              color: "var(--color-text)",
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-sealed-e.svg"
              alt=""
              width={24}
              height={24}
              className="header-logo"
              style={{ display: "block" }}
            />
            The Expected World
          </Link>
          <nav style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)" }}>
            {[
              ["/", "archive"],
              ["/timeline", "by era"],
              ["/about", "about"],
              ["/submit", "submit a passage"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="nav-link">
                {label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer
          style={{
            borderTop: "1px solid rgba(120, 113, 103, 0.2)",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "var(--max-width-layout)",
              margin: "0 auto",
              padding: "var(--space-6) var(--space-6) var(--space-5)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sidebar)",
                fontStyle: "italic",
                color: "var(--color-secondary)",
                maxWidth: "var(--max-width-prose)",
                margin: "0 auto",
              }}
            >
              The Expected World is an archive of expired futures — and a watch
              on the ones still closing.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
