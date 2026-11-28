// Timo – 2.5D-Vektor-Rig. timo(p) liefert SVG-Markup. Ursprung = Mitte zwischen den Füßen, y nach unten.
(function(){
const P={skin:'#F4BC8E',skinS:'#E2A070',skinL:'#FAD2AE',hair:'#7C5434',hairS:'#5A3921',hairL:'#A8794A',
 sw:'#2B2522',swS:'#1D1917',swL:'#3E3632',col:'#F7F0E8',colS:'#DDD0C3',gold:'#D6A62C',pants:'#CFB79B',pantsS:'#B59D80',
 belt:'#2E231D',buck:'#C9C6C0',shoe:'#F5F1EB',shoeS:'#D8D0C5',line:'#2E1F17',iris:'#3B2618',mouth:'#6E2A22',tongue:'#D8706A',teeth:'#FFFFFF'};
const L=P.line, LW=5;
const rad=d=>d*Math.PI/180;
const pt=(o,ang,len,s)=>[o[0]+s*Math.sin(rad(ang))*len,o[1]+Math.cos(rad(ang))*len];
const r1=v=>Math.round(v*10)/10, f2=p=>r1(p[0])+' '+r1(p[1]);
// Kapsel mit Verjüngung (Kappen nach außen gewölbt)
function capsule(a,b,w0,w1){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
 const p0=[a[0]+nx*w0/2,a[1]+ny*w0/2],p1=[b[0]+nx*w1/2,b[1]+ny*w1/2],p2=[b[0]-nx*w1/2,b[1]-ny*w1/2],p3=[a[0]-nx*w0/2,a[1]-ny*w0/2];
 return `M${f2(p0)} L${f2(p1)} A${w1/2} ${w1/2} 0 0 0 ${f2(p2)} L${f2(p3)} A${w0/2} ${w0/2} 0 0 0 ${f2(p0)}Z`}
// Glied aus mehreren Segmenten: erst alle Umrisse, dann alle Füllungen -> keine Linien in Gelenken
function limb(segs,extra=''){let o='',f='';for(const s of segs){const d=capsule(s[0],s[1],s[2],s[3]);o+=`<path d="${d}" fill="${L}" stroke="${L}" stroke-width="${LW*2}" stroke-linejoin="round"/>`;f+=`<path d="${d}" fill="${s[4]}"/>`}return o+f+extra}
// Hand lokal: Handgelenk im Ursprung, Finger zeigen nach +y; f=[Daumen,Zeige,Mittel,Ring,Klein] 0..1
function hand(f){
 const segs=[];const fx=[-20,-7,7,20],fl=[50,56,53,44],fa=[-6,-2,2,7];
 for(let i=0;i<4;i++){const e=f[i+1],l=fl[i]*(.32+.68*e);segs.push([[fx[i],44],[fx[i]+Math.sin(rad(fa[i]))*l,44+Math.cos(rad(fa[i]))*l],17,15,P.skin])}
 const t=f[0];segs.push([[-24,14],[-30-24*t,34+8*(1-t)+(t>.8?-14:0)],19,16,P.skin]);
 segs.push([[0,8],[0,44],58,58,P.skin]);
 let h=limb(segs);
 if(f.slice(1).filter(x=>x<.35).length>=2)h+=`<path d="M-24 62 Q0 72 24 62" fill="none" stroke="${P.skinS}" stroke-width="5" stroke-linecap="round"/>`;
 return h}
const HANDS={relax:[.55,.75,.8,.75,.7],offen:[1,1,1,1,1],zeig:[.25,1,.05,0,0],daumen:[1,0,0,0,0],faust:[.2,0,0,0,0],kinn:[.7,.9,.3,.2,.15]};
// Arm: s=-1 Bildschirm-links, +1 rechts. a1 Oberarm, a2 Unterarm (absolut; 0=unten, 90=außen, 180=oben, negativ=quer vor den Körper)
function arm(s,o,a,watch){
 const e=pt(o,a.a1,265,s),w=pt(e,a.a2,235,s),c=pt(e,a.a2,62,s),c2=pt(e,a.a2,96,s);
 let h=limb([[o,e,104,88,P.sw],[e,c,90,86,P.sw],[c,c2,88,84,P.col],[c2,w,62,54,P.skin]]);
 h+=`<path d="${capsule(o,e,104,88)}" fill="${P.swS}" opacity=".0"/>`;
 if(watch){const wp=pt(e,a.a2,200,s);h+=`<g transform="translate(${f2(wp)}) rotate(${r1(-s*a.a2)})"><rect x="-33" y="-12" width="66" height="24" rx="7" fill="#2B221D" stroke="${L}" stroke-width="3"/><circle r="18" fill="#EEEDEA" stroke="#77716A" stroke-width="5"/></g>`}
 const hp=HANDS[a.h]||a.h||HANDS.relax;
 h+=`<g transform="translate(${f2(w)}) rotate(${r1(-s*(a.a2+(a.hr||0)))}) scale(${s*1.12},1.12)">${hand(hp)}</g>`;
 return h}
const MOUTH={
 1:`<path d="M-30 0 Q0 14 32 -4" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round"/>`,
 2:`<path d="M-28 -2 Q0 4 30 -4 Q2 16 -28 -2Z" fill="${P.mouth}" stroke="${L}" stroke-width="4" stroke-linejoin="round"/>`,
 3:`<path d="M-32 -4 Q0 0 34 -6 Q4 30 -32 -4Z" fill="${P.mouth}" stroke="${L}" stroke-width="4" stroke-linejoin="round"/><path d="M-26 -3 Q0 1 28 -5 L24 4 Q0 8 -22 4Z" fill="${P.teeth}"/>`,
 4:`<path d="M-36 -8 Q0 -2 38 -10 Q10 50 -36 -8Z" fill="${P.mouth}" stroke="${L}" stroke-width="4" stroke-linejoin="round"/><path d="M-30 -6 Q0 -1 32 -8 L28 2 Q0 6 -26 2Z" fill="${P.teeth}"/><path d="M-14 22 Q4 12 18 20 Q4 32 -14 22Z" fill="${P.tongue}"/>`,
 5:`<ellipse cx="0" cy="6" rx="16" ry="20" fill="${P.mouth}" stroke="${L}" stroke-width="4"/><path d="M-8 18 Q0 12 8 18 Q0 24 -8 18Z" fill="${P.tongue}"/>`,
 6:`<ellipse cx="0" cy="4" rx="10" ry="11" fill="${P.mouth}" stroke="${L}" stroke-width="4"/>`,
 7:`<path d="M-30 -6 Q0 -2 30 -6 Q28 14 0 16 Q-28 14 -30 -6Z" fill="${P.teeth}" stroke="${L}" stroke-width="4" stroke-linejoin="round"/><path d="M-26 5 L26 5" stroke="#BDB3AA" stroke-width="2"/>`,
 8:`<path d="M-30 2 Q-4 12 34 -10" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round"/><path d="M28 -12 Q36 -8 34 -2" fill="none" stroke="${L}" stroke-width="3"/>`};
function head(p){
 const tn=p.turn||0, fx=tn*14;
 const ex=p.eyeX||0, ey=p.eyeY||0, op=p.eye==null?1:p.eye, sq=p.happy||0, wink=p.wink||0;
 const br=p.brow||0, bt=p.browTilt||0;
 let h='';
 // Hinterkopf
 h+=`<path d="M-112 -20 Q-128 -150 -30 -192 Q70 -210 120 -140 Q132 -80 112 -20Z" fill="${P.hairS}" stroke="${L}" stroke-width="${LW}"/>`;
 for(const s of [-1,1])h+=`<path d="M${s*102+fx*.4} -22 Q${s*136+fx*.6} -34 ${s*130+fx*.6} 10 Q${s*124+fx*.6} 46 ${s*96+fx*.4} 44Z" fill="${P.skin}" stroke="${L}" stroke-width="${LW}"/><path d="M${s*108+fx*.4} -4 Q${s*122+fx*.6} 0 ${s*112+fx*.6} 24" fill="none" stroke="${P.skinS}" stroke-width="5"/>`;
 // Gesicht (Stirn reicht unter die Haare)
 h+=`<path d="M-106 -150 L-110 -60 C-116 20 -108 70 -74 108 Q-36 140 ${4+fx*.3} 142 Q42 140 78 108 C110 70 116 20 110 -60 L106 -150Z" fill="${P.skin}" stroke="${L}" stroke-width="${LW}" stroke-linejoin="round"/>`;
 h+=`<path d="M64 -70 C98 -20 100 50 72 102 Q92 50 90 -10Z" fill="${P.skinS}" opacity=".5"/>`;
 // Bartschatten
 h+=`<path d="M-94 30 Q-84 96 -40 124 Q0 146 44 124 Q86 96 94 30 Q84 104 44 116 Q0 132 -44 116 Q-84 104 -94 30Z" fill="#8A5A3A" opacity=".26"/>`;
 h+=`<path d="M${-32+fx} 70 Q${fx} 60 ${32+fx} 70 Q${16+fx} 82 ${fx} 80 Q${-16+fx} 82 ${-32+fx} 70Z" fill="#8A5A3A" opacity=".24"/>`;
 h+=`<path d="M${-17+fx} 110 Q${fx} 124 ${17+fx} 110 Q${11+fx} 134 ${fx} 137 Q${-11+fx} 134 ${-17+fx} 110Z" fill="#7A4C30" opacity=".4"/>`;
 // Augen
 for(const s of [-1,1]){const cx=s*44+fx,cy=-4;const o=(s>0&&wink)?Math.max(0,op*(1-wink)):op;
  if(sq>.5||(s>0&&wink>.8)){h+=`<path d="M${cx-22} ${cy+6} Q${cx} ${cy-14} ${cx+22} ${cy+6}" fill="none" stroke="${L}" stroke-width="7" stroke-linecap="round"/>`;continue}
  const ry=22*o;
  h+=`<ellipse cx="${cx}" cy="${cy}" rx="21" ry="${r1(Math.max(1,ry))}" fill="#fff"/>`;
  if(o>.2)h+=`<ellipse cx="${r1(cx+ex*6)}" cy="${r1(cy+3+ey*5)}" rx="14" ry="${r1(Math.min(18,18*o))}" fill="${P.iris}"/><circle cx="${r1(cx+ex*6+5)}" cy="${r1(cy-4+ey*5)}" r="${r1(5*o)}" fill="#fff"/>`;
  h+=`<path d="M${cx-26} ${r1(cy-ry*.5+2)} Q${cx} ${r1(cy-ry-8)} ${cx+26} ${r1(cy-ry*.5)}" fill="none" stroke="${L}" stroke-width="8" stroke-linecap="round"/>`;
  h+=`<path d="M${cx-14} ${r1(cy+ry*.9)} Q${cx} ${r1(cy+ry+2)} ${cx+14} ${r1(cy+ry*.9)}" fill="none" stroke="${P.skinS}" stroke-width="3"/>`;
 }
 for(const s of [-1,1]){const cx=s*46+fx,cy=-52-br*14;const tilt=bt*s*12;
  h+=`<path d="M${cx-30} ${cy+8} Q${cx-4} ${cy-12} ${cx+30} ${cy+2}" transform="rotate(${r1(tilt)} ${cx} ${cy}) ${s<0?`translate(${2*cx} 0) scale(-1 1)`:''}" fill="none" stroke="${P.hairS}" stroke-width="14" stroke-linecap="round"/>`}
 h+=`<path d="M${6+fx*1.3} 6 Q${17+fx*1.3} 34 ${11+fx*1.3} 44 Q${2+fx} 49 ${-9+fx} 44" fill="none" stroke="${P.skinS}" stroke-width="5" stroke-linecap="round"/>`;
 if(p.blush)h+=`<ellipse cx="${-68+fx}" cy="42" rx="20" ry="10" fill="#F08F78" opacity="${r1(.4*p.blush)}"/><ellipse cx="${68+fx}" cy="42" rx="20" ry="10" fill="#F08F78" opacity="${r1(.4*p.blush)}"/>`;
 h+=`<g transform="translate(${r1(2+fx*1.1)} 88)">${MOUTH[p.mouth||1]}</g>`;
 // Vordere Haare: Tolle nach rechts oben
 h+=`<path d="M-112 -30 Q-122 -112 -86 -160 Q-40 -222 40 -232 Q120 -238 146 -178 Q156 -140 128 -128 Q132 -96 112 -30 Q108 -84 84 -108 Q90 -84 78 -66 Q56 -112 -6 -118 Q-62 -118 -94 -84 Q-104 -60 -112 -30Z" fill="${P.hair}" stroke="${L}" stroke-width="${LW}" stroke-linejoin="round"/>`;
 h+=`<path d="M-66 -150 Q0 -214 110 -200" fill="none" stroke="${P.hairL}" stroke-width="11" stroke-linecap="round"/><path d="M-40 -178 Q30 -222 120 -210" fill="none" stroke="${P.hairL}" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
 h+=`<path d="M-84 -112 Q-30 -164 50 -156" fill="none" stroke="${P.hairS}" stroke-width="6" stroke-linecap="round"/><path d="M30 -124 Q86 -160 126 -132" fill="none" stroke="${P.hairS}" stroke-width="6" stroke-linecap="round"/>`;
 return h}
function leg(s,hp,a){const k=pt(hp,a,390,s),an=pt(k,a*.3,380,s);
 let g=limb([[hp,k,156,124,P.pants],[k,an,124,108,P.pants]]);
 g+=`<path d="M${f2([hp[0]+s*20,hp[1]+60])} L${f2([an[0]+s*6,an[1]-40])}" stroke="${P.pantsS}" stroke-width="4" opacity=".8"/>`;
 g+=`<g transform="translate(${f2(an)}) scale(${s},1)"><path d="M-58 8 Q-62 -26 -24 -28 L26 -26 Q60 -10 92 20 Q96 46 64 48 L-52 48 Q-66 40 -58 8Z" fill="${P.shoe}" stroke="${L}" stroke-width="${LW}" stroke-linejoin="round"/><path d="M-56 34 L86 34" stroke="${P.shoeS}" stroke-width="8"/></g>`;
 return g}
window.timo=(p)=>{
 const br=p.breath||0, sh=p.shrug||0;
 const hipY=-860, shY=-1390+sh*-24;
 let g=`<ellipse cx="0" cy="44" rx="270" ry="26" fill="#000" opacity=".13"/>`;
 g+=leg(-1,[-82,hipY+30],p.legL==null?4:p.legL)+leg(1,[82,hipY+30],p.legR==null?4:p.legR);
 g+=`<g transform="rotate(${r1(p.lean||0)} 0 ${hipY}) translate(0 ${r1(-br*6)})">`;
 g+=`<path d="M-184 ${hipY-12} L184 ${hipY-12} L186 ${hipY+30} L-186 ${hipY+30}Z" fill="${P.belt}" stroke="${L}" stroke-width="${LW}"/><rect x="-36" y="${hipY-8}" width="72" height="34" rx="5" fill="none" stroke="${P.buck}" stroke-width="7"/>`;
 const shL=[-168,shY+44],shR=[168,shY+44];
 const A=p.armL||{a1:6,a2:2,h:'relax'},B=p.armR||{a1:6,a2:2,h:'relax'};
 const dA=()=>arm(-1,shL,A,1),dB=()=>arm(1,shR,B,0);
 if(A.back)g+=dA();if(B.back)g+=dB();
 const S=shY;
 const torso=`M-78 ${S-56} C-140 ${S-50} -192 ${S-30} -202 ${S+40} C-214 ${S+170} -206 ${hipY-160} -190 ${hipY} L190 ${hipY} C206 ${hipY-160} 214 ${S+170} 202 ${S+40} C192 ${S-30} 140 ${S-50} 78 ${S-56} Q0 ${S-36} -78 ${S-56}Z`;
 g+=`<g transform="translate(0 ${hipY}) scale(1 ${1+br*.006}) translate(0 ${-hipY})"><path d="${torso}" fill="${P.sw}" stroke="${L}" stroke-width="${LW}" stroke-linejoin="round"/>`;
 g+=`<path d="M150 ${S+10} C198 ${S+170} 196 ${hipY-150} 176 ${hipY} L190 ${hipY} C206 ${hipY-160} 214 ${S+170} 202 ${S+40}Z" fill="${P.swS}"/>`;
 g+=`<path d="M-176 ${hipY-36} Q0 ${hipY-18} 176 ${hipY-36}" stroke="${P.swL}" stroke-width="6" fill="none"/>`;
 // Hals, Kragen, V
 g+=`<path d="M-48 ${S-150} L-50 ${S-40} L50 ${S-40} L48 ${S-150}Z" fill="${P.skinS}" stroke="${L}" stroke-width="${LW}"/>`;
 g+=`<path d="M-80 ${S-56} L0 ${S+110} L80 ${S-56} Q0 ${S-30} -80 ${S-56}Z" fill="${P.col}" stroke="${L}" stroke-width="${LW}" stroke-linejoin="round"/>`;
 g+=`<path d="M-54 ${S-74} L-94 ${S-12} L-20 ${S+34} L0 ${S-8}Z" fill="${P.col}" stroke="${L}" stroke-width="${LW}" stroke-linejoin="round"/><path d="M54 ${S-74} L94 ${S-12} L20 ${S+34} L0 ${S-8}Z" fill="${P.col}" stroke="${L}" stroke-width="${LW}" stroke-linejoin="round"/>`;
 g+=`<path d="M-96 ${S-50} L0 ${S+146} L96 ${S-50}" fill="none" stroke="${P.swL}" stroke-width="11" stroke-linejoin="round"/>`;
 g+=`<g transform="translate(54 ${S+168}) skewX(-10)"><text font-family="AR" font-weight="900" font-size="64" fill="${P.gold}">48</text></g></g>`;
 const hy=S-236+(p.nod||0)*16;
 g+=`<g transform="translate(${r1(p.headX||0)} ${r1(hy)}) rotate(${r1(p.tilt||0)} 0 130)">${head(p)}</g>`;
 if(!A.back)g+=dA();if(!B.back)g+=dB();
 g+=`</g>`;
 return g};
window.TIMO_PAL=P;
})();
