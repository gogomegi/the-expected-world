import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Expected World — Historical Visions of Tomorrow",
    template: "%s | The Expected World",
  },
  description:
    "Collecting historical predictions about the future and evaluating whether they came true. Explore visions of tomorrow from every era.",
  openGraph: {
    siteName: "The Expected World",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500&family=Newsreader:ital,wght@0,400;1,400&family=Space+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-deep-ink text-parchment">
        <header className="sticky top-0 z-50 bg-deep-ink/95 backdrop-blur-sm border-b border-divider">
          <nav className="max-w-[1200px] mx-auto px-12 max-md:px-4 h-[72px] max-md:h-[56px] flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="font-display font-semibold text-[20px] max-md:text-[16px] uppercase tracking-[0.25em] text-parchment"
              >
                The Expected World
              </Link>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-dusk max-md:hidden">
                The future, as they saw it.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/predictions"
                className="text-dusk text-sm hover:text-parchment transition-colors duration-200"
              >
                Browse
              </Link>
              <Link
                href="/about"
                className="text-dusk text-sm hover:text-parchment transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/submit"
                className="text-dusk text-sm hover:text-parchment transition-colors duration-200"
              >
                Submit
              </Link>
            </div>
          </nav>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-divider bg-deep-ink text-center py-16 px-12 max-md:px-4">
          <p className="font-display font-semibold text-[20px] uppercase tracking-[0.25em] text-parchment">
            The Expected World
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-dusk mt-2">
            The future, as they saw it.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <Link href="/predictions" className="text-dusk text-sm hover:text-parchment transition-colors">
              Archive
            </Link>
            <Link href="/about" className="text-dusk text-sm hover:text-parchment transition-colors">
              About
            </Link>
            <Link href="/submit" className="text-dusk text-sm hover:text-parchment transition-colors">
              Submit
            </Link>
            <Link href="/newsletter" className="text-dusk text-sm hover:text-parchment transition-colors">
              Newsletter
            </Link>
          </div>
          <div className="w-[200px] h-px bg-divider mx-auto my-8" />
          <p className="text-graphite text-xs">
            &copy; {new Date().getFullYear()} The Expected World. A project by Expected Worlds.
          </p>
        </footer>
      </body>
    </html>
  );
}
