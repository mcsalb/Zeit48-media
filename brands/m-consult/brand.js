const MLOGO='<svg viewBox="0 0 205 121"><polygon fill="#FF0000" points="17.5,58 51,58 68,88.5 51,119 17.5,119 0,88.5"/><polygon fill="#FF3131" points="51,0 85.5,0 136,89 118,119.5 86,119.5 34.5,29"/><polygon fill="#FF7171" points="118,1.5 154,1.5 204,89.5 186,119.5 155.5,119.5 102.5,30"/></svg>';
window.BRAND={name:'M-Consult',fonts:['700 50px CP','600 50px CP','400 30px IS','600 30px IS'],
 top:()=>`<span class="wm">${MLOGO}M-CONSULT <small>REYBEX-PARTNER</small></span>`,
 check:'<svg width="34" height="30" viewBox="0 0 24 24" fill="none" stroke="#FF3131" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
 ende:()=>`<div style="width:300px;margin:0 auto">${MLOGO.replace('<svg','<svg style="width:300px;height:177px"')}</div><div class="hook" style="font-size:104px;margin:60px 0 24px">Ein System.<br><em>Alles verbunden.</em></div><div class="label" style="font-size:30px">Kostenloses Erstgespräch · m-consult.tech</div>`,
 ring:'#FF3131'};
