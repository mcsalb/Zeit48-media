import sys,subprocess,http.server,threading,functools,os,json
from playwright.sync_api import sync_playwright
D=os.path.dirname(os.path.abspath(__file__))
class Q(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8767),functools.partial(Q,directory=D));threading.Thread(target=srv.serve_forever,daemon=True).start()
page,out=sys.argv[1],sys.argv[2];stills=[float(x) for x in sys.argv[3].split(',')] if len(sys.argv)>3 else None
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/google-chrome');pg=b.new_page(viewport={'width':1080,'height':1920})
 pg.on('pageerror',lambda e:print('ERR',e))
 pg.goto(f'http://127.0.0.1:8767/{page}');pg.wait_for_function('window.ready===true')
 pg.evaluate("Promise.all(['900 40px AR','800 40px AR','700 40px CV','400 30px IN','600 30px IN'].map(f=>document.fonts.load(f)))")
 T=pg.evaluate('T');el=pg.locator('#f')
 if stills:
  for i,t in enumerate(stills):pg.evaluate('t=>render(t)',t);el.screenshot(path=f'{out}-{i}.png')
 else:
  ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate','30','-i','-','-i','vo/voice.wav','-af','apad','-shortest','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',out],stdin=subprocess.PIPE)
  for i in range(int(T*30)):pg.evaluate('t=>render(t)',i/30);ff.stdin.write(el.screenshot(type='png'))
  ff.stdin.close();ff.wait()
 b.close()
print('T',T)
