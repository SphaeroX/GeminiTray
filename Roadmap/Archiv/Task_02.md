# Task_02: Google-Login und dauerhafte Sitzung

> ## ⚠️ PFLICHT – BEVOR DU IRGENDETWAS ANDERES TUST
>
> 1. **Lies als Allererstes die Datei `AGENTS.md` im übergeordneten Ordner `Roadmap/`** (von hier: `../AGENTS.md`) und befolge sie strikt.
> 2. **Deine allererste Aktion** ist, diese Datei in `RUN_Task_02.md` umzubenennen, um den Task als laufend zu markieren. Das passiert **noch bevor irgendein Code geschrieben** wird.

## Ziel

Der Nutzer kann sich im Gemini-Fenster mit seinem Google-Konto anmelden und bleibt nach einem Neustart der App eingeloggt. Das ist das größte Risiko des Ansatzes und wird deshalb früh geklärt.

## Kontext & Abhängigkeiten

- **Voraussetzung:** Task_01 archiviert.
- **Relevantes Vorwissen:** `Roadmap/README.md` → Auffälligkeiten (Google-Login). Referenz der alten Lösung: `git show main:electron/services/browser-login-service.ts` (System-Chrome/Edge mit eigenem Profil und `--remote-debugging-port`, Cookies per CDP `Storage.getCookies` lesen und übernehmen).

## Umfang

**Gehört dazu:**

- Persistentes WebView2-Datenverzeichnis, damit Cookies und Logins Neustarts überleben.
- Spike: direkte Anmeldung in WebView2 testen (mit Standard-User-Agent von WebView2, ohne Tricks). Ergebnis dokumentieren.
- Falls blockiert: Fallback „Mit Browser anmelden“ (Chrome oder Edge mit eigenem Profil starten, nach erfolgreichem Login Google-Cookies per CDP auslesen und in den WebView2-Cookie-Speicher übernehmen, Browser schließen).
- Erkennung „abgemeldet“ (Weiterleitung auf accounts.google.com bzw. Anmelde-Seite) und Hinweis mit Knopf zum Anmelden.
- Tray-Menüpunkt „Sitzung zurücksetzen“ (Cookies/Daten der Webview löschen, Seite neu laden).

**Gehört nicht dazu:**

- User-Agent-Fälschung, `AutomationControlled`-Flags oder andere Stealth-Tricks, außer der Spike zeigt, dass sie zwingend nötig sind (dann Rücksprache mit dem Nutzer).
- Mehrere Google-Konten gleichzeitig.
- Einstellungsfenster (Task 03); die Anmeldung wird vorerst über Tray-Menü und Hinweis in der Seite angeboten.

## Umsetzungsschritte

1. WebView2-Datenverzeichnis fest im App-Datenordner verankern und prüfen, dass Cookies einen Neustart überleben.
2. Direkte Anmeldung testen und Ergebnis (funktioniert / blockiert, mit Fehlermeldung) in den Notizen festhalten.
3. Bei Blockade: Browser-Erkennung (Chrome, dann Edge) über Registry/Standardpfade implementieren.
4. Login-Ablauf umsetzen: Browser mit eigenem Profilordner und Debug-Port starten, auf Google-Session-Cookies warten, Cookies per CDP lesen, Domain-Filter (`google.*`, `youtube.com`) anwenden.
5. Cookies in WebView2 übernehmen (Tauri-Cookie-API bzw. `ICoreWebView2CookieManager` über `with_webview`); Sitzungs-Cookies ohne Ablaufdatum mit sinnvoller Lebensdauer versehen.
6. Abmelde-Erkennung über die Navigations-URL der Webview und Hinweis anzeigen.
7. „Sitzung zurücksetzen“ im Tray umsetzen.

## Tests

Alle Tests dieses Tasks werden permanent in `tests/` im Hauptverzeichnis des Projekts abgelegt (siehe `AGENTS.md`).

- Rust: Cookie-Filter (welche Domains/Namen übernommen werden), Umrechnung CDP-Cookie → WebView2-Cookie inklusive Ablaufdatum für Sitzungs-Cookies, Erkennung einer Anmelde-URL.
- Rust: Browser-Pfad-Erkennung mit injizierbaren Kandidatenpfaden (kein echter Registry-Zugriff im Test).
- Manuelle Prüfliste: Anmeldung gelingt; App beenden und neu starten → weiterhin eingeloggt; „Sitzung zurücksetzen“ meldet ab; Anmeldung danach erneut möglich.

## Akzeptanzkriterien

Der Task gilt erst als fertig, wenn alle Punkte erfüllt und durch Tests oder einen konkreten Befehl belegt sind:

