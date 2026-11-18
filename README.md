# Zeit48 Media

Instagram-Medien für **zeit48.de**. Eine geplante Claude-Aufgabe erzeugt jeden Sonntag die 7 Posts der Folgewoche, legt sie hier ab und plant sie in Metricool als **Entwürfe** ein. Freigabe durch Ralf.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `vorlagen/` | HTML-Vorlagen im Zeit48-Stil (`bild.html` für Bild und Karussell-Folien, `reel.html` für Reels), Bausteine in `elemente.js`, Schriften in `fonts/` |
| `tools/render.py` | Rendert eine `post.json` zu PNG/MP4 (Playwright + Chrome + ffmpeg) |
| `posts/KW<nn>/<n>-<tag>-<format>/` | `post.json`, `caption.txt`, fertige Medien |
| `themen.json` | Themenpool (64 Themen), Wochenformate und Historie |
| `learnings.md` | Wöchentliche Auswertung der Metricool-Zahlen |

## Öffentliche Links für Metricool

Das Repo ist öffentlich. Jede Datei ist ohne GitHub Pages erreichbar unter

`https://raw.githubusercontent.com/mcsalb/zeit48-media/main/<pfad>`

## Rendern

```bash
pip install playwright --break-system-packages   # Chrome unter /usr/bin/google-chrome
python3 tools/render.py posts/KW48/1-mo-reel/post.json
```

Bausteine für `element`: `tagesleiste`, `zifferblatt`, `zahl`, `wochenbalken`, `chips`, `checkliste`, `mythos`, `pov`. Beispiele siehe `posts/`.
