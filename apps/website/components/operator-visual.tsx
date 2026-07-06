import { Check, Files, LayoutDashboard, Settings2, Zap } from "lucide-react";

export function OperatorVisual() {
  return (
    <div className="operator-wrap" aria-label="Visualisierung eines NeXify AI Operator-Dashboards">
      <div className="operator-device">
        {/* ── Title Bar ── */}
        <div className="operator-head">
          <div className="operator-dots"><i /><i /><i /></div>
          <span>NeXify Operator</span>
          <b><span className="relative inline-flex h-1.5 w-1.5 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></span>LIVE</b>
        </div>

        <div className="operator-body">
          {/* ── Sidebar ── */}
          <aside className="operator-sidebar" aria-hidden="true">
            <span className="active"><LayoutDashboard /></span>
            <span><Zap /></span>
            <span><Check /></span>
            <span><Files /></span>
            <span><Settings2 /></span>
          </aside>

          {/* ── Dashboard Content ── */}
          <div className="operator-dashboard">
            {/* ── Metrics Row ── */}
            <div className="operator-metrics">
              <article className="operator-value">
                <small>Automatisierter Geschäftswert</small>
                <strong>€ 184.260 <em>/ Monat</em></strong>
                <span>↗ 18,4 % seit letztem Zyklus</span>
                <svg viewBox="0 0 320 48" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,44 C28,40 38,27 65,30 C92,34 98,20 126,22 C158,24 166,9 196,14 C229,19 246,3 276,8 C296,10 307,5 320,2 L320,48 L0,48 Z" fill="url(#chartGrad)" />
                  <path d="M0,44 C28,40 38,27 65,30 C92,34 98,20 126,22 C158,24 166,9 196,14 C229,19 246,3 276,8 C296,10 307,5 320,2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </article>
              <article className="operator-mini">
                <small>Autonomiegrad</small>
                <span>mit Policy-Gates</span>
                <div className="operator-gauge"><b>82%</b></div>
              </article>
            </div>

            {/* ── Activity Chart ── */}
            <article className="operator-chart">
              <small>Agentenaktivität · letzte 24 Stunden</small>
              <div className="grid-lines" />
              <svg viewBox="0 0 430 70" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,.06)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                  <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(74,222,128,.04)" />
                    <stop offset="100%" stopColor="rgba(74,222,128,0)" />
                  </linearGradient>
                </defs>
                <path d="M0 59 C35 55,47 41,79 45 S128 53,158 35 S210 16,242 24 S294 52,322 28 S376 4,430 11 L430,70 L0,70 Z" fill="url(#areaGrad1)" />
                <path d="M0 59 C35 55,47 41,79 45 S128 53,158 35 S210 16,242 24 S294 52,322 28 S376 4,430 11" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.5" />
                <path d="M0 63 C38 62,58 54,95 57 S151 48,188 52 S250 29,285 38 S354 26,430 30 L430,70 L0,70 Z" fill="url(#areaGrad2)" />
                <path d="M0 63 C38 62,58 54,95 57 S151 48,188 52 S250 29,285 38 S354 26,430 30" fill="none" stroke="rgba(74,222,128,.12)" strokeWidth="1" />
              </svg>
            </article>

            {/* ── Task List ── */}
            <div className="operator-tasks">
              <div><i /><b>Lead-Qualifizierung D/A/CH</b><span>fertig</span></div>
              <div><i /><b>Portal-Release prüfen</b><span>läuft</span></div>
              <div><i /><b>Angebot vorbereiten</b><span>bereit</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
