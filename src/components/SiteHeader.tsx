"use client";

import { useEffect, useState } from "react";
import { brand } from "@/data/brand";

const navLinks = [
  { href: "#fleet", label: "Fleet" },
  { href: "#experiences", label: "Experiences" },
  { href: "#book", label: "Book" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}
    >
      <div className="site-header-inner mx-auto max-w-7xl px-6 lg:px-10">
        <a href="#" className="site-header-brand group">
          <span className="site-header-logo-title">{brand.shortName}</span>
          <span className="site-header-logo-sub">Yachts Miami</span>
        </a>

        <nav aria-label="Primary" className="site-header-nav hidden md:flex">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-actions flex items-center gap-4 sm:gap-5">
          <a href={brand.phoneHref} className="site-header-phone hidden lg:inline">
            {brand.phone}
          </a>
          <a href="#book" className="btn-nav-cta hidden sm:inline-flex">
            Reserve
          </a>

          <button
            type="button"
            className="site-header-menu-btn md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path
                  d="M4 4L14 14M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 5H16M2 9H16M2 13H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-nav" className="site-header-mobile-panel md:hidden">
          <nav
            aria-label="Mobile primary"
            className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-5"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link py-3"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={brand.phoneHref}
              className="site-header-phone py-3"
              onClick={() => setMenuOpen(false)}
            >
              {brand.phone}
            </a>
            <a
              href="#book"
              className="btn-nav-cta mt-3 w-full sm:hidden"
              onClick={() => setMenuOpen(false)}
            >
              Reserve
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