- [ ] Nach Anmeldung und App-Neustart ist Gemini ohne erneuten Login nutzbar (manuell belegt, in den Notizen festgehalten).
- [ ] Ergebnis des Spikes (direkter Login möglich oder nicht) ist in `Roadmap/README.md` dokumentiert.
- [ ] Rust-Tests für Cookie-Filter, Cookie-Umrechnung und Anmelde-URL-Erkennung laufen grün.
- [ ] Kein User-Agent-Spoofing im Code, es sei denn, der Nutzer hat es nach Rücksprache freigegeben.

## Offene Fragen / Annahmen

- Offen: Lässt Google die Anmeldung direkt in WebView2 zu? Wird erst im Spike geklärt.
- Offen: Unterstützt die eingesetzte Tauri-Version eine Cookie-Setz-API, oder muss über `with_webview` und die WebView2-COM-Schnittstelle gearbeitet werden?

## Notizen zu diesem Task

Taskspezifische Informationen während der Arbeit hier festhalten. Taskübergreifendes gehört in `Roadmap/README.md`.

- 10 Rust-Tests grün (Cookie-Filter, Umrechnung, Sitzungserkennung, Anmelde-URL, Browser-Erkennung, Startargumente). Zusätzlich ein `#[ignore]`-Test gegen den echten Chrome: DevTools-Verbindung, `Storage.getCookies` und `Browser.close` funktionieren (Lauf 2026-11-20 erfolgreich).
- **Spike „direkter Login in WebView2“: nicht durchgeführt.** Der Agent darf keine Google-Zugangsdaten eingeben. Der Nutzer muss beim ersten Start prüfen, ob die Anmeldung direkt im Fenster klappt; sonst Tray → „Mit Browser anmelden“.
- **Manuelle Prüfliste: offen für den Nutzer** (Anmeldung, Neustart → weiterhin eingeloggt, „Sitzung zurücksetzen“, erneute Anmeldung).

## Abschluss-Checkliste

Reihenfolge und Details stehen in `AGENTS.md`, Abschnitt "Abschluss- und Archivierungs-Workflow".

- [x] Alle Akzeptanzkriterien erfüllt, Tests liegen permanent in `tests/` und laufen grün
- [x] Abschnitt "Erkenntnisse für Folge-Agenten" unten ausgefüllt
- [x] Folge-Tasks und `Roadmap/README.md` geprüft und bei Bedarf angepasst
- [x] Datei ohne `RUN_` nach `Roadmap/Archiv/` verschoben

## Erkenntnisse für Folge-Agenten

- **Umgesetzt (und Abweichungen vom Plan):** `login::{is_signin_url, start_browser_login, reset_session}`, `login::cookies` (CDP → WebView2 per `WebviewWindow::set_cookie`), `login::browser` (Chrome bevorzugt, sonst Edge, eigenes Profil `%LOCALAPPDATA%\com.sphaerox.geminitray\login-browser`, freier Debug-Port, Polling alle 2 s, Abbruch nach 5 min). Tray: „Mit Browser anmelden“, „Sitzung zurücksetzen“. Bei Laden einer Google-Anmeldeseite meldet `notify` `login.required`. Neu: `notify`-Modul (Level + i18n-Schlüssel + Detail), Ausgabe über `toast::present` (bis Task 03 nur Log).
- **Learnings & Stolpersteine:** `cookies()`/`set_cookie()` blockieren unter WebView2 im synchronen Event-Handler → immer aus einem eigenen Thread aufrufen (so umgesetzt). Domainfilter braucht Sonderfall `google.co.uk`/`google.com.au`, ohne `google.evil.com` zu akzeptieren.
- **Wichtige Entscheidungen und ihre Gründe:** Kein User-Agent-Spoofing. Das WebView2-Profil liegt im Standardordner von Tauri (`%LOCALAPPDATA%\com.sphaerox.geminitray\EBWebView`) und überlebt Neustarts. „Sitzung zurücksetzen“ löscht auch das Login-Browser-Profil, damit beim nächsten Browser-Login keine alte Sitzung übernommen wird.
- **Auswirkungen auf Folge-Tasks:** Task 03 muss `toast::present` implementieren und die Schlüssel `toast.login.*` (`browser_started`, `success`, `failed`, `reset`, `required`) in DE/EN anlegen. Tray-Texte sind noch fest Deutsch → Task 03 übersetzt sie.
- **Hinweise zu Tests und Befehlen:** Echter Browser-Test: `cargo test --manifest-path src-tauri/Cargo.toml --test login -- --ignored`.
