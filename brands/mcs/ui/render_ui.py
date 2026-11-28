#!/usr/bin/env python3
"""Rendert die MCS-Produkt-Mockups aus ui.html nach ../assets/ui-<id>.png (1680×1120). Aufruf: python3 brands/mcs/ui/render_ui.py"""
from pathlib import Path
from playwright.sync_api import sync_playwright
D=Path(__file__).resolve().parent
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files']);pg=b.new_page(viewport={'width':1700,'height':1200})
    pg.goto((D/'ui.html').as_uri());pg.evaluate('document.fonts.ready');pg.wait_for_timeout(500)
    for el in pg.locator('.m').all():
        i=el.get_attribute('id');p=D.parent/'assets'/f'ui-{i}.png';el.screenshot(path=str(p));print(p)
    b.close()
