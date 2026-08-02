/**
 * FILE: apps/website/components/blog-markdown.tsx
 * WHAT: Minimal safe Markdown to React for blog bodies (no raw HTML).
 * WHY: Seed/agent content without MDX deps; Dark/Luxury typography.
 */

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  content: string;
};

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${keyPrefix}-b-${i}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i}`}
          className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-zinc-200"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("*")) {
      nodes.push(<em key={`${keyPrefix}-i-${i}`}>{token.slice(1, -1)}</em>);
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (link) {
        const href = link[2];
        const label = link[1];
        if (href.startsWith("/")) {
          nodes.push(
            <Link
              key={`${keyPrefix}-l-${i}`}
              href={href}
              className="font-medium text-zinc-100 underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60"
            >
              {label}
            </Link>,
          );
        } else {
          nodes.push(
            <a
              key={`${keyPrefix}-a-${i}`}
              href={href}
              rel="noopener noreferrer"
              className="font-medium text-zinc-100 underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60"
            >
              {label}
            </a>,
          );
        }
      }
    }
    last = m.index + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function BlogMarkdown({ content }: Props) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let bi = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={`h3-${bi++}`}
          className="mt-10 font-[family-name:var(--font-heading)] text-xl font-medium text-white"
        >
          {inline(line.slice(4), `h3-${bi}`)}
        </h3>,
      );
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={`h2-${bi++}`}
          className="mt-12 font-[family-name:var(--font-heading)] text-2xl font-medium tracking-tight text-white"
        >
          {inline(line.slice(3), `h2-${bi}`)}
        </h2>,
      );
      i += 1;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(
        <h2
          key={`h1-${bi++}`}
          className="mt-12 font-[family-name:var(--font-heading)] text-2xl font-medium tracking-tight text-white"
        >
          {inline(line.slice(2), `h1-${bi}`)}
        </h2>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push(
        <ul
          key={`ul-${bi++}`}
          className="mt-5 list-disc space-y-2 pl-5 text-[15.5px] leading-[1.85] text-zinc-300"
        >
          {items.map((item, idx) => (
            <li key={idx}>{inline(item, `li-${bi}-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("* ")
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={`p-${bi++}`} className="mt-5 text-[15.5px] leading-[1.85] text-zinc-300">
        {inline(para.join(" "), `p-${bi}`)}
      </p>,
    );
  }

  return <div data-testid="blog-markdown">{blocks}</div>;
}
