"use client";

import React from "react";

function inline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={`${keyBase}-${i}`} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return <code key={`${keyBase}-${i}`} className="rounded bg-white/10 px-1 py-px text-[12px]">{p.slice(1, -1)}</code>;
    return p;
  });
}

export function ChatMarkdown({ content }: { content: string }) {
  let src = content.replace(/\r/g, "");
  if (((src.match(/\*\*/g) || []).length) % 2 === 1) {
    const idx = src.lastIndexOf("**");
    src = src.slice(0, idx) + src.slice(idx + 2);
  }
  const blocks = src.split(/\n{2,}/).filter((b) => b.trim());
  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const isBullet = lines.every((l) => /^\s*[-•*]\s+/.test(l));
        const isNumbered = lines.every((l) => /^\s*\d+[.)]\s+/.test(l));
        if (isBullet || isNumbered) {
          return (
            <ul key={bi} className="space-y-1.5">
              {lines.map((l, li) => {
                const item = l.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, "");
                const num = isNumbered ? l.match(/^\s*(\d+)/)?.[1] : null;
                return (
                  <li key={li} className="flex gap-2">
                    {num ? (
                      <span className="shrink-0 font-semibold text-zinc-400">{num}.</span>
                    ) : (
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-zinc-400" />
                    )}
                    <span>{inline(item, `${bi}-${li}`)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `${bi}-${li}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
