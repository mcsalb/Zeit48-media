# Timo-Story-Reels – Konzept (nur Chefsache48 und Zeit48)

**Ziel:** Mehr Reichweite und Follower. Reels sollen die ersten 3 s halten und gespeichert/geteilt werden.

## Format
- Timo (realistisch, Fotoposen aus `real/`) steht groß als Büste unten, wippt, wechselt pro Satz die Pose (kurze Überblendung + Federeffekt).
- Oben: Satz baut sich Wort für Wort mit der Stimme auf, Schlüsselwort kursiv mit Akzent-Marker; Label `// thema` + `SCHRITT n/N`.
- Mitte: animierte Karten (Rechnung, Kalender, Balken, Stempel, Pillen) erklären die Aussage.
- Erster Frame: Hook-Satz, erste Karte und Timo schon voll sichtbar.
- 20–25 s, 4–6 Sätze, Abschlusskarte mit Marke + CTA.
- Lippen bewegen sich nicht: Timo ist „Moderator“, die Stimme spricht.

## Technik
- `story.json` je Reel → `python3 tools/render_story.py <story.json>` → `reel.mp4` + `cover.jpg` (Schema im Kopf von `tools/render_story.py`).
- Beispiel: `brands/chefsache48/beispiele/story/story.json`.
- Stimme: vorerst Platzhalter (espeak). Später Ralfs Voice-Studio-Stimme (API-Schlüssel + Netzwerkfreigabe nötig) oder eingesprochene Datei.

## Marken
| Marke | Ansprache | farben (acc / acc2 / dk / bg) | wortmarke |
|---|---|---|---|
| Chefsache48 | Du | #F2A33A / #E08414 / #1E3B2C / #F1ECE2 | `CHEFSACHE<b>48</b>` |
| Zeit48 | Du | #D4AF37 / #866719 / #121212 / #F4F3F0 | `ZEIT<b>48</b>` |

MCS und M-Consult nutzen Timo **nicht** (eigene Vorlagen in brands/mcs, brands/m-consult).

## Regeln
- Keine Preise unserer Produkte. Rechenbeispiele als „Beispiel“ kennzeichnen.
- Recht/Steuer vorher prüfen, Hinweis „Keine Rechts-/Steuerberatung“ in `ende.hinweis`.
- Posen abwechseln, mind. 5 verschiedene pro Reel. Karten nie über Timos Kopf (Mittelfeld y 500–1020).
- Vor dem Planen 6 Frames prüfen (`--frames`): nichts abgeschnitten, kein Text über Timo, Umlaute ok.
