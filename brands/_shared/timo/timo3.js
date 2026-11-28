// Timo v3 – Rig im Original-Look: Kopf, Hals/Kragen und Beine aus der Vorlage (vektorisiert),
// Pullover und Arme als Vektor-Rig im gleichen Stil. Koordinaten = Vorlage "Front" ×4 (Füße bei y≈3480, Mitte x≈613).
(function(){
const C={line:'#2A1D17',sw:'#302827',swL:'#463C39',swD:'#211B1A',cuff:'#FCEDE1',cuffS:'#DDC2AE',skin:'#F8B57E',skinS:'#E39A62',skinD:'#C9804F',skinL:'#FCCB9C',gold:'#E2AC36'};
const LW=5;
const rad=d=>d*Math.PI/180, r1=v=>Math.round(v*10)/10, f2=p=>r1(p[0])+' '+r1(p[1]);
const pt=(o,ang,len,s)=>[o[0]+s*Math.sin(rad(ang))*len,o[1]+Math.cos(rad(ang))*len];
function capsule(a,b,w0,w1){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
 const p0=[a[0]+nx*w0/2,a[1]+ny*w0/2],p1=[b[0]+nx*w1/2,b[1]+ny*w1/2],p2=[b[0]-nx*w1/2,b[1]-ny*w1/2],p3=[a[0]-nx*w0/2,a[1]-ny*w0/2];
 return `M${f2(p0)} L${f2(p1)} A${w1/2} ${w1/2} 0 0 0 ${f2(p2)} L${f2(p3)} A${w0/2} ${w0/2} 0 0 0 ${f2(p0)}Z`}
// Glied: erst Umrisse, dann Füllungen (keine Linien in Gelenken)
function limb(segs){let o='',f='';for(const s of segs){const d=capsule(s[0],s[1],s[2],s[3]);o+=`<path d="${d}" fill="${C.line}" stroke="${C.line}" stroke-width="${LW*2}" stroke-linejoin="round"/>`;f+=`<path d="${d}" fill="${s[4]}"/>`}return o+f}
// Linie entlang eines Segments mit seitlichem Versatz (für Licht/Schatten/Falten)
function along(a,b,off,w,col,op=1,t0=0,t1=1){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
 const p=t=>[a[0]+dx*t+nx*off,a[1]+dy*t+ny*off];return `<path d="M${f2(p(t0))} L${f2(p(t1))}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`}
// ---------- Hände (lokal: Handgelenk 0,0; Finger nach +y; Daumen links = Körperseite bei s=+1) ----------
// f=[Daumen,Zeige,Mittel,Ring,Klein] 0=eingerollt … 1=gestreckt
function hand(f){
 const fx=[-33,-11,11,32],fl=[88,96,90,72],fw=[25,26,25,22],fa=[-4,-1,2,6];
 let back='',front='';
 // Finger
 for(let i=3;i>=0;i--){const e=f[i+1];const L=fl[i]*(.28+.72*e);const b0=[fx[i],96],b1=[fx[i]+Math.sin(rad(fa[i]))*L,96+Math.cos(rad(fa[i]))*L];
  back+=limb([[b0,b1,fw[i],fw[i]*.9,C.skin]]);
  if(e>.5)back+=`<path d="M${f2([b0[0]-fw[i]*.25,b0[1]+L*.45])} q ${fw[i]*.25} 4 ${fw[i]*.5} 0" stroke="${C.skinD}" stroke-width="2.5" fill="none" opacity=".7"/>`;
  else back+=`<path d="M${f2([b1[0]-fw[i]*.42,b1[1]-2])} q ${fw[i]*.42} 9 ${fw[i]*.84} 0" stroke="${C.skinD}" stroke-width="3" fill="none"/>`}
 // Handfläche
 const palm='M-48 0 C-54 34 -56 72 -50 104 Q0 118 50 104 C56 72 54 34 46 0Z';
 front+=`<path d="${palm}" fill="${C.line}" stroke="${C.line}" stroke-width="${LW*2}" stroke-linejoin="round"/><path d="${palm}" fill="${C.skin}"/>`;
 front+=`<path d="M8 10 C30 30 40 64 38 100 L50 104 C56 72 54 34 46 0Z" fill="${C.skinS}" opacity=".55"/>`;
 if(f.slice(1).filter(x=>x<.4).length>=2)front+=`<path d="M-44 100 Q0 114 44 100" stroke="${C.skinD}" stroke-width="3.5" fill="none"/>`;
 // Daumen
 const t=f[0],ph=f[5]==null?45:f[5],tl=40+46*t;const t0=[-42,34],t1=[t0[0]-Math.sin(rad(ph))*tl,t0[1]+Math.cos(rad(ph))*tl];
 front+=limb([[t0,t1,30,25,C.skin]]);
 return back+front}
const HANDS={relax:[.5,.65,.7,.65,.6,30],offen:[1,1,1,1,1,58],zeig:[.3,1,.05,0,0,35],daumen:[1,0,0,0,0,6],faust:[.2,0,0,0,0,30],kinn:[.8,.85,.25,.15,.1,75]};
// ---------- Arm ----------
// s=-1 Bildschirm-links, +1 rechts; a1 Oberarm, a2 Unterarm (absolut: 0=unten, 90=außen, 180=oben, <0=quer vor den Körper)
function arm(s,o,a,watch){
 const UA=440,FA=370;
 const e=pt(o,a.a1,UA,s),w=pt(e,a.a2,FA,s),c0=pt(e,a.a2,70,s),c1=pt(e,a.a2,190,s);
 let h=limb([[o,e,182,160,C.sw],[e,c0,160,152,C.sw],[c1,w,108,92,C.skin],[c0,c1,148,140,C.cuff]]);
 h+=along(o,e,s*58,24,C.swD,.3,.15,.9)+along(o,e,-s*62,8,C.swL,.35,.2,.8);
 const fold=(p,len,ang)=>{const q=pt(p,ang,len,s);return `<path d="M${f2(p)} Q ${f2([(p[0]+q[0])/2+8,(p[1]+q[1])/2+10])} ${f2(q)}" stroke="${C.swL}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>`};
 h+=fold(pt(o,a.a1,UA*.55,s),60,a.a1+80)+fold(pt(o,a.a1,UA*.8,s),52,a.a1+95);
 { const m=pt(e,a.a2,132,s),dx=c1[0]-c0[0],dy=c1[1]-c0[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*72,ny=dx/l*72;
   h+=`<path d="M${f2([m[0]+nx,m[1]+ny])} L${f2([m[0]-nx,m[1]-ny])}" stroke="${C.cuffS}" stroke-width="6" stroke-linecap="round"/>`;
    }
 // Unterarm-Schatten
 h+=along(c1,w,s*30,16,C.skinS,.5,.42,.95);
 if(watch){const wp=pt(e,a.a2,FA-34,s);h+=`<g transform="translate(${f2(wp)}) rotate(${r1(-s*a.a2)})"><rect x="-52" y="-17" width="104" height="34" rx="9" fill="#3A2E28" stroke="${C.line}" stroke-width="4"/><circle r="31" fill="#F1F0EC" stroke="#8D8882" stroke-width="8"/><circle r="31" fill="none" stroke="${C.line}" stroke-width="3"/><path d="M0 0 L0 -17 M0 0 L11 5" stroke="#555" stroke-width="3"/></g>`}
 const hp=HANDS[a.h]||a.h||HANDS.relax;
 h+=`<g transform="translate(${f2(w)}) rotate(${r1(-s*(a.a2+(a.hr||0)))}) scale(${s*1.35},1.35)">${hand(hp)}</g>`;
 return h}
// ---------- Pullover ----------
function torso(br,sh){
 const S=sh*-26;
 const d=`M455 ${690+S} C380 ${700+S} 300 ${720+S} 245 ${762+S} C222 ${795+S} 220 860 232 930 C252 1110 282 1350 300 1522 L905 1522 C924 1350 958 1110 980 930 C992 860 990 ${800+S} 965 ${768+S} C910 ${726+S} 840 ${704+S} 770 ${690+S}Z`;
 let g=`<g transform="translate(0 1522) scale(1 ${1+br*.006}) translate(0 -1522)">`;
 g+=`<path d="${d}" fill="${C.sw}" stroke="${C.line}" stroke-width="${LW}" stroke-linejoin="round"/>`;
 g+=`<path d="M905 1522 C924 1350 958 1110 980 930 C992 860 990 800 965 768 C960 900 930 1150 880 1522Z" fill="${C.swD}" opacity=".85"/>`;
 g+=`<path d="M300 1522 C282 1350 252 1110 232 930 C228 900 230 860 240 830 C262 1000 286 1250 330 1522Z" fill="${C.swL}" opacity=".35"/>`;
 // Bündchen
 g+=`<path d="M298 1462 C450 1478 760 1478 908 1462 L905 1522 L300 1522Z" fill="${C.swD}" stroke="${C.line}" stroke-width="3"/>`;
 for(let x=315;x<900;x+=16)g+=`<path d="M${x} ${1470} L${x} 1518" stroke="${C.swL}" stroke-width="3" opacity=".5"/>`;
 // Falten
 g+=`<path d="M360 1300 C430 1330 500 1345 590 1345" stroke="${C.swL}" stroke-width="7" fill="none" opacity=".55" stroke-linecap="round"/><path d="M640 1380 C720 1385 790 1370 850 1340" stroke="${C.swL}" stroke-width="7" fill="none" opacity=".5" stroke-linecap="round"/><path d="M420 980 C470 1000 520 1010 570 1008" stroke="${C.swL}" stroke-width="6" fill="none" opacity=".45" stroke-linecap="round"/>`;
 g+=`<g transform="translate(728 892) skewX(-12)"><text font-family="AR" font-weight="900" font-size="88" letter-spacing="-3" fill="${C.gold}">48</text></g>`;
 return g+`</g>`}
const IMG=(n,x,y,w,h)=>`<image href="as/L_${n}.png" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const MOUTH=[613,402,.40];
window.timo3=(p)=>{
 const br=p.breath||0,sh=p.shrug||0;
 let g=`<ellipse cx="613" cy="3478" rx="380" ry="34" fill="#000" opacity=".14"/>`;
 g+=IMG('legs',134,1505,832,1992);
 g+=`<g transform="rotate(${r1(p.lean||0)} 613 1522)">`;
 const shL=[286,852+sh*-26],shR=[944,860+sh*-26];
 const A=p.armL||{a1:9,a2:4,h:'relax'},B=p.armR||{a1:9,a2:4,h:'relax'};
 const dA=()=>arm(-1,shL,A,0),dB=()=>arm(1,shR,B,1);
 if(A.back)g+=dA();if(B.back)g+=dB();
 g+=torso(br,sh);
 g+=`<g transform="translate(0 ${r1(sh*-22-br*4)})">`+IMG('neck',415,460,393,280);
 // Kopf
 const ny=(p.nod||0)*14;
 g+=`<g transform="translate(${r1(p.headX||0)} ${r1(ny)}) rotate(${r1(p.tilt||0)} 613 560)">`+IMG('head',426,58,352,533);
 // Mund (Lipsync-Patch aus M1–M8)
 if(p.mouth&&p.mouth!==0){const[mx,my,ms]=MOUTH;g+=`<image href="as/m${p.mouth}.png" x="${r1(mx-220*ms)}" y="${r1(my-100*ms*.85)}" width="${r1(440*ms)}" height="${r1(272*ms*.85)}"/>`}
 // Blinzeln
 const bl=1-(p.eye==null?1:p.eye),wk=p.wink||0;
 for(const [ex,ey,w] of [[548,300,0],[678,305,1]]){const b=Math.max(bl,w?wk:0);if(b<.05)continue;const bl2=b;const h=36*bl2;g+=`<path d="M${ex-34} ${ey-20} Q${ex} ${ey-34} ${ex+34} ${ey-20} L${ex+34} ${ey-20+h} Q${ex} ${ey-30+h*1.2} ${ex-34} ${ey-20+h}Z" fill="${C.skin}"/><path d="M${ex-34} ${ey-18+h} Q${ex} ${ey-28+h*1.25} ${ex+34} ${ey-18+h}" stroke="${C.line}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
 g+=`</g></g>`;
 if(!A.back)g+=dA();if(!B.back)g+=dB();
 g+=`</g>`;
 return g};
window.TIMO3=C;
})();
