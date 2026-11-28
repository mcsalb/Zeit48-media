import sys,numpy as np
from PIL import Image,ImageFilter
from scipy import ndimage
src,box,scale,out=sys.argv[1],tuple(map(int,sys.argv[2].split(','))),int(sys.argv[3]),sys.argv[4]
im=Image.open(src)
try: im.seek(0)
except: pass
im=im.convert('RGB').crop(box)
a=np.asarray(im).astype(int)
r,g,b=a[...,0],a[...,1],a[...,2]
lum=(r+g+b)/3;sat=a.max(2)-a.min(2)
light=(lum>232)&(sat<16)
gold=(b<110)&(r-b>105)&(g>140)&(r>185)
H0=a.shape[0];yy=np.arange(H0)[:,None]
shadow=(yy>H0*0.88)&(lum>140)&(lum<236)&(sat<48)
bgc=light|gold|shadow
lab,n=ndimage.label(bgc)
border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
mask=np.isin(lab,list(border))
# große Gold-/Hellflächen, die vom Rand abgeschnitten sind (z.B. zwischen Arm und Körper): nur wenn groß
sizes=ndimage.sum(np.ones_like(lab),lab,range(n+1))
for k in range(1,n+1):
  if k not in border and sizes[k]>400:
    ys,xs=np.where(lab==k)
    if sizes[k]>300 and gold[lab==k].mean()>.8: mask|=lab==k
topcut=float(sys.argv[6]) if len(sys.argv)>6 else 0
if topcut:
  ys=np.arange(a.shape[0])[:,None]*np.ones(a.shape[1])[None,:]
  mask|=light&(ys<a.shape[0]*topcut)
fg=~mask
fg=ndimage.binary_opening(fg,iterations=1);fg=ndimage.binary_fill_holes(fg) if False else fg
W,H=im.size
big=im.resize((W*scale,H*scale),Image.LANCZOS).filter(ImageFilter.MedianFilter(5))
m=Image.fromarray((fg*255).astype('uint8')).resize((W*scale,H*scale),Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
m=m.point(lambda v:255 if v>128 else 0).filter(ImageFilter.MinFilter(int(sys.argv[5]) if len(sys.argv)>5 else 7))
rgba=big.convert('RGBA');rgba.putalpha(m);rgba.save(out)
print(out,rgba.size)
