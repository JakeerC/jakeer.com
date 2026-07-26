export interface Snippet {
  slug: string;
  title: string;
  lang: string;
  description: string;
  code: string;
  tags: string[];
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  date: string;
  faqs: { q: string; a: string }[];
}

export const snippets: Record<string, {
  label: string;
  items: Snippet[];
}> = {
  react: {
    label: "React",
    items: [
      {
        slug: "use-local-storage",
        title: "useLocalStorage Hook",
        lang: "tsx",
        description: "A typed hook that syncs state to localStorage and handles SSR safely.",
        tags: ["react", "hook", "state"],
        level: "INTERMEDIATE",
        date: "Aug 21, 2024",
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
        slug: "use-debounce",
        title: "useDebounce Hook",
        lang: "tsx",
        description: "Debounce any value — ideal for search inputs to avoid firing on every keystroke.",
        tags: ["react", "hook", "performance"],
        level: "BEGINNER",
        date: "Sep 12, 2024",
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
        slug: "retry-exponential-backoff",
        title: "Retry with Exponential Backoff",
        lang: "java",
        description: "A generic retry utility using Resilience4j — configure max attempts and wait duration.",
        tags: ["java", "resilience4j", "retry"],
        level: "INTERMEDIATE",
        date: "Oct 16, 2025",
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
