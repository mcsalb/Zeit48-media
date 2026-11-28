# Timo – animierte 2.5D-Figur (Prototyp)
- `timo.js`: Vektor-Rig (Kopf, Mimik, 8 Mundformen M1–M8, Arme mit Ober-/Unterarm, Hände mit Fingerstellung, Beine). `timo(pose)` liefert SVG.
- `anim.html`: Szene mit Keyframes (Posen, Kamera, Karten, Untertitel), Lipsync aus `vo/sync.json`.
- `vo.py`: erzeugt Sprachspur (Platzhalter: espeak-ng mbrola de6) + Lipsync-Daten aus `lines.json`. Später: Voice-Studio-Stimme.
- `rend.py anim.html out.mp4` rendert Video mit Ton (30 fps). `rend.py anim.html st 1,5,9` rendert Standbilder.
Vorlage der Figur: Charakterblätter „Master Timo“ (Zeit48).

## v2 (aktuell): Timo aus den Charakterblättern
- `vorlagen/`: Original-Blätter (Gesten, Ausdrücke/Mundformen, Turnaround, GIF).
- `assets.sh` → `cut.py` (Hintergrund entfernen, 4× hochskalieren) + `trace.py` (vtracer) → `raster.py` (SVG → PNG mit Alpha) in `as/`.
- `as/p1,p2,p4,p5,p6` Gesten, `as/e1,e4,e6` Porträts, `as/m1–m8` Mundformen (weich maskiert).
- `cut.html`: Szene (Einstellungen = Posen/Porträts, Kamera, Lipsync-Overlay je Asset über `A[..].m`). Render: `python3 rend.py cut.html out.mp4`.
