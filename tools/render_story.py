#!/usr/bin/env python3
"""Timo-Story-Reel rendern (Stil: Büste unten, Wort-für-Wort-Headline oben, animierte Karten in der Mitte).
Aufruf: python3 tools/render_story.py brands/<marke>/posts/KW49/1-mo-reel/story.json
Ergebnis im selben Ordner: reel.mp4 (mit Sprachspur), cover.jpg, vo/voice.wav, vo/sync.json.

story.json:
{ "wortmarke": "CHEFSACHE<b>48</b>",            # HTML, oben links
  "farben": {"acc":"#F2A33A","acc2":"#E08414","dk":"#1E3B2C","bg":"#F1ECE2"},
  "schritte": true,                              # Anzeige SCHRITT n/N
  "saetze": [ {                                  # 4–6 Sätze, je einer pro Szene
      "text": "2 % Skonto liegen lassen? Das ist [teurer,] als du denkst.",   # [..] = Akzentwort(e)
      "sprech": "Zwei Prozent Skonto ...",       # optional: Aussprache für die Stimme (Zahlen ausschreiben)
      "label": "geld — skonto",
      "pose": "r_zeig2", "pose2": "r_wow", "pose2_bei": 0.55,   # Posen siehe unten
      "karten": "<div class='kc' data-d='0' style='left:150px;top:60px;width:560px;height:300px;transform:rotate(-4deg)'>…</div>"
  } ],
  "pose_ende": "r_neutral",
  "ende": {"cta":"Speichern & einem Chef schicken ✓","hinweis":"Beispielrechnung · keine Steuerberatung","logo":null}   # oder false
}
Karten: HTML im Mittelfeld (1080×520 px, ab y=500). Jedes Element mit data-d="<Sekunden nach Satzbeginn>" ploppt ein.
Klassen: kc (weiße Karte mit Rand + Punktschatten), pill (Akzent-Pille), tag (schwarze Pille), q (Fragezeichen-Kreis),
stamp (Stempel, knallt rein; <small> für Unterzeile), big (große Zahl), mono. data-w="560" animiert die Breite (Balken).
Posen (brands/_shared/timo/real/): r_neutral, r_neutral2 (Hände gefaltet/unten), r_zeig, r_zeig2, r_zeig3 (Zeigefinger),
r_wow (überrascht, Hände hoch), r_shrug (Achselzucken), r_hand (präsentiert zur Seite), r_kinn (nachdenklich), r_zwinker (Daumen + Zwinkern),
s_stopp (Hände abwehrend), s_oben (zeigt schräg nach oben), s_daumen.
Stimme: Platzhalter espeak-ng (mb-de6). Liegt im Ordner stimme.wav/stimme.mp3 + "pausen" fehlen nicht -> TODO Voice Studio.
"""
import json,sys,os,re,subprocess,wave,http.server,threading,functools
import numpy as np
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
def voice(d,saetze):
    vo=d/'vo';vo.mkdir(exist_ok=True);SR=22050;gap=.35;t=.25;parts=[];segs=[]
    for i,z in enumerate(saetze):
        txt=z.get('sprech') or re.sub(r'[\[\]]','',z['text']).replace('%',' Prozent')
        f=vo/f'l{i}.wav';subprocess.run(['espeak-ng','-v','mb-de6','-s','172','-p','45','-w',str(f),txt],check=True)
        w=wave.open(str(f));assert w.getframerate()==SR;a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)
        nz=np.where(np.abs(a)>300)[0];a=a[nz[0]:nz[-1]+1];segs.append({'i':i,'t0':round(t,3),'t1':round(t+len(a)/SR,3)});parts.append(a);t+=len(a)/SR+gap
    out=np.zeros(int((t+.1)*SR),dtype=np.float32)
    for s,a in zip(segs,parts):k=int(s['t0']*SR);out[k:k+len(a)]+=a
    w=wave.open(str(vo/'voice.wav'),'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(np.clip(out,-32767,32767).astype(np.int16).tobytes());w.close()
    json.dump({'segs':segs,'T':round(t+.1,2)},open(vo/'sync.json','w'))
def run(p):
    p=Path(p).resolve();d=p.parent;S=json.loads(p.read_text(encoding='utf-8'));voice(d,S['saetze'])
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*a):pass
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Q,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
    rel=os.path.relpath(d,ROOT/'brands/_shared/timo').replace(os.sep,'/')
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path='/usr/bin/google-chrome');pg=b.new_page(viewport={'width':1080,'height':1920})
        pg.on('pageerror',lambda e:print('ERR',e))
        pg.goto(f'http://127.0.0.1:{srv.server_port}/brands/_shared/timo/story-gen.html?p={rel}');pg.wait_for_function('window.ready===true',timeout=60000)
        T=pg.evaluate('T');el=pg.locator('#f')
        if len(sys.argv)>2 and sys.argv[2]=='--frames':
            for i,t in enumerate([.5,T*.25,T*.45,T*.65,T*.85,T-1]):pg.evaluate('t=>render(t)',t);el.screenshot(path=str(d/f'_frame{i}.png'))
        else:
            ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate','30','-i','-','-i',str(d/'vo/voice.wav'),'-af','apad','-shortest','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(d/'reel.mp4')],stdin=subprocess.PIPE)
            for i in range(int(T*30)):pg.evaluate('t=>render(t)',i/30);ff.stdin.write(el.screenshot(type='png'))
            ff.stdin.close();ff.wait()
            pg.evaluate('t=>render(t)',.5);el.screenshot(path=str(d/'cover.jpg'),type='jpeg',quality=90)
        b.close()
    print(d/'reel.mp4',round(T,1),'s')
for a in sys.argv[1:]:
    if a.endswith('.json'):run(a)
