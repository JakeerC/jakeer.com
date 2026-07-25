import { codeToHtml } from "shiki";
import CodeBlockClient from "./CodeBlockClient";

export default async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  return <CodeBlockClient code={code} lang={lang} html={html} />;
}
