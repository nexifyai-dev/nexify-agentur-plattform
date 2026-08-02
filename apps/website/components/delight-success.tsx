// FILE: apps/website/components/delight-success.tsx
// SESSION: neukunden-begeisterung-7dd5
import Link from "next/link";
import { CalendarCheck2, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { company } from "@/lib/company";
import { delightFor, type DelightLang, type DelightVariant } from "@/lib/delight-copy";
import { InboundSpeedPromise } from "@/components/inbound-speed-promise";

export function DelightSuccess({
  lang = "de",
  variant = "contact",
  highlight,
  showHome = true,
  showCompare = false,
  compact = false,
  testId = "delight-success",
}: {
  lang?: DelightLang;
  variant?: DelightVariant;
  highlight?: string | null;
  showHome?: boolean;
  showCompare?: boolean;
  compact?: boolean;
  testId?: string;
}) {
  const t = delightFor(lang, variant);
  const pad = compact ? "p-6 sm:p-8" : "p-8 sm:p-10 md:p-12";
  return (
    <div className={`glass ${pad} text-center`} data-testid={testId}>
      <CheckCircle2 size={compact ? 36 : 44} className="mx-auto text-emerald-400" aria-hidden />
      <h2
        className={`mt-5 font-[family-name:var(--font-heading)] font-light tracking-tight text-white ${
          compact ? "text-2xl" : "text-3xl sm:text-4xl"
        }`}
        data-testid="delight-title"
      >
        {t.title}
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base" data-testid="delight-body">
        {t.body}
      </p>
      {highlight ? (
        <p className="mt-5 text-xl font-semibold text-white" data-testid="delight-highlight">
          {highlight}
        </p>
      ) : null}
      <div className="mx-auto mt-8 max-w-md text-left" data-testid="delight-timeline">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.nextTitle}</p>
        <ol className="mt-3 space-y-3">
          {t.steps.map((s) => (
            <li key={s.when} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-zinc-500">{s.when}</span>
              <span className="text-sm leading-relaxed text-zinc-300">{s.what}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-zinc-500" data-testid="delight-followup">
        {t.followUp}
      </p>
      <div className="mx-auto mt-6 max-w-md">
        <InboundSpeedPromise lang={lang} />
      </div>
      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {variant !== "booking" ? (
          <Link href="/rueckruf" className="btn-primary !py-2.5 !text-[13px]" data-testid="delight-cta-book">
            <CalendarCheck2 size={15} /> {t.ctaBook}
          </Link>
        ) : null}
        <a href={`mailto:${company.email}`} className="btn-ghost !py-2.5 !text-[13px]" data-testid="delight-cta-mail">
          <Mail size={15} /> {t.ctaMail}
        </a>
        <a
          href={company.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost !py-2.5 !text-[13px]"
          data-testid="delight-cta-whatsapp"
        >
          <MessageCircle size={15} /> {t.ctaWhatsApp}
        </a>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
        {showHome ? (
          <Link href="/" className="underline hover:text-white" data-testid="delight-cta-home">
            {t.ctaHome}
          </Link>
        ) : null}
        {showCompare ? (
          <Link href="/vergleich" className="underline hover:text-white" data-testid="delight-cta-compare">
            {t.ctaCompare}
          </Link>
        ) : null}
        <Link href="/konto" className="underline hover:text-white" data-testid="delight-cta-portal">
          {t.ctaPortal}
        </Link>
      </div>
    </div>
  );
}
