# UX_ACCESSIBILITY_STANDARD

## Versionsblock

| Feld            | Wert                                              |
|-----------------|---------------------------------------------------|
| **Dokument-ID** | NEX-NORM-004                                      |
| **Version**     | 1.0                                               |
| **Stand**       | 2025-06-23                                        |
| **Status**      | Freigegeben                                       |
| **Prüfintervall** | Jährlich, bei Gesetzesänderung sofort          |
| **Verantwortlich** | UX-Lead / Compliance-Beauftragter             |

## Normen und Referenzen

- DIN EN ISO 9241-11 (Anforderungen an die Gebrauchstauglichkeit)
- DIN EN ISO 9241-110 (Dialogprinzipien)
- DIN EN ISO 9241-143 (Formulare)
- DIN EN ISO 9241-210 (Menschzentrierter Gestaltungsprozess)
- DIN EN ISO 9241-125 (Visuelle Informationsdarstellung)
- EN 301 549 (Barrierefreiheit von IKT-Produkten)
- WCAG 2.2 Level AA (Web Content Accessibility Guidelines)
- BFSG (Barrierefreiheitsstärkungsgesetz, gültig ab 28.06.2025)

---

## 1. HCD-Prozess nach DIN EN ISO 9241-210

Der menschzentrierte Gestaltungsprozess ist für alle NeXify-Produkte verbindlich:

```
Analyse → Konzeption → Gestaltung → Evaluation (iterativ)
```

### 1.1 Analyse
- Nutzungskontext erheben: Benutzergruppen, Aufgaben, Umgebungen
- Nutzungsanforderungen ableiten (z. B. minimale Bildschirmgröße, Kontrastbedarf)
- Barrierefreiheitsanforderungen aus EN 301 549 und BFSG erfassen

### 1.2 Konzeption
- Prototypen (low- / high-fidelity) unter Einbeziehung von Assistenztechnologien
- Tastatur-Navigationskonzept festlegen
- Screenreader-konforme Struktur definieren (HTML-Landmarks, ARIA)

### 1.3 Gestaltung
- Visuelles Design nach ISO 9241-125 (abschnitt 4)
- Dialoggestaltung nach ISO 9241-110 (siehe Abschnitt 3)
- Formular-Validierung nach ISO 9241-143
- Farben, Typografie, Abstände, Breakpoints (siehe Abschnitt 5)

### 1.4 Evaluation
- Formative Evaluation (prototypenbasiert)
- Summative Evaluation (produktbezogen)
- Dokumentation der Prüfergebnisse (siehe Abschnitt 6)

---

## 2. UX-Kriterien pro Projektphase

| Phase             | Kriterium                                          | Norm                     |
|-------------------|----------------------------------------------------|--------------------------|
| Analyse           | Vollständige Nutzungskontextbeschreibung           | ISO 9241-210 Abs. 6.2    |
| Konzeption        | Nachweis der Tastaturbedienbarkeit                 | EN 301 549 / WCAG 2.2    |
| Gestaltung        | Kontrastverhältnis ≥ 4,5:1 (Normaltext)            | WCAG 2.2 SC 1.4.3        |
| Gestaltung        | Kontrastverhältnis ≥ 3:1 (großer Text, UI-Komp.)   | WCAG 2.2 SC 1.4.11       |
| Gestaltung        | Mindest-Schriftgröße 16px (Body)                   | ISO 9241-125              |
| Gestaltung        | Berührungszielgröße mind. 44×44 px                 | WCAG 2.2 SC 2.5.8        |
| Evaluation        | Keine Kritischen/Blockierenden WCAG-Verstöße       | WCAG 2.2 AA              |
| Evaluation        | Nutzertest mit ≥ 5 Teilnehmern pro Persona         | ISO 9241-210 Abs. 8      |

---

## 3. Dialogprinzipien (ISO 9241-110)

### 3.1 Aufgabenangemessenheit
Der Dialog unterstützt den Benutzer bei der effizienten und effektiven Aufgabenerledigung.
- Keine überflüssigen Schritte oder Abfragen
- Standardwerte und Vorhersagen nutzen

### 3.2 Selbstbeschreibungsfähigkeit
Der Dialog erklärt sich selbst durch verständliche Beschriftungen und Hinweise.
- Labels sichtbar und programmatisch (z. B. `<label for="">`)
- Fehlermeldungen klar formuliert mit Lösungsvorschlag

