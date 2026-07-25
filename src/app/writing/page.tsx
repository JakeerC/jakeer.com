import type { Metadata } from "next";
import WritingClient from "./WritingClient";

export const metadata: Metadata = {
  title:       "Writing",
  description: "Technical deep-dives, tutorials, and perspectives on software engineering, tooling, and building products.",
};

export default function WritingPage() {
  return <WritingClient />;
}
