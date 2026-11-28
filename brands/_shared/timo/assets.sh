set -e
G=src/38451fc3-image.png; E=src/b3b2b6fb-image.png
cut(){ python3 cut.py $1 $2 4 as/$3.png ${4:-7} ${5:-0} ${6:-0} >/dev/null && python3 trace.py as/$3.png as/$3.svg; echo $3; }
cut $G 40,125,310,695 p1 7 0 100 & cut $G 395,125,725,695 p2 7 0 100 & cut $G 40,755,365,1325 p4 7 0 100 & cut $G 395,755,665,1325 p5 7 0 100 & cut $G 750,755,1020,1325 p6 7 0 100 & wait
cut $E 45,150,360,520 e1 7 0.2 & cut $E 45,615,355,985 e4 7 0.2 & cut $E 745,615,1060,985 e6 7 0.2 & wait