### 3.3 Steuerbarkeit
Der Benutzer kann Geschwindigkeit, Reihenfolge und Abbruch von Dialogen steuern.
- Keine zeitkritischen Aktionen ohne Warnung
- Abbruch jeder Operation möglich

### 3.4 Erwartungskonformität
Der Dialog verhält sich konsistent und entspricht den Erwartungen des Benutzers.
- Einheitliche Navigation, Icons, Begriffe
- Standards (Browser-Verhalten, OS-Konventionen) beachten

### 3.5 Fehlertoleranz
Fehler werden abgefangen, erklärt und korrigierbar gemacht.
- Validierung in Echtzeit (on blur), nicht erst beim Absenden
- Rückgängig-Funktion (Undo) für kritische Aktionen

### 3.6 Individualisierbarkeit
Der Benutzer kann Darstellung und Interaktion anpassen.
- Schriftvergrößerung bis 200 % ohne Funktionsverlust
- Farbmodus (Hell / Dunkel) umschaltbar

### 3.7 Lernförderlichkeit
Der Dialog unterstützt den Erwerb von Kenntnissen und Fertigkeiten.
- Onboarding-Tipps, Tooltips, Hilfetexte
- Progressive Disclosure: Komplexität schrittweise aufbauen

---

## 4. Barrierefreiheit

### 4.1 WCAG 2.2 AA – Pflichtanforderungen

| Prinzip          | Erfolgskriterium                                      | Anforderung                                                  |
|------------------|-------------------------------------------------------|--------------------------------------------------------------|
| Wahrnehmbar      | 1.1.1 Nicht-Text-Inhalt                               | Jedes Nicht-Text-Element hat einen Alternativtext            |
| Wahrnehmbar      | 1.4.3 Kontrast (Normaltext)                           | Mindestkontrast 4,5:1                                        |
| Wahrnehmbar      | 1.4.11 Kontrast (Nicht-Text)                          | Mindestkontrast 3:1 für UI-Komponenten                        |
| Bedienbar        | 2.1.1 Tastatur                                        | Alle Funktionen per Tastatur bedienbar                        |
| Bedienbar        | 2.4.3 Fokus-Reihenfolge                               | Logische, nachvollziehbare Reihenfolge                        |
| Bedienbar        | 2.4.7 Fokus sichtbar                                  | Fokus-Indikator stets sichtbar (mind. 2px Outline)           |
| Bedienbar        | 2.5.8 Zielgröße                                       | Berührungsziele mind. 24×24 px (AA)                          |
| Verständlich     | 3.3.1 Fehleridentifikation                             | Eingabefehler werden automatisch erkannt und beschrieben     |
| Verständlich     | 3.3.2 Beschriftungen (Labels)                         | Alle Eingabefelder haben programmatische Labels               |
| Robust           | 4.1.2 Name, Rolle, Wert                               | Alle UI-Komponenten korrekt an Accessibility-API übergeben    |

### 4.2 EN 301 549 – zusätzliche Anforderungen
- Kapitel 5: Anforderungen an die Bedienung (Hardware-frei)
- Kapitel 6: IKT mit Zwei-Weiß-Sprachkommunikation
- Kapitel 7: IKT mit Videofunktionen (Untertitel, Audiodeskription)
- Kapitel 8: Webinhalte (deckt sich mit WCAG 2.2 AA)
- Kapitel 9: Nicht-Web-Dokumente (PDF/Office, PDF/UA-konform)
- Kapitel 10: Dokumentation und Support (barrierefrei bereitstellen)
- Kapitel 11: Autorentools (unterstützen barrierefreie Erstellung)

### 4.3 BFSG – Anforderungen ab 28.06.2025
- § 1 Anwendungsbereich: Produkte und Dienstleistungen nach BFSG § 1 Abs. 1
- § 3 Barrierefreiheitsanforderungen: Wahrnehmbarkeit, Bedienbarkeit, Verständlichkeit, Robustheit
- § 4 Rechtsfolgen: Bußgelder, Abmahnungen, Marktzugangsbeschränkungen
- Nachweis: Konformitätsbewertung (Dokumentation, Prüfbericht)
- Ausnahmen: unverhältnismäßige Belastung (§ 4 Abs. 3) – muss dokumentiert werden

---

## 5. Visuelle Gestaltung (ISO 9241-125)

### 5.1 Farbpalette
- Primärfarben: definiert im Designsystem (min. 4,5:1 zu Weiß/Schwarz)
- Keine rein farblichen Unterscheidungen (zusätzliche Markierung: Icon, Text, Muster)
- Fehlerfarbe nicht rot allein – zusätzlich Icon + Text
- Linkfarbe unterstrichen oder mit Icon

