/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Shared MDX component registry used by all public detail routes and the
 * authenticated draft preview. Import `mdxComponents` and pass it to
 * <MDXRemote components={mdxComponents} />.
 */
import Image from "next/image";
import CodeBlock from "@/components/CodeBlock";
import { slugify } from "@/lib/slugify";
import { Callout, SparkyText, MoreInfo, SwirlyUnderline, HighlightText } from "@/components/mdx";

const getText = (children: any): string => {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getText).join("");
  if (typeof children === "object" && children !== null && children.props?.children) {
    return getText(children.props.children);
  }
  return "";
};

export const mdxComponents = {
  h2: (props: any) => {
    const text = getText(props.children);
    const id = props.id || slugify(text);
    return (
      <h2
        id={id}
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          margin: "2.5rem 0 1rem",
          color: "var(--text-primary)",
        }}
        {...props}
      />
    );
  },
  h3: (props: any) => {
    const text = getText(props.children);
    const id = props.id || slugify(text);
    return (
      <h3
        id={id}
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: "1.2rem",
          fontWeight: 600,
          margin: "2rem 0 0.75rem",
          color: "var(--text-primary)",
        }}
        {...props}
      />
    );
  },
  strong: (props: any) => (
    <strong style={{ color: "var(--text-primary)", fontWeight: 600 }} {...props} />
  ),
  code: (props: any) => (
    <code
      style={{
        background: "var(--tag-bg)",
        border: "1px solid var(--tag-border)",
        borderRadius: "4px",
        padding: "0.15em 0.4em",
        color: "var(--accent)",
        fontSize: "0.85em",
      }}
      {...props}
    />
  ),
  li: (props: any) => (
    <li style={{ margin: "0.4rem 0", color: "var(--text-secondary)" }} {...props} />
  ),
  ul: (props: any) => (
    <ul style={{ paddingLeft: "1.25rem", margin: "1rem 0", listStyle: "disc" }} {...props} />
  ),
  p: (props: any) => (
    <p style={{ margin: "1rem 0", color: "var(--text-secondary)" }} {...props} />
  ),
  pre: (props: any) => {
    const child = props.children;
    if (child && child.props) {
      const className = child.props.className || "";
      const langMatch = className.match(/language-(.*)/);
      const lang = langMatch ? langMatch[1] : "text";
      const codeString =
        typeof child.props.children === "string"
          ? child.props.children
          : Array.isArray(child.props.children)
            ? child.props.children.join("")
            : child.props.children || "";
      return <CodeBlock code={String(codeString).trim()} lang={lang} />;
    }
    return <pre {...props} />;
  },
  img: (props: any) => (
    <Image
      src={props.src}
      alt={props.alt || ""}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      className="rounded-lg border border-[var(--border)] my-6"
    />
  ),
  Callout,
  SparkyText,
  MoreInfo,
  SwirlyUnderline,
  HighlightText,
};
