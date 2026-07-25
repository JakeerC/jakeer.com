"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback, useRef } from "react";
import { Moon, Sun, Search, X, Menu } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import CommandPalette from "./CommandPalette";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function Navbar() {
  const pathname      = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted,     setMounted]     = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStyle, setActiveStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    // Small delay to ensure the layout has rendered completely before getting the layout details
    const timeoutId = setTimeout(() => {
      if (navRef.current) {
        const activeLink = navRef.current.querySelector('.active-nav-link') as HTMLElement;
        if (activeLink) {
          // Adjust position inside the Link padding (left: offsetLeft + 12px padding-left, width: offsetWidth - 24px total padding)
          setActiveStyle({
            left: activeLink.offsetLeft + 12,
            width: activeLink.offsetWidth - 24,
            opacity: 1
          });
        } else {
          setActiveStyle(prev => ({ ...prev, opacity: 0 }));
        }
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [pathname, mounted]);

  // ⌘K to open search
  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(true);
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  const isDark = resolvedTheme === "dark";

  return (
    <>
      {/* ── Main Nav ─────────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "backdrop-blur-md border-b"
            : "border-b border-transparent",
        )}
        style={{
          backgroundColor: scrolled ? "color-mix(in srgb, var(--bg-primary) 88%, transparent)" : "transparent",
          borderColor:     scrolled ? "var(--border)" : "transparent",
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight shrink-0"
            style={{ color: "var(--text-primary)" }}
          >
            {siteConfig.initials}
          </Link>

          {/* Desktop Nav Links */}
          <ul ref={navRef} className="hidden md:flex items-center gap-2 relative">
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-3 py-1.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "font-medium active-nav-link"
                        : "opacity-60 hover:opacity-100",
                    )}
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            
            {/* Animated Floating Underline */}
            <li
              className="absolute -bottom-1 h-[2px] rounded-full bg-current transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${activeStyle.left}px`,
                width: `${activeStyle.width}px`,
                opacity: activeStyle.opacity,
                color: "var(--text-primary)",
              }}
            />
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              id="search-button"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-all hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <Search size={14} />
              <span>Search</span>
              <kbd className="text-xs px-1 py-0.5 rounded border ml-1 opacity-60"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                ⌘K
              </kbd>
            </button>

            {/* Dark mode toggle */}
            {mounted && (
              <button
                id="dark-mode-toggle"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 rounded-md transition-all hover:opacity-70"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
          >
            <ul className="flex flex-col px-6 py-3 gap-1">
              {siteConfig.nav.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "relative block px-3 py-2 text-sm font-medium transition-all w-fit",
                        active ? "font-medium" : "opacity-60",
                      )}
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                      {active && (
                        <span 
                          className="absolute left-3 right-3 -bottom-0 h-[2px] rounded-full bg-current"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </header>

      <CommandPalette open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
}
