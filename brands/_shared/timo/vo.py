import json,subprocess,wave,numpy as np,sys
lines=json.load(open('lines.json'));SR=22050;gap=0.35;pre=0.25
parts=[];t=pre;segs=[]
for i,l in enumerate(lines):
  f=f'vo/l{i}.wav';subprocess.run(['espeak-ng','-v','mb-de6','-s','172','-p','45','-w',f,l],check=True)
  w=wave.open(f);sr=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)
  if sr!=SR:raise SystemExit(sr)
  # Stille an den Rändern trimmen
  nz=np.where(np.abs(a)>300)[0];a=a[nz[0]:nz[-1]+1]
  segs.append({'i':i,'t0':round(t,3),'t1':round(t+len(a)/SR,3)});parts.append(a);t+=len(a)/SR+gap
total=t+0.1
out=np.zeros(int(total*SR),dtype=np.float32)
for s,a in zip(segs,parts):k=int(s['t0']*SR);out[k:k+len(a)]+=a
out=np.clip(out*1.1,-32767,32767).astype(np.int16)
w=wave.open('vo/voice.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(out.tobytes());w.close()
# Lipsync: pro Frame (30 fps) RMS + Nulldurchgangsrate
x=out.astype(np.float32)/32768;fps=30;n=int(total*fps);hop=SR//fps;mouth=[]
for k in range(n):
  c=x[k*hop:(k+1)*hop+hop//2]
  if len(c)==0:mouth.append(1);continue
  r=float(np.sqrt(np.mean(c*c)));z=float(np.mean(np.abs(np.diff(np.sign(c))))/2)
  if r<.012:m=1
  elif r<.04:m=2 if z<.25 else 7
  elif r<.09:m=3 if z<.15 else (7 if z>.3 else 6 if k%5==0 else 3)
  else:m=4 if z<.12 else 5 if k%3==0 else 3
  mouth.append(m)
# kurze Flackerer glätten
for k in range(1,n-1):
  if mouth[k-1]==mouth[k+1]!=mouth[k]:mouth[k]=mouth[k-1]
json.dump({'segs':segs,'T':round(total,2),'mouth':mouth},open('vo/sync.json','w'))
print(segs,round(total,2))
