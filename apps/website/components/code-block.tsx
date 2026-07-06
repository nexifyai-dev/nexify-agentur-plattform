export function CodeBlock() {
  return (
    <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--bg-page)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-hover)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-hover)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-hover)]" />
        </div>
        <span className="font-mono text-[10px] text-[var(--text-4)]">nexify.config.ts</span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-[1.8]">
        <div><span className="text-[var(--text-3)]">{"// "}</span><span className="text-[var(--text-4)]">Projekt-Konfiguration</span></div>
        <div><span className="text-[var(--text-2)]">{"export "}</span><span className="text-[var(--text-3)]">{"const "}</span><span className="text-[var(--text-1)]">projekt</span><span className="text-[var(--text-4)]">{" = {"}</span></div>
        <div className="pl-4"><span className="text-[var(--text-3)]">typ</span><span className="text-[var(--text-4)]">{": "}</span><span className="text-[var(--text-2)]">{"\"Website\""}</span><span className="text-[var(--text-4)]">{","}</span></div>
        <div className="pl-4"><span className="text-[var(--text-3)]">arbeitstage</span><span className="text-[var(--text-4)]">{": "}</span><span className="text-[var(--text-1)]">{"3"}</span><span className="text-[var(--text-4)]">{","}</span></div>
        <div className="pl-4"><span className="text-[var(--text-3)]">preis</span><span className="text-[var(--text-4)]">{": "}</span><span className="text-[var(--text-1)]">{"2.997"}</span><span className="text-[var(--text-4)]">{" "}</span><span className="text-[var(--text-4)]">{"€ netto"}</span><span className="text-[var(--text-4)]">{","}</span></div>
        <div className="pl-4"><span className="text-[var(--text-3)]">status</span><span className="text-[var(--text-4)]">{": "}</span><span className="text-[var(--text-2)]">{"\"geplant\""}</span></div>
        <div><span className="text-[var(--text-4)]">{"}"}</span></div>
      </div>
    </div>
  );
}
