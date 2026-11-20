#!/usr/bin/env python3
"""Rendert Posts der Marken unter brands/ (chefsache48, mcs, m-consult).
Aufruf: python3 tools/render_brand.py brands/<marke>/posts/KW48/1-mo-reel/post.json …
typ: bild -> bild.png | karussell -> folie-1..n.png | reel -> reel.mp4 + cover.jpg | story -> story.png
Felder je Folie/Szene: label, hook (+hg Schriftgröße, <em> = Akzent), text (<b>), vs[{l,t,gut}], tl[{y,d,hot}], ck[], x[], chips[], bild (Pfad relativ zu brands/_shared, z. B. ../mcs/assets/x.png), rechnung{rows[{t,n,v}],sumLabel,sum}, note, dark, mitte, cta(true = Abschlussfolie), dauer (Reel)."""
import json, subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parent.parent
SH = ROOT / 'brands' / '_shared'
def run(p):
    p = Path(p).resolve(); spec = json.loads(p.read_text(encoding='utf-8')); d = p.parent
    brand = p.relative_to(ROOT / 'brands').parts[0]; typ = spec['typ']
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
        if typ in ('bild', 'karussell', 'story'):
            pg = b.new_page(viewport={'width': 1080, 'height': 1920 if typ == 'story' else 1350})
            pg.goto((SH / 'folie.html').as_uri() + f'?b={brand}')
            fol = spec['folien'] if typ == 'karussell' else [spec]
            for i, f in enumerate(fol, 1):
                f = {'fuss': spec.get('fuss', ''), **f}
                if typ == 'karussell': f.setdefault('n', f'{i}/{len(fol)}')
                if typ == 'story': f['story'] = True
                pg.evaluate('s=>zeichne(s)', f); pg.evaluate('fontsOk()')
                name = {'bild': 'bild.png', 'story': 'story.png'}.get(typ, f'folie-{i}.png')
                pg.locator('#f').screenshot(path=str(d / name)); print(d / name)
        elif typ == 'reel':
            pg = b.new_page(viewport={'width': 1080, 'height': 1920})
            pg.goto((SH / 'reel.html').as_uri() + f'?b={brand}')
            T = pg.evaluate('s=>setze(s)', spec); pg.evaluate('fontsOk()')
            ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', str(d / 'reel.mp4')], stdin=subprocess.PIPE)
            el = pg.locator('#f')
            for i in range(int(round(T * 30))):
                pg.evaluate('t=>render(t)', i / 30); ff.stdin.write(el.screenshot(type='png'))
            ff.stdin.close(); ff.wait()
            pg.evaluate('t=>render(t)', spec.get('coverZeit', 1.6)); el.screenshot(path=str(d / 'cover.jpg'), type='jpeg', quality=92)
            print(d / 'reel.mp4', round(T, 1), 's')
        b.close()
for a in sys.argv[1:]: run(a)
