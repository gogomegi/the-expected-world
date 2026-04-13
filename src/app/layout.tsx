import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Expected World",
    template: "%s | The Expected World",
  },
  description:
    "An archive of expired futures. Passages, predictions, and forecasts addressed to dates that have since passed.",
  openGraph: {
    title: "The Expected World",
    description: "An archive of expired futures. Passages, predictions, and forecasts addressed to dates that have since passed.",
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
      className={`${cormorant.variable} ${sourceSerif.variable} ${ibmMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
