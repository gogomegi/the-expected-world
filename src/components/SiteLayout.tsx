import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-divider">
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
          <Link href="/predictions" className="text-dusk text-sm hover:text-parchment transition-colors">
            Browse
          </Link>
          <Link href="/about" className="text-dusk text-sm hover:text-parchment transition-colors">
            About
          </Link>
          <Link href="/submit" className="text-dusk text-sm hover:text-parchment transition-colors">
            Submit
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-divider bg-ink text-center py-16 px-12 max-md:px-4">
      <p className="font-display font-semibold text-sm tracking-[0.25em] uppercase text-dusk mb-6">
        The Expected World
      </p>
      <nav className="flex gap-6 justify-center mb-6">
        <Link href="/predictions" className="text-graphite text-[13px] hover:text-parchment transition-colors">
          Archive
        </Link>
        <Link href="/about" className="text-graphite text-[13px] hover:text-parchment transition-colors">
          About
        </Link>
        <Link href="/submit" className="text-graphite text-[13px] hover:text-parchment transition-colors">
          Submit
        </Link>
        <Link href="/newsletter" className="text-graphite text-[13px] hover:text-parchment transition-colors">
          Newsletter
        </Link>
      </nav>
      <div className="w-[200px] h-px bg-divider mx-auto my-8" />
      <p className="text-graphite text-[11px]">
        &copy; {new Date().getFullYear()} The Expected World. A project by Expected Worlds.
      </p>
    </footer>
  );
}
