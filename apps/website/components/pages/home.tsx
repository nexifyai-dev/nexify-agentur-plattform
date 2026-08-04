'use client';

import { useMemo, useState } from 'react';
import { Hero3D } from '@/components/hero-3d';
import { useLang } from '@/lib/lang-context';
import { HOME_CONTENT, PRICING } from '@/lib/home-content';

/**
 * Homepage exakt nach Anhang "NeXify Homepage.dc.html" (PR47 Luxury Dark).
 * Inhalte i18n DE/EN/NL aus lib/home-content.ts (DE = Anhang 1:1).
 * ChatWidget wird GLOBAL im Root-Layout gerendert — hier NICHT nochmal.
 */

/* ============================================================
 * Style-Konstanten (Anhang-Tokens)
 * ============================================================ */

const container: React.CSSProperties = { width: 'min(1280px, calc(100% - 48px))', marginInline: 'auto' };
const eyebrow: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 11,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: '#9E9E9E',
  fontWeight: 600,
};
const eyebrowLine: React.CSSProperties = { width: 26, height: 1, background: 'linear-gradient(90deg,transparent,#C8FF00)' };
const h2: React.CSSProperties = {
  margin: '16px 0 0',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 300,
  fontSize: 'clamp(1.7rem,3vw,2.4rem)',
  color: '#fff',
  letterSpacing: '-0.02em',
};
const sectionWrap: React.CSSProperties = { padding: '24px 0 96px', position: 'relative', zIndex: 1 };
const primaryBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 999,
  padding: '15px 30px',
  background: 'linear-gradient(120deg,#C8FF00,#eaffb0 50%,#C8FF00)',
  color: '#0A0A0A',
  fontWeight: 700,
  fontSize: 14,
  boxShadow: '0 0 28px rgba(200,255,0,0.28), inset 0 1px 0 rgba(255,255,255,0.6)',
};
const secondaryBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 999,
  padding: '14px 28px',
  border: '1px solid rgba(255,255,255,0.18)',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
};

/* ============================================================
 * Sektionen
 * ============================================================ */

