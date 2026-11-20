// Gemeinsame Bausteine. q(i) liefert Sichtbarkeit 0..1 je Listenelement (statisch: immer 1).
const E=t=>1-Math.pow(1-Math.min(1,Math.max(0,t)),3);
function body(s,q=()=>1){
 let h='';
 const st=i=>{const v=q(i);return `opacity:${v};transform:translateY(${(1-v)*24}px)`};
 if(s.label)h+=`<div class="label" style="${st(-3)}">${s.label}</div>`;
 if(s.hook)h+=`<div class="hook" style="font-size:${s.hg||120}px;${st(-2)}">${s.hook}</div>`;
 if(s.text)h+=`<div class="text" style="${st(-1)}">${s.text}</div>`;
 if(s.vs)h+=s.vs.map((v,i)=>`<div class="vs ${v.gut?'gut':'schlecht'}" style="${st(i)}"><div class="label">${v.l}</div>${v.t}</div>`).join('');
 if(s.tl)h+=`<div class="tl">${s.tl.map((p,i)=>`<div class="p ${p.hot?'hot':''}" style="${st(i)}"><div class="y">${p.y}</div><div class="d">${p.d}</div></div>`).join('')}</div>`;
 if(s.ck)h+=`<div style="margin-top:40px">${s.ck.map((c,i)=>`<div class="ck" style="${st(i)}"><span class="b">${q(i)>.8?BRAND.check:''}</span><span>${c}</span></div>`).join('')}</div>`;
 if(s.x)h+=`<div style="margin-top:40px">${s.x.map((c,i)=>`<div class="x" style="${st(i)}"><span class="m">✕</span><span>${c}</span></div>`).join('')}</div>`;
 if(s.chips)h+=`<div style="margin-top:44px">${s.chips.map((c,i)=>`<span class="chip" style="${st(i)}"><i></i>${c}</span>`).join('')}</div>`;
 if(s.bild)h+=`<div class="bild" style="${st(0)}"><img src="${s.bild}"></div>`;
 if(s.rechnung){const e=s.rechnung;e.rows.forEach((r,i)=>{h+=`<div class="row" style="${st(i)}"><div>${r.t}${r.n?`<span class="n">${r.n}</span>`:''}</div><div class="v">${r.v}</div></div>`});const v=q(e.rows.length),d=q(e.rows.length+.5);h+=`<div class="sum" style="opacity:${v}"><span>${e.sumLabel}</span><span class="ring">${e.sum}<svg width="330" height="130"><ellipse cx="160" cy="62" rx="168" ry="62" fill="none" stroke="${BRAND.ring}" stroke-width="7" stroke-dasharray="${1100*d} 1100" transform="rotate(-3 160 62)"/></svg></span></div>`}
 if(s.note)h+=`<div class="note" style="${st(99)}">${s.note}</div>`;
 return h;
}
