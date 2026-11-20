# Marken (außer Zeit48)

| Ordner | Marke | Kanäle (Metricool blogId) | Rhythmus |
|---|---|---|---|
| chefsache48 | Chefsache48 – Wissen für kleine Betriebe | Instagram (8249729) | täglich |
| mcs | Mattes Computersysteme | Instagram + LinkedIn (8249095) | Di, Do |
| m-consult | M-Consult (reybex-Partner) | Instagram + LinkedIn (8249918) | Mo, Mi |

Gemeinsame Vorlagen: `_shared/` (folie.html, reel.html, bausteine.js, base.css). Marken-Look: `<marke>/brand.css` + `brand.js`.
Rendern: `python3 tools/render_brand.py brands/<marke>/posts/KW48/1-mo-reel/post.json` (Schema im Kopf des Skripts, Beispiele in `<marke>/beispiele/`).
Bilder von den Websites in `<marke>/assets/` ablegen und per `"bild":"../<marke>/assets/datei.png"` einbinden.