### 5.2 Typografie
- Systemschrift oder barrierefreie Schrift (z. B. Atkinson Hyperlegible, Noto Sans)
- Body: min. 16px (1rem)
- Überschriften: mind. 1.25×, 1.5×, 2× Body-Größe
- Zeilenabstand: min. 1.5 (Body), 1.3 (Headlines)
- Textausrichtung: linksbündig (außer Sprachen mit R/L-Leserichtung)

### 5.3 Abstände
- Padding: min. 8px um klickbare Elemente
- Abstand zwischen interaktiven Elementen: min. 4px
- Fokus-Ring: min. 2px, Abstand zum Element: 2px

### 5.4 Responsive Breakpoints
| Breakpoint | Viewport  | Layout                          |
|------------|-----------|---------------------------------|
| Mobile     | < 600 px  | Einspaltig, Navigation als Drawer |
| Tablet     | 600–1024 px | Zwei-/Dreispaltig            |
| Desktop    | > 1024 px | Mehrspaltig, Sidebar optional   |
| Large      | > 1440 px | Maximalbreite 1280px zentriert   |

---

## 6. Prüfverfahren

### 6.1 Automatisierte Tests
- **axe-core** (Playwright/WebdriverIO): pro Pipeline-Lauf
- **WAVE** (Browser-Plugin): wöchentlicher Stichprobentest
- Schwellwert: 0 kritische/blockierende Fehler, ≤ 5 Warnungen pro Seite

### 6.2 Manuelle Tests
- **Tastatur-Test**: Alle Funktionen per Tab, Pfeiltasten, Enter/Escape erreichbar – ohne Maus
- **Screenreader-Test**: NVDA (Windows), VoiceOver (macOS/iOS) – logische Ansage, sinnvolle Reihenfolge
- **Zoom-Test**: Browser-Zoom bis 200 % – kein horizontaler Scroll, kein Funktionsverlust
- **Fokus-Test**: Fokus-Indikator stets sichtbar, keine Fokus-Fallen

### 6.3 Nutzertests
- Mindestens 5 Teilnehmer pro relevanter Persona
- Mindestens 1 Teilnehmer mit Behinderung (Seh-, Motorik-, kognitive Einschränkung)
- Testdokumentation: Aufgaben, Fehler, Dauer, subjektive Zufriedenheit (SUS)

---

## 7. Verbote

| # | Verbot                                                                                     | Norm                        |
|---|--------------------------------------------------------------------------------------------|-----------------------------|
| 1 | Keine rein farblichen Unterscheidungen (z. B. rot/grün allein)                            | WCAG 1.4.1, ISO 9241-125    |
| 2 | Keine nicht-tastaturbedienbaren Komponenten                                                | WCAG 2.1.1, EN 301 549      |
| 3 | Keine fehlenden Labels an Formularfeldern                                                 | WCAG 3.3.2                  |
| 4 | Keine Fokus-Fallen (Tab fängt sich auf Element)                                           | WCAG 2.1.2                  |
| 5 | Keine Untertitel oder Audiodeskription bei Videomedien                                    | WCAG 1.2.x, EN 301 549 § 7  |
| 6 | Keine automatisch abspielenden Medien ohne Steuerung                                      | WCAG 1.4.2                  |
| 7 | Keine Bewegungseffekte ohne `prefers-reduced-motion`-Respekt                               | WCAG 2.3.3 (AAA-Empfehlung) |
| 8 | Keine zeitbeschränkten Eingaben ohne Verlängerungsoption (Ausnahme: Echtzeitsysteme)       | WCAG 2.2.1                  |

---

## 8. Verantwortlichkeiten

| Rolle                    | Aufgabe                                                     |
|--------------------------|-------------------------------------------------------------|
| UX-Lead                  | Einhaltung der Dialogprinzipien, HCD-Prozess                |
| Frontend-Entwickler      | WCAG- und EN-301-549-konforme Implementierung                |
| QA / Tester              | Automatisierte und manuelle Barrierefreiheitstests          |
| Compliance-Beauftragter  | BFSG-Konformitätsnachweis, Audit-Vorbereitung               |
| Produktmanager           | Anforderungserhebung, Nutzungskontext-Dokumentation         |

---

## 9. Änderungshistorie

| Version | Datum       | Änderung                              | Autor                |
|---------|------------|----------------------------------------|----------------------|
| 1.0     | 2025-06-23 | Initiale Erstellung                    | Systemmaster NeXify  |
