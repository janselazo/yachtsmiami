import { brand } from "@/data/brand";

const footerLinks = [
  { href: "#fleet", label: "Fleet" },
  { href: "#experiences", label: "Experiences" },
  { href: "#book", label: "Book" },
];

export function SiteFooter() {
  return (
    <footer className="site-section-water border-t border-sea-glow/15 px-6 py-14 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <p className="font-display text-3xl font-black text-cream">
              {brand.shortName}
            </p>
            <p className="site-header-logo-sub mt-2">Yachts Miami</p>
            <p className="mt-4 text-sm leading-relaxed text-cream-muted">
              Cheers, friends, and the open sea — that is how the best Miami
              memories are made.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-10 gap-y-3">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="grid gap-3 text-sm text-cream-muted lg:text-right">
            <a href={brand.phoneHref} className="transition hover:text-cream">
              {brand.phone}
            </a>
            <a href={brand.emailHref} className="transition hover:text-cream">
              {brand.email}
            </a>
            <a
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cream"
            >
              {brand.instagramHandle}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-cream-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p>🏝️ {brand.location} · {brand.hours}</p>
        </div>
      </div>
    </footer>
  );
}
