# Jakeer Chilakala — Personal Portfolio

> **"Building Reliable Systems"**

A personal portfolio and technical blog built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Features a dark/light theme, MDX-powered blog, code snippets, system design notes, and developer utilities.

---

## ✨ Features

| Section | Description |
|---|---|
| **Home** | Hero with stats counter, recent writing preview, featured projects, and collaboration CTA |
| **Writing** | MDX-powered blog with reading time, syntax highlighting via Shiki, and tag filtering |
| **Snippets** | Copy-paste ready code snippets for React, Java, Git, AWS, and more |
| **Projects** | Featured engineering work with tech tags and GitHub links |
| **System Design** | Evergreen notes on distributed systems, caching, databases, and architecture trade-offs |
| **Tools** | Curated developer utilities — JSON tools, formatters, converters |

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + custom CSS variables for theming
- **UI Components**: Lucide React icons
- **Content**: MDX via `next-mdx-remote` + `gray-matter` for frontmatter
- **Syntax Highlighting**: [Shiki](https://shiki.style/)
- **Theming**: `next-themes` (dark / light / system)
- **Utilities**: `clsx`, `tailwind-merge`, `date-fns`, `reading-time`

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm / yarn / pnpm / bun

### Install & Run

```bash
# Clone the repo
git clone https://github.com/jakeerchilakala/jakeer.com.git
cd jakeer.com

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Navbar, Footer, ThemeProvider)
│   ├── page.tsx            # Home page
│   ├── writing/            # Blog listing & individual post pages
│   ├── snippets/           # Code snippets section
│   ├── projects/           # Projects showcase
│   ├── notes/              # System design notes
│   └── tools/              # Developer tools
├── components/
│   ├── Navbar.tsx          # Responsive navigation with theme toggle
│   ├── Footer.tsx          # Site footer with social links
│   ├── ArticleCard.tsx     # Blog post card component
│   └── StatCounter.tsx     # Animated stat counter
└── lib/
    ├── config.ts           # Site-wide configuration (name, socials, nav, stats)
    └── utils.ts            # Shared utilities (cn helper, etc.)
```

---

## ⚙️ Configuration

All personal details are centralized in [`src/lib/config.ts`](src/lib/config.ts):

```ts
export const siteConfig = {
  name:        "Jakeer Chilakala",
  tagline:     "Building Reliable Systems",
  description: "Senior Software Engineer at Wells Fargo...",
  url:         "https://jakeerchilakala.dev",

  stats: [
    { value: "8+",  label: "Years Experience" },
    { value: "50+", label: "Projects Delivered" },
    { value: "20+", label: "Articles Published" },
    { value: "5+",  label: "Teams Worked With" },
  ],

  socials: {
    github:   "https://github.com/jakeerchilakala",
    linkedin: "https://linkedin.com/in/jakeerchilakala",
    twitter:  "https://x.com/jakeerchilakala",
  },
  // ...
};
```

Edit this file to update your name, bio, social links, stats, and navigation.

---

## 📝 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🚢 Deployment

The easiest deployment option is [Vercel](https://vercel.com/) — the platform built for Next.js:

1. Push your code to GitHub
2. Import the repo on [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — click **Deploy**

For other providers (Netlify, Railway, AWS, etc.), run `npm run build` and serve the `.next` output.

---

## 📄 License

MIT — feel free to use this as a template for your own portfolio.
