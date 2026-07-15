"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const snippets: Record<string, {
  label: string;
  items: { title: string; code: string; lang: string; description: string; faqs: { q: string; a: string }[] }[];
}> = {
  react: {
    label: "React",
    items: [
      {
        title:       "useLocalStorage Hook",
        lang:        "tsx",
        description: "A typed hook that syncs state to localStorage and handles SSR safely.",
        code: `import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [stored, setValue] as const;
}

export default useLocalStorage;`,
        faqs: [
          { q: "Is this SSR safe?",   a: "Yes — the initial state is read lazily and guards against window being undefined." },
          { q: "Can I store objects?", a: "Yes — values are JSON serialized. Avoid storing non-serializable values like functions." },
        ],
      },
      {
        title:       "useDebounce Hook",
        lang:        "tsx",
        description: "Debounce any value — ideal for search inputs to avoid firing on every keystroke.",
        code: `import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;`,
        faqs: [
          { q: "When should I use this?", a: "Whenever you react to fast-changing inputs: search fields, resize events, or window scroll." },
        ],
      },
    ],
  },
  java: {
    label: "Java",
    items: [
      {
        title:       "Retry with Exponential Backoff",
        lang:        "java",
        description: "A generic retry utility using Resilience4j — configure max attempts and wait duration.",
        code: `@Bean
public Retry retryConfig() {
    RetryConfig config = RetryConfig.custom()
        .maxAttempts(3)
        .waitDuration(Duration.ofMillis(500))
        .retryExceptions(HttpServerErrorException.class)
        .ignoreExceptions(IllegalArgumentException.class)
        .build();
    return Retry.of("paymentService", config);
}

// Usage
String result = Retry.decorateSupplier(retry,
    () -> paymentClient.process(request)).get();`,
        faqs: [
          { q: "Which dependency do I need?", a: "Add io.github.resilience4j:resilience4j-spring-boot3 to your pom.xml." },
        ],
      },
    ],
  },
};

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre
        style={{
          background:   "var(--surface-raised)",
          border:       "1px solid var(--border)",
          borderRadius: "0.75rem",
          padding:      "1.25rem 1.5rem",
          overflowX:    "auto",
          fontSize:     "0.875rem",
          lineHeight:   1.7,
          color:        "var(--text-primary)",
          fontFamily:   "JetBrains Mono, monospace",
        }}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 p-1.5 rounded-md border transition-all opacity-0 group-hover:opacity-100"
        style={{
          background:   "var(--surface)",
          borderColor:  "var(--border-strong)",
          color:        copied ? "#22c55e" : "var(--text-muted)",
        }}
        aria-label="Copy code"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: "var(--border)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {q}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div
          className="px-5 py-3 text-sm border-t"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function SnippetCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = snippets[params.category] ?? {
    label: params.category,
    items: [],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Back */}
      <Link
        href="/snippets"
        className="inline-flex items-center gap-2 text-sm mb-10 hover:underline underline-offset-4"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={14} />
        All Snippets
      </Link>

      {/* Header */}
      <div className="mb-12">
        <p className="section-label mb-3">SNIPPETS · {cat.label.toUpperCase()}</p>
        <h1
          className="font-display font-bold"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)" }}
        >
          {cat.label} Snippets
        </h1>
      </div>

      {/* Snippets */}
      {cat.items.length > 0 ? (
        <div className="flex flex-col gap-12">
          {cat.items.map((item) => (
            <section key={item.title} className="flex flex-col gap-4">
              <div>
                <h2
                  className="font-display text-xl font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {item.description}
                </p>
              </div>
              <CodeBlock code={item.code} lang={item.lang} />
              {item.faqs.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                    FAQ
                  </p>
                  {item.faqs.map((faq) => (
                    <FaqItem key={faq.q} {...faq} />
                  ))}
                </div>
              )}
              <div className="divider" />
            </section>
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--text-muted)" }}>No snippets yet — coming soon.</p>
      )}
    </div>
  );
}
