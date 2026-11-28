# Timo – animierte 2.5D-Figur (Prototyp)
- `timo.js`: Vektor-Rig (Kopf, Mimik, 8 Mundformen M1–M8, Arme mit Ober-/Unterarm, Hände mit Fingerstellung, Beine). `timo(pose)` liefert SVG.
- `anim.html`: Szene mit Keyframes (Posen, Kamera, Karten, Untertitel), Lipsync aus `vo/sync.json`.
- `vo.py`: erzeugt Sprachspur (Platzhalter: espeak-ng mbrola de6) + Lipsync-Daten aus `lines.json`. Später: Voice-Studio-Stimme.
- `rend.py anim.html out.mp4` rendert Video mit Ton (30 fps). `rend.py anim.html st 1,5,9` rendert Standbilder.
Vorlage der Figur: Charakterblätter „Master Timo“ (Zeit48).
