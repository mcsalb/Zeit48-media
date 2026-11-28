import sys,http.server,threading,functools,os
from playwright.sync_api import sync_playwright
D=os.path.dirname(os.path.abspath(__file__))
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(http.server.SimpleHTTPRequestHandler,directory=D));threading.Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/google-chrome');pg=b.new_page(viewport={'width':2400,'height':1300})
 pg.on('pageerror',lambda e:print('ERR',e))
 pg.goto('http://127.0.0.1:8766/'+sys.argv[1]);pg.wait_for_function('window.ready');pg.evaluate("document.fonts.load('900 40px AR')");pg.wait_for_timeout(300)
 pg.locator('#f').screenshot(path=sys.argv[2]);b.close()
