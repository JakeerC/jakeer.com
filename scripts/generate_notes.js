const fs = require('node:fs');
const path = require('node:path');

const topics = {
  java: [
    { slug: 'garbage-collection', title: 'Garbage Collection Algorithms', subtopic: 'JVM Internals', order: 1 },
    { slug: 'memory-model', title: 'Java Memory Model', subtopic: 'JVM Internals', order: 2 }
  ],
  javascript: [
    { slug: 'event-loop', title: 'The Event Loop Explained', subtopic: 'Core Concepts', order: 1 },
    { slug: 'closures', title: 'Mastering Closures', subtopic: 'Core Concepts', order: 2 }
  ],
  typescript: [
    { slug: 'generics-deep-dive', title: 'Generics Deep Dive', subtopic: 'Advanced Types', order: 1 },
    { slug: 'utility-types', title: 'Essential Utility Types', subtopic: 'Advanced Types', order: 2 }
  ],
  react: [
    { slug: 'render-optimization', title: 'Render Optimization', subtopic: 'Optimization', order: 1 },
    { slug: 'hooks-best-practices', title: 'Hooks Best Practices', subtopic: 'Optimization', order: 2 }
  ],
  'ai-ml': [
    { slug: 'prompt-engineering', title: 'Prompt Engineering Techniques', subtopic: 'LLM Fundamentals', order: 1 },
    { slug: 'rag-architecture', title: 'RAG Architecture Overview', subtopic: 'LLM Fundamentals', order: 2 }
  ],
  mcp: [
    { slug: 'mcp-introduction', title: 'Introduction to MCP', subtopic: 'Getting Started', order: 1 },
    { slug: 'building-mcp-server', title: 'Building an MCP Server', subtopic: 'Getting Started', order: 2 }
  ],
  'ci-cd': [
    { slug: 'github-actions-guide', title: 'GitHub Actions Guide', subtopic: 'Pipelines', order: 1 },
    { slug: 'deployment-strategies', title: 'Deployment Strategies', subtopic: 'Pipelines', order: 2 }
  ],
  'system-design': [
    { slug: 'cap-theorem', title: 'CAP Theorem', subtopic: 'Fundamentals', order: 1 },
    { slug: 'latency-numbers', title: 'Latency Numbers Every Dev Knows', subtopic: 'Fundamentals', order: 2 },
    { slug: 'caching-fundamentals', title: 'Caching Fundamentals', subtopic: 'Caching & Load Distribution', order: 1 },
    { slug: 'consistent-hashing', title: 'Consistent Hashing', subtopic: 'Caching & Load Distribution', order: 2 }
  ],
  'docker-k8s': [
    { slug: 'docker-best-practices', title: 'Docker Best Practices', subtopic: 'Containers', order: 1 },
    { slug: 'k8s-architecture', title: 'Kubernetes Architecture', subtopic: 'Containers', order: 2 }
  ],
  aws: [
    { slug: 'ec2-vs-lambda', title: 'EC2 vs Lambda', subtopic: 'Compute', order: 1 },
    { slug: 'vpc-fundamentals', title: 'VPC Fundamentals', subtopic: 'Compute', order: 2 }
  ]
};

const baseDir = path.join(process.cwd(), 'content', 'notes');

for (const [topic, notes] of Object.entries(topics)) {
  const topicDir = path.join(baseDir, topic);
  if (!fs.existsSync(topicDir)) {
    fs.mkdirSync(topicDir, { recursive: true });
  }

  for (const note of notes) {
    const filePath = path.join(topicDir, `${note.slug}.mdx`);
    const content = `---
title: "${note.title}"
description: "A comprehensive guide to ${note.title}."
readTime: "5 min read"
topic: "${topic}"
subtopic: "${note.subtopic}"
order: ${note.order}
tags: ["${topic}", "engineering"]
---

## Introduction

This is a sample note for **${note.title}**.

Here is a quick overview:
- Key concepts and principles
- Trade-offs and considerations
- Real-world examples

## Deep Dive

Let's explore how this works under the hood.

\`\`\`javascript
// Example code snippet
function demo() {
  console.log("Hello from ${note.title}!");
}
\`\`\`

### Best Practices

1. Always measure before optimizing
2. Keep it simple
3. Document your decisions
`;
    fs.writeFileSync(filePath, content);
  }
}
console.log("Notes generated successfully!");
