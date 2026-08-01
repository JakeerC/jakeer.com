import { codeToHtml } from "shiki";
import CodeBlockClient from "./CodeBlockClient";

export default async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  let html = "";
  try {
    html = await codeToHtml(code, {
      lang,
      theme: "github-dark",
    });
  } catch {
    // Fallback if language is not supported by Shiki (e.g. "env")
    html = await codeToHtml(code, {
      lang: "text",
      theme: "github-dark",
    });
  }

  return <CodeBlockClient code={code} lang={lang} html={html} />;
}
