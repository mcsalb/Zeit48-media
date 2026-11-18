#!/usr/bin/env python3
"""Rendert einen Zeit48-Post aus einer post.json.

Aufruf:  python3 tools/render.py posts/KW48/1-mo-reel/post.json
Ausgabe liegt im selben Ordner:
  bild      -> bild.png
  karussell -> folie-1.png … folie-n.png
  reel      -> reel.mp4 + cover.jpg

post.json (Auszug):
  {"typ":"reel","theme":"dark","szenen":[{"dauer":3,"label":"…","hook":"…","text":"…","element":{…}}],"coverZeit":1.2}
  {"typ":"bild","theme":"light","label":"…","hook":"…","text":"…","element":{…}}
  {"typ":"karussell","theme":"dark","folien":[{…wie bild…},{…,"cta":true}]}
"""
import json, subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
VORLAGEN = ROOT / "vorlagen"
CHROME = "/usr/bin/google-chrome"
FPS = 30


def open_page(pw, name, w, h):
    b = pw.chromium.launch(executable_path=CHROME, args=["--force-color-profile=srgb"])
    pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
    pg.goto((VORLAGEN / name).as_uri())
    pg.evaluate("document.fonts.ready")
    return b, pg


def wait_fonts(pg):
    pg.evaluate("""async () => { await document.fonts.load('900 italic 50px BC'); await document.fonts.load('800 italic 50px BC');
      await document.fonts.load('400 30px IN'); await document.fonts.load('600 30px IN'); await document.fonts.load('500 20px JB'); await document.fonts.ready; }""")


def bild(pg, spec, out):
    pg.evaluate("s => zeichne(s)", spec)
    wait_fonts(pg)
    pg.locator("#f").screenshot(path=str(out))


def main(p):
    p = Path(p).resolve()
    spec = json.loads(p.read_text(encoding="utf-8"))
    d = p.parent
    typ = spec["typ"]
    with sync_playwright() as pw:
        if typ == "bild":
            b, pg = open_page(pw, "bild.html", 1080, 1350)
            bild(pg, spec, d / "bild.png")
            print(d / "bild.png")
        elif typ == "karussell":
            b, pg = open_page(pw, "bild.html", 1080, 1350)
            n = len(spec["folien"])
            for i, f in enumerate(spec["folien"], 1):
                f = {"theme": spec.get("theme", "dark"), "fuss": spec.get("fuss"), **f}
                f.setdefault("zaehler", f"{i}/{n}")
                bild(pg, f, d / f"folie-{i}.png")
                print(d / f"folie-{i}.png")
        elif typ == "reel":
            b, pg = open_page(pw, "reel.html", 1080, 1920)
            total = pg.evaluate("s => setze(s)", spec)
            wait_fonts(pg)
            frames = int(round(total * FPS))
            out = d / "reel.mp4"
            ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
                                   "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest",
                                   "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
                                   "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", str(out)], stdin=subprocess.PIPE)
            el = pg.locator("#f")
            for i in range(frames):
                pg.evaluate("t => render(t)", i / FPS)
                ff.stdin.write(el.screenshot(type="png"))
            ff.stdin.close(); ff.wait()
            pg.evaluate("t => render(t)", spec.get("coverZeit", 1.4))
            el.screenshot(path=str(d / "cover.jpg"), type="jpeg", quality=92)
            print(out, f"{total:.1f}s", frames, "frames")
        else:
            sys.exit(f"Unbekannter typ: {typ}")
        b.close()


if __name__ == "__main__":
    for a in sys.argv[1:]:
        main(a)
