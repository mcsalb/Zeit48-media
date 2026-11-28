import sys,http.server,threading,functools,os
from PIL import Image
from playwright.sync_api import sync_playwright
D=os.path.dirname(os.path.abspath(__file__))
class Q(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8768),functools.partial(Q,directory=D));threading.Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/google-chrome')
 for n in sys.argv[1:]:
  w,h=Image.open(f'as/{n}.png').size
  pg=b.new_page(viewport={'width':w,'height':h})
  pg.set_content(f'<html><body style="margin:0;background:transparent"><img src="http://127.0.0.1:8768/as/{n}.svg" width="{w}" height="{h}" style="display:block"></body></html>')
  pg.wait_for_load_state('networkidle');pg.screenshot(path=f'as/{n}.r.png',omit_background=True);pg.close();print(n,w,h)
 b.close()
