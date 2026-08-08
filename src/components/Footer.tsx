import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t mt-24"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {siteConfig.initials}
          </Link>
          <p className="text-xs mt-1 opacity-50">{siteConfig.tagline}</p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Socials + copyright */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <FaGithub />
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <FaLinkedin />
            </a>
          </div>
          <p className="text-xs opacity-40">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
