import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import FaqItem from "@/components/FaqItem";

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



export default async function SnippetCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const cat = snippets[resolvedParams.category] ?? {
    label: resolvedParams.category,
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
