window.overlay=(t,o)=>{const c=x=>Math.min(1,Math.max(0,x));let h='<div class="wm">CHEFSACHE<b>48</b></div>';
 if(o.bubble){const[a,b,txt,x,y]=o.bubble;if(t>=a&&t<b){const s=c((t-a)/.25),e=1-c((t-(b-.2))/.2);const k=1+.70158*Math.pow(s-1,2)*(2.70158*(s-1)+1)*0;h+=`<div class="bub" style="left:${x}px;top:${y}px;transform:scale(${(0.4+0.6*(1-Math.pow(1-s,3)))*e});opacity:${e}">${txt}</div>`}}
 for(const[a,b,txt]of o.sub||[])if(t>=a&&t<b){const s=c((t-a)/.2);h+=`<div class="sub" style="opacity:${s};transform:translateY(${(1-s)*20}px)"><span>${txt}</span></div>`}
 h+=`<div class="bar" style="width:${t/(o.T||6)*1080}px"></div>`;document.getElementById('ov').innerHTML=h};
