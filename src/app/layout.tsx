import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import ShowcaseNav from "@/components/ShowcaseNav";
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
  weight: ["400", "500", "700"],
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
    "An archive of expired futures.",
  alternates: { canonical: "/" },
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
    description: "An archive of expired futures.",
    siteName: "The Expected World",
    locale: "en_US",
    type: "website",
  },
};

const SealedE = ({ size = 36 }: { size?: number }) => (
  <div className="sealed-e" style={{ width: size, height: size }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="32" strokeWidth="2.5" />
      <text x="14" y="54" fontFamily="Georgia, serif" fontSize="52" fontWeight="400">E</text>
    </svg>
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${inter.variable} ${lora.variable} ${jetbrains.variable}`}
    >
      <body>
        {/* Header */}
        <header className="site-header">
          <Link href="/" className="header-left">
            <SealedE />
            <span className="header-wordmark">The Expected World</span>
          </Link>
          <nav>
            <ul className="header-nav">
              <li><Link href="/timeline">archive</Link></li>
              <li><Link href="/closing">closing</Link></li>
              <li><Link href="/about">about</Link></li>
              <li>
                <Link href="/submit" className="nav-submit-full">submit a passage</Link>
                <Link href="/submit" className="nav-submit-short">submit</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-left">
              <SealedE size={28} />
              <span className="footer-colophon">
                An archive of expired futures.
              </span>
            </div>
            <nav>
              <ul className="footer-nav">
                <li><Link href="/timeline">archive</Link></li>
                <li><Link href="/closing">closing</Link></li>
                <li><Link href="/about">about</Link></li>
                <li><Link href="/submit">submit</Link></li>
              </ul>
            </nav>
          </div>
          <div style={{
            maxWidth: "var(--max-width)",
            margin: "32px auto 0",
            textAlign: "center",
            fontFamily: "var(--fm)",
            fontSize: "0.5rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-d)",
          }}>
            MMXXVI
          </div>
        </footer>

        <ShowcaseNav />
        <Analytics />
      </body>
    </html>
  );
}
