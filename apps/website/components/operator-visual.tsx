import { Check, CircleDollarSign, Files, LayoutDashboard, Settings2, Workflow } from "lucide-react";

export function OperatorVisual() {
  return (
    <div className="operator-wrap" aria-label="Visualisierung eines NeXify AI Operator-Dashboards">
      <div className="operator-halo" />
      <div className="operator-device">
        <div className="operator-head">
          <div className="operator-dots"><i /><i /><i /></div>
          <span>NeXify Operator System</span>
          <b>● LIVE</b>
        </div>
        <div className="operator-body">
          <aside className="operator-sidebar" aria-hidden="true">
            <span className="active"><LayoutDashboard /></span><span><Workflow /></span><span><Check /></span><span><Files /></span><span><Settings2 /></span>
          </aside>
          <div className="operator-dashboard">
            <div className="operator-metrics">
              <article className="operator-value">
                <small>Automatisierter Geschäftswert</small>
                <strong>€ 184.260 <em>/ Monat</em></strong>
                <span>↗ 18,4 % seit letztem Zyklus</span>
                <svg viewBox="0 0 320 48" preserveAspectRatio="none" aria-hidden="true"><path d="M0,44 C28,40 38,27 65,30 C92,34 98,20 126,22 C158,24 166,9 196,14 C229,19 246,3 276,8 C296,10 307,5 320,2" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
              </article>
              <article className="operator-mini"><small>Autonomiegrad</small><span>mit Policy-Gates</span><div className="operator-gauge"><b>82%</b></div></article>
            </div>
            <article className="operator-chart"><small>Agentenaktivität · letzte 24 Stunden</small><div className="grid-lines" /><svg viewBox="0 0 430 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 59 C35 55,47 41,79 45 S128 53,158 35 S210 16,242 24 S294 52,322 28 S376 4,430 11" fill="none" stroke="#ff6417" strokeWidth="2.5"/><path d="M0 63 C38 62,58 54,95 57 S151 48,188 52 S250 29,285 38 S354 26,430 30" fill="none" stroke="#baff00" strokeWidth="1.2" opacity=".72"/></svg></article>
            <div className="operator-tasks"><div><i /><b>Lead-Qualifizierung D/A/CH</b><span>fertig</span></div><div><i /><b>Portal-Release prüfen</b><span>läuft</span></div><div><i /><b>Angebot vorbereiten</b><span>bereit</span></div></div>
          </div>
        </div>
      </div>
      <div className="operator-float operator-live-card"><small>Live-Systeme</small><strong>28 / 28 <span>stabil</span></strong><i /></div>
      <div className="operator-float operator-action-card"><small>Nächste Aktion</small><p>Angebot personalisieren und zur Prüfung vorlegen.</p></div>
      <div className="operator-icon-bubble"><CircleDollarSign /></div>
    </div>
  );
}
