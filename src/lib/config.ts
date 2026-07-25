// Site-wide configuration — edit these values to personalize your portfolio
export const siteConfig = {
  name:        "Jakeer Chilakala",
  initials:    "jakeer.",
  tagline:     "Building Reliable Systems",
  description:
    "Senior Software Engineer at Wells Fargo. JavaScript and React on the frontend, Java and Spring Boot on the backend. Passionate about building robust, scalable systems that real users depend on.",
  url:         "https://jakeerchilakala.dev",

  stats: [
    { value: "8+",   label: "Years Experience" },
    { value: "50+",  label: "Projects Delivered" },
    { value: "20+",  label: "Articles Published" },
    { value: "5+",   label: "Teams Worked With" },
  ],

  socials: {
    github:   "#",   // replace with real URL
    linkedin: "#",
    twitter:  "#",
    medium:   "#",
    devto:    "#",
  },

  // Navigation links
  nav: [
    { href: "/",            label: "Home"          },
    { href: "/writing",     label: "Writing"       },
    { href: "/snippets",    label: "Snippets"      },
    { href: "/projects",    label: "Projects"      },
    { href: "/tools",       label: "Tools"         },
  ],

  // Open Graph
  ogImage: "/og-image.png",
  locale:  "en_US",
};

export type SiteConfig = typeof siteConfig;
