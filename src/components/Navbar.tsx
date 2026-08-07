"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  LuMoon,
  LuSun,
  LuSearch,
  LuX,
  LuMenu,
  LuPalette,
  LuLogOut,
} from "react-icons/lu";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import CommandPalette from "./CommandPalette";
import { Button } from "./Button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStyle, setActiveStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const navRef = useRef<HTMLUListElement>(null);

  const [session, setSession] = useState<unknown>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
        const activeLink = navRef.current.querySelector(
          ".active-nav-link",
        ) as HTMLElement;
        if (activeLink) {
          // Adjust position inside the Link padding (left: offsetLeft + 12px padding-left, width: offsetWidth - 24px total padding)
          setActiveStyle({
            left: activeLink.offsetLeft + 12,
            width: activeLink.offsetWidth - 24,
            opacity: 1,
          });
        } else {
          setActiveStyle((prev) => ({ ...prev, opacity: 0 }));
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

  const isNeo = resolvedTheme?.startsWith("neo-") || false;
  const isDark = resolvedTheme?.endsWith("dark") || false;

  const toggleDark = () => {
    if (isNeo) return;
    setTheme(isDark ? "light" : "dark");
  };

  const toggleNeo = () => {
    if (isNeo) setTheme(isDark ? "dark" : "light");
    else setTheme("neo-light");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const isAdminRoute = pathname.startsWith("/admin");
  const showAdminNav = isAdminRoute && !!session;

  const adminNav = [
    { label: "Admin Dashboard", href: "/admin" },
    { label: "New", href: "/admin/new" },
    { label: "Assets", href: "/admin/assets" },
  ];

  const currentNav = showAdminNav ? adminNav : siteConfig.nav;

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
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--bg-primary) 88%, transparent)"
            : "transparent",
          borderColor: scrolled ? "var(--border)" : "transparent",
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
          <ul
            ref={navRef}
            className="hidden md:flex items-center gap-2 relative"
          >
            {currentNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" &&
                  item.href !== "/admin" &&
                  pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "nav-link relative px-3 py-1.5 text-sm font-medium transition-all duration-200",
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
              className="nav-indicator absolute bg-current transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${activeStyle.left}px`,
                width: `${activeStyle.width}px`,
                opacity: activeStyle.opacity,
              }}
            />
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            {!showAdminNav && (
              <Button
                id="search-button"
                variant="outline"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex"
                leftIcon={<LuSearch size={14} />}
              >
                <span>Search</span>
                <kbd
                  className="text-xs px-1 py-0.5 rounded border ml-1 opacity-60"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  ⌘K
                </kbd>
              </Button>
            )}

            {/* Theme Style toggle (Neo/Classic) */}
            {mounted && (
              <Button
                id="neo-mode-toggle"
                variant="ghost"
                size="sm"
                onClick={toggleNeo}
                className="hidden md:flex p-2"
                aria-label="Toggle neo style"
              >
                <LuPalette size={16} />
              </Button>
            )}

            {/* Dark mode toggle */}
            {mounted && !isNeo && (
              <Button
                id="dark-mode-toggle"
                variant="ghost"
                size="sm"
                onClick={toggleDark}
                className="p-2"
                aria-label="Toggle dark mode"
              >
                {isDark ? <LuSun size={16} /> : <LuMoon size={16} />}
              </Button>
            )}

            {/* Logout button (Admin) */}
            {showAdminNav && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                aria-label="Logout"
              >
                <LuLogOut size={16} />
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <LuX size={18} /> : <LuMenu size={18} />}
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{
              background: "var(--bg-primary)",
              borderColor: "var(--border)",
            }}
          >
            <ul className="flex flex-col px-6 py-3 gap-1">
              {currentNav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" &&
                    item.href !== "/admin" &&
                    pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "nav-link relative block px-3 py-2 text-sm font-medium transition-all w-fit",
                        active ? "font-medium" : "opacity-60",
                      )}
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute left-3 right-3 -bottom-0 h-[2px] rounded-full bg-current" />
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