function Hero({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  return (
    <section id="top" style={{ position: 'relative', padding: '168px 0 72px', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 30%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 30%, black 30%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          ...container,
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: 40,
          alignItems: 'center',
        }}
        className="nx-hero-grid"
      >
        <div>
          <span
            data-testid="hero-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              border: '1px solid rgba(200,255,0,0.25)',
              background: 'rgba(200,255,0,0.05)',
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d9ffa0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: 999,
                background: '#C8FF00',
                boxShadow: '0 0 10px rgba(200,255,0,0.8)',
              }}
            />
            {t.heroBadge}
          </span>
          <h1
            style={{
              margin: '30px 0 0',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.06,
              fontSize: 'clamp(2.4rem,5vw,4.6rem)',
              color: '#fff',
              maxWidth: 640,
            }}
          >
            {t.heroTitleA}
            <br />
            <span
              style={{
                fontWeight: 600,
                background:
                  'linear-gradient(120deg,#C8FF00 0%, #f4ffcf 30%, #8fce00 55%, #C8FF00 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: 'nx-shimmer 8s linear infinite',
              }}
            >
              {t.heroTitleB}
            </span>
          </h1>
          <p style={{ marginTop: 26, maxWidth: 520, fontSize: 17, lineHeight: 1.7, color: '#a1a1aa', fontWeight: 300 }}>
            {t.heroSubtitle}
          </p>
          <div style={{ marginTop: 34, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <a href="#kontakt" data-testid="hero-cta" style={primaryBtn}>
              {t.heroCtaPrimary}
            </a>
            <a href="#leistungen" data-testid="hero-cta-secondary" style={secondaryBtn}>
              {t.heroCtaSecondary}
            </a>
          </div>
        </div>

        <div
          data-testid="hero-visual"
          style={{ position: 'relative', aspectRatio: '1/1', maxWidth: 520, marginInline: 'auto', width: '100%' }}
        >
          <Hero3D />
          <div
            style={{
              position: 'absolute',
              left: '-4%',
              top: '14%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '11px 15px',
              animation: 'nx-float 6s ease-in-out infinite',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#C8FF00',
                boxShadow: '0 0 8px rgba(200,255,0,0.8)',
              }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{t.floatCard1Title}</div>
              <div style={{ fontSize: 10, color: '#71717a' }}>{t.floatCard1Sub}</div>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: '-2%',
              top: '40%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '11px 15px',
              animation: 'nx-float 6s ease-in-out infinite 1.5s',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{t.floatCard2Title}</div>
              <div style={{ fontSize: 10, color: '#71717a' }}>{t.floatCard2Sub}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...container, marginTop: 64 }}>
        <div
          data-testid="hero-stats"
          className="nx-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 1,
            overflow: 'hidden',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          {t.stats.map((s) => (
            <div key={s.label} style={{ background: '#0c0c0f', padding: '22px 24px' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 600, color: '#e9ff8a' }}>
                {s.value}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.4, color: '#71717a' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  const doubled = useMemo(() => [...t.marquee, ...t.marquee], [t.marquee]);
  return (
    <section
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.3)',
        padding: '20px 0',
        maskImage: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)',
        WebkitMaskImage: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 56, width: 'max-content', animation: 'nx-marquee 34s linear infinite' }}>
          {doubled.map((m, i) => (
            <span
              key={`${m}-${i}`}
              style={{
                whiteSpace: 'nowrap',
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#52525b',
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  return (
    <section style={{ padding: '96px 0', position: 'relative', zIndex: 1 }}>
      <div style={container}>
        <span style={eyebrow}>
          <span style={eyebrowLine} />
          {t.pillarsEyebrow}
        </span>
        <h2 style={{ ...h2, maxWidth: 640 }}>{t.pillarsTitle}</h2>
        <div className="nx-3col" style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          {t.pillars.map((p) => (
            <div
              key={p.title}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: 32,
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: '1px solid rgba(200,255,0,0.3)',
                  background: 'rgba(200,255,0,0.06)',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    inset: 15,
                    borderRadius: 3,
                    background: '#C8FF00',
                    boxShadow: '0 0 12px rgba(200,255,0,0.6)',
                  }}
                />
              </span>
              <h3 style={{ margin: '22px 0 0', fontFamily: 'Outfit, sans-serif', fontSize: 19, fontWeight: 500, color: '#fff' }}>
                {p.title}
              </h3>
              <p style={{ marginTop: 11, fontSize: 14, lineHeight: 1.7, color: '#8f8f98', fontWeight: 300 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  return (
    <section id="leistungen" style={sectionWrap}>
      <div style={container}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <span style={eyebrow}>
              <span style={eyebrowLine} />
              {t.servicesEyebrow}
            </span>
            <h2 style={{ ...h2, maxWidth: 600 }}>{t.servicesTitle}</h2>
          </div>
          <a
            href="#kontakt"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 999,
              padding: '11px 22px',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {t.servicesCta}
          </a>
        </div>
        <div className="nx-services-grid" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {t.services.map((svc) => (
            <a
              key={svc.title}
              href="#kontakt"
              style={{
                gridColumn: `span ${svc.span}`,
                display: 'block',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: 26,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    border: '1px solid rgba(255,255,255,0.15)',
                    position: 'relative',
                    flex: 'none',
                  }}
                >
                  <span style={{ position: 'absolute', inset: 9, borderRadius: 2, background: '#71717a' }} />
                </span>
                <span
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 999,
                    padding: '4px 11px',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: '#71717a',
                  }}
                >
                  {svc.days}
                </span>
              </div>
              <h3 style={{ margin: '20px 0 0', fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 500, lineHeight: 1.35, color: '#fff' }}>
                {svc.title}
              </h3>
              <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.65, color: '#71717a', fontWeight: 300 }}>{svc.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  return (
    <section id="prozess" style={sectionWrap}>
      <div style={container}>
        <span style={eyebrow}>
          <span style={eyebrowLine} />
          {t.processEyebrow}
        </span>
        <h2 style={h2}>{t.processTitle}</h2>
        <div
          className="nx-process-grid"
          style={{
            marginTop: 48,
            display: 'grid',
            gridTemplateColumns: 'repeat(5,1fr)',
            gap: 1,
            overflow: 'hidden',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          {t.processSteps.map((ps) => (
            <div key={ps.n} style={{ background: '#0c0c0f', padding: '26px 22px', minHeight: 190, position: 'relative' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 600, color: '#585858' }}>{ps.n}</div>
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  top: 64,
                  width: 22,
                  height: 2,
                  background: '#C8FF00',
                  boxShadow: '0 0 8px rgba(200,255,0,0.6)',
                }}
              />
              <h3 style={{ margin: '24px 0 0', fontSize: 14.5, fontWeight: 600, color: '#fff' }}>{ps.title}</h3>
              <p style={{ marginTop: 9, fontSize: 12.5, lineHeight: 1.6, color: '#71717a', fontWeight: 300 }}>{ps.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  const [days, setDays] = useState<number>(PRICING.sliderDefault);
  const [maintenance, setMaintenance] = useState(true);
  const implementationTotal = (days * PRICING.dayRate).toLocaleString('de-DE');
  const maintenanceCost = maintenance ? PRICING.maintenanceRate.toLocaleString('de-DE') : '0';
  const daysFillPct = `${(((days - PRICING.sliderMin) / (PRICING.sliderMax - PRICING.sliderMin)) * 100).toFixed(1)}%`;

  return (
    <section id="preise" style={sectionWrap}>
      <div style={container}>
        <span style={eyebrow}>
          <span style={eyebrowLine} />
          {t.pricingEyebrow}
        </span>
        <h2 style={h2}>{t.pricingTitle}</h2>
        <div className="nx-pricing-grid" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18, alignItems: 'stretch' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#71717a', fontWeight: 600 }}>
                {t.pricingDaysLabel}
              </span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 34, fontWeight: 600, color: '#fff' }}>{days}</span>
            </div>
            <input
              type="range"
              min={PRICING.sliderMin}
              max={PRICING.sliderMax}
              step={1}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              data-testid="pricing-slider"
              style={{
                width: '100%',
                marginTop: 20,
                appearance: 'none',
                height: 5,
                borderRadius: 999,
                background: `linear-gradient(90deg,#C8FF00 ${daysFillPct}, #27272a ${daysFillPct})`,
                outline: 'none',
              }}
            />
            <label
              style={{
                marginTop: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 24,
                cursor: 'pointer',
              }}
            >
              <span>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{t.pricingMaintenanceTitle}</div>
                <div style={{ marginTop: 4, fontSize: 12, color: '#71717a' }}>{t.pricingMaintenanceSub}</div>
              </span>
              <input
                type="checkbox"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
                data-testid="maintenance-toggle"
                style={{ width: 20, height: 20, accentColor: '#C8FF00' }}
              />
            </label>
            <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: '8px 20px', color: '#585858', fontSize: 11, letterSpacing: '0.02em' }}>
              {t.pricingNotes.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(160deg, rgba(200,255,0,0.07), rgba(255,255,255,0.03))',
              border: '1px solid rgba(200,255,0,0.18)',
              borderRadius: 24,
              padding: 40,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#a1a1aa' }}>
                <span>{t.pricingLine1(days)}</span>
                <strong style={{ color: '#fff', fontWeight: 500 }}>€ {implementationTotal}</strong>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#a1a1aa' }}>
                <span>{t.pricingLine2}</span>
                <strong style={{ color: '#fff', fontWeight: 500 }}>€ {maintenanceCost}</strong>
              </div>
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#71717a' }}>
                  {t.pricingTotalLabel}
                </span>
                <strong data-testid="pricing-total" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 600, color: '#e9ff8a' }}>
                  € {implementationTotal}
                </strong>
              </div>
            </div>
            <a
              href="#kontakt"
              data-testid="pricing-cta"
              style={{
                marginTop: 26,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                borderRadius: 999,
                padding: '15px 28px',
                background: 'linear-gradient(120deg,#C8FF00,#eaffb0 50%,#C8FF00)',
                color: '#0A0A0A',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {t.pricingCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function References({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  return (
    <section id="referenzen" style={sectionWrap}>
      <div style={container}>
        <span style={eyebrow}>
          <span style={eyebrowLine} />
          {t.referencesEyebrow}
        </span>
        <h2 style={h2}>{t.referencesTitle}</h2>
        <div className="nx-3col" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {t.testimonials.map((q) => (
            <figure
              key={q.author}
              style={{ margin: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 30 }}
            >
              <span style={{ display: 'block', fontFamily: 'Outfit, sans-serif', fontSize: 34, color: '#3f3f46', lineHeight: 1 }}>“</span>
              <blockquote style={{ margin: '16px 0 0', fontSize: 14.5, lineHeight: 1.7, color: '#d4d4d8' }}>{q.quote}</blockquote>
              <figcaption style={{ marginTop: 20, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#71717a' }}>
                {q.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function About({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  return (
    <section id="ueberuns" style={sectionWrap}>
      <div
        className="nx-about-grid"
        style={{
          ...container,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 36,
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 44,
        }}
      >
        <span
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            border: '1px solid rgba(200,255,0,0.25)',
            background: 'rgba(200,255,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Outfit, sans-serif',
            fontSize: 26,
            fontWeight: 600,
            color: '#C8FF00',
            flex: 'none',
          }}
        >
          NX
        </span>
        <div>
          <span style={eyebrow}>{t.aboutEyebrow}</span>
          <h2 style={{ margin: '14px 0 0', fontFamily: 'Outfit, sans-serif', fontWeight: 300, fontSize: 'clamp(1.5rem,2.6vw,2.1rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            {t.aboutTitle}
          </h2>
          <p style={{ marginTop: 14, maxWidth: 680, fontSize: 14.5, lineHeight: 1.75, color: '#a1a1aa', fontWeight: 300 }}>{t.aboutText}</p>
        </div>
      </div>
    </section>
  );
}

function Faq({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  return (
    <section id="faq" style={sectionWrap}>
      <div style={{ ...container, width: 'min(880px, calc(100% - 48px))' }}>
        <span style={eyebrow}>
          <span style={eyebrowLine} />
          {t.faqEyebrow}
        </span>
        <h2 style={h2}>{t.faqTitle}</h2>
        <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {t.faqs.map((f) => (
            <details key={f.q} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <summary
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 20,
                  padding: '22px 0',
                  cursor: 'pointer',
                  listStyle: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 16,
                  fontWeight: 500,
                  color: '#fff',
                }}
              >
                {f.q}
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, color: '#585858', flex: 'none' }}>+</span>
              </summary>
              <p style={{ maxWidth: 720, padding: '0 0 22px', color: '#a1a1aa', fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand({ t }: { t: (typeof HOME_CONTENT)['de'] }) {
  return (
    <section id="kontakt" style={sectionWrap}>
      <div style={container}>
        <div
          data-testid="cta-band"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: '64px 40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -160,
              height: 300,
              width: 'min(600px,120vw)',
              transform: 'translateX(-50%)',
              borderRadius: 999,
              background: 'rgba(200,255,0,0.06)',
              filter: 'blur(100px)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <span
              style={{
                display: 'inline-flex',
                width: 56,
                height: 56,
                borderRadius: 16,
                border: '1px solid rgba(200,255,0,0.3)',
                background: 'rgba(200,255,0,0.06)',
                margin: '0 auto',
                position: 'relative',
              }}
            >
              <span style={{ position: 'absolute', inset: 19, borderRadius: 4, background: '#C8FF00', boxShadow: '0 0 16px rgba(200,255,0,0.7)' }} />
            </span>
            <h2 style={{ margin: '26px auto 0', maxWidth: 620, fontFamily: 'Outfit, sans-serif', fontWeight: 300, fontSize: 'clamp(1.8rem,3.6vw,2.8rem)', color: '#fff', letterSpacing: '-0.02em' }}>
              {t.ctaBandTitle}
            </h2>
            <p style={{ margin: '18px auto 0', maxWidth: 520, color: '#a1a1aa', fontSize: 15, lineHeight: 1.7, fontWeight: 300 }}>
              {t.ctaBandText}
            </p>
            <div style={{ marginTop: 34, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <a href="#top" data-testid="cta-band-btn" style={primaryBtn}>
                {t.ctaBandBtn}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * Homepage
 * ============================================================ */

export function HomePage() {
  const { lang } = useLang();
  const t = HOME_CONTENT[lang];

  return (
    <>
      <Hero t={t} />
      <Marquee t={t} />
      <Pillars t={t} />
      <Services t={t} />
      <Process t={t} />
      <Pricing t={t} />
      <References t={t} />
      <About t={t} />
      <Faq t={t} />
      <CtaBand t={t} />
    </>
  );
}
