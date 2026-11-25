"""Stilvarianten 9, 10 und 14: Stickerei, 3D-Miniatur, Mosaik. Die Seiten rechnen das Bild selbst (Canvas, WebGL)."""
import json
from vlib import *


def basis(bunt=True):
    """Flache Grundszene in wenigen Farben, Vorlage fuer Stickerei und Mosaik."""
    r = random.Random(12)
    z = rect(0, 0, 400, 600, '#2f6b4f')
    for _ in range(40):
        z += pfad(fleck(r.uniform(0, 400), r.uniform(0, 600), r.uniform(20, 50), r.uniform(10, 26), r), r.choice(['#28604a', '#3a7a55', '#2b6a58']))
    # Mauer und Tor oben
    z += rect(0, 40, 400, 46, '#d9cdb4') + ''.join(rect(i * 26 - (10 if j % 2 else 0), 42 + j * 15, 24, 12, ['#cabda0', '#e3d9c4'][(i + j) % 2]) for j in range(3) for i in range(18))
    z += rect(158, 10, 84, 76, '#e3d9c4') + poly([(148, 14), (200, -22), (252, 14)], '#b5533c') + pfad('M176,86L176,52A24,24 0 0 1 224,52L224,86Z', '#6b4a33') + ell(200, 22, 7, 7, '#d4af37')
    bach = schlange([(352, 640), (352, 600), (330, 440), (366, 290), (340, 120), (352, 80)])
    z += pfad(kurve_d(bach), 'none', '#28605c', 46) + pfad(kurve_d(bach), 'none', '#4f93b8', 34) + pfad(kurve_d(bach), 'none', '#8fc3d8', 6, ' stroke-dasharray="26 22"')
    z += pfad(kurve_d(WEG), 'none', '#b98f5f', 58) + pfad(kurve_d(WEG), 'none', '#e8cf9c', 46)
    for x, y, dx, dy in WP[::8]:
        z += ell(x + r.uniform(-14, 14), y, 4, 3, '#d3b57c')
    def baum(x, y, frucht):
        return rect(x - 6, y - 34, 12, 36, '#7a4f30') + ell(x, y - 66, 42, 40, '#1f5a3a') + ell(x - 6, y - 72, 32, 28, '#4f8f4a') + ell(x - 12, y - 80, 18, 14, '#83b35c') + ''.join(ell(x + a, y - 66 + b, 6, 6, frucht) for a, b in [(-22, -4), (14, -20), (22, 8), (-4, 14), (-10, -26)])
    z += baum(60, 240, '#cf4037') + baum(304, 262, '#e8a23c') + baum(40, 400, '#cf4037')
    z += rect(30, 440, 122, 84, '#8a5a36') + rect(38, 448, 106, 68, '#54351f') + ''.join(rect(42, 454 + k * 13, 98, 6, '#6f4a2e') for k in range(5))
    for k in range(5):
        z += ell(52 + k * 19, 456, 7, 7, '#8fbf5a') + ell(52 + k * 19, 456, 3, 3, '#d4e6a0')
    for x, y in streu(r, 90, lambda x, y: y > 100 and wegabstand(x, y) > 40 and abs(x - 350) > 36 and not (20 < x < 162 and 430 < y < 534) and all(math.hypot(x - a, y - b) > 54 for a, b in [(60, 178), (304, 200), (40, 338)]), 26):
        c = r.choice(['#f4efe0', '#e8b23c', '#d9626e', '#8f83cf', '#f2c9c0'])
        z += rect(x - 2, y, 4, 12, '#5f9a4c') + ''.join(ell(x + a, y + b, 4.4, 4.4, c) for a, b in [(-5, 0), (5, 0), (0, -5), (0, 5)]) + ell(x, y, 3, 3, '#f6d35a' if c != '#e8b23c' else '#9c5a1f')
    for i, (x, y) in enumerate(STATIONEN):
        z += ell(x, y, 34, 34, '#7d735f') + ell(x, y, 29, 29, ['#d9cdb4', '#fff3c4', '#a9a08a'][i])
        if i == 0:
            z += ''.join(drehung(x, y, k * 60, ell(0, -15, 8, 12, '#d4af37')) for k in range(6)) + ell(x, y, 8, 8, '#b5533c')
        elif i == 1:
            z += ell(x, y, 29, 29, '#d4af37') + ell(x, y, 19, 19, '#fff8e2') + ell(x, y, 8, 8, '#b5533c')
        else:
            z += ell(x, y, 12, 12, '#8d846e')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">{z}</svg>'


def leinwandseite(nr, name, titel, js, grund):
    html = f'''<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>{titel}</title>
<style>html,body{{margin:0;height:100%;background:{grund}}}body{{display:grid;place-items:center;overflow:hidden}}canvas{{display:block;width:min(100vw,calc(100vh*400/600));height:auto;aspect-ratio:400/600}}</style></head>
<body><canvas width="1000" height="1500" role="img" aria-label="{titel}"></canvas><script>window.fertig=false;
{js}
</script></body></html>
'''
    open(os.path.join(ZIEL, f'{nr}-{name}.html'), 'w', encoding='utf-8', newline='\n').write(html)
    print(f'{nr}-{name}', len(html.encode()) // 1024, 'KB')


LADE = '''
const C=document.querySelector('canvas'),X=C.getContext('2d');
let s=7;const R=()=>{s=(s*16807)%2147483647;return s/2147483647};
const bild=new Image();
const zufall=(a,b)=>a+(b-a)*R();
const hex=(r,g,b)=>`rgb(${Math.max(0,Math.min(255,r|0))},${Math.max(0,Math.min(255,g|0))},${Math.max(0,Math.min(255,b|0))})`;
'''


def stickerei():
    js = LADE + 'bild.src="data:image/svg+xml;utf8,"+encodeURIComponent(' + json.dumps(basis()) + ''');
bild.onload=()=>{
 const N=100,M=150,k=document.createElement('canvas');k.width=N;k.height=M;const kx=k.getContext('2d',{willReadFrequently:true});kx.drawImage(bild,0,0,N,M);const d=kx.getImageData(0,0,N,M).data;
 const p=10;
 // Leinen
 X.fillStyle='#ece2cc';X.fillRect(0,0,1000,1500);
 for(let y=0;y<1500;y+=2.5){X.fillStyle=`rgba(120,100,70,${zufall(.03,.13)})`;X.fillRect(0,y,1000,1.2)}
 for(let x=0;x<1000;x+=2.5){X.fillStyle=`rgba(255,250,235,${zufall(.03,.2)})`;X.fillRect(x,0,1.2,1500)}
 for(let y=0;y<M;y++)for(let x=0;x<N;x++){X.fillStyle='rgba(90,70,40,.20)';X.fillRect(x*p-.9,y*p-.9,1.8,1.8)}
 const farbe=(x,y)=>{const i=(y*N+x)*4;return[d[i],d[i+1],d[i+2]]};
 const stufe=v=>Math.round(v/22)*22;
 const faden=(x0,y0,x1,y1,c,hell)=>{X.lineCap='round';X.strokeStyle=hex(c[0]*.55,c[1]*.55,c[2]*.55);X.lineWidth=5;X.beginPath();X.moveTo(x0+.8,y0+1.1);X.lineTo(x1+.8,y1+1.1);X.stroke();
  X.strokeStyle=hex(c[0]*hell,c[1]*hell,c[2]*hell);X.lineWidth=4;X.beginPath();X.moveTo(x0,y0);X.lineTo(x1,y1);X.stroke();
  X.strokeStyle=`rgba(255,255,255,.24)`;X.lineWidth=1;X.beginPath();X.moveTo(x0+.6,y0-.8);X.lineTo(x1+.6,y1-.8);X.stroke()};
 const grenze=x=>54+5*Math.sin(x/9)+3*Math.sin(x/3.1);
 for(let y=0;y<M;y++)for(let x=0;x<N;x++){
  const [r0,g0,b0]=farbe(x,y);
  if(y<grenze(x)){ // noch nicht gestickt: Vorzeichnung
   const n=farbe(Math.min(N-1,x+1),y),u=farbe(x,Math.min(M-1,y+1));const diff=Math.abs(r0-n[0])+Math.abs(g0-n[1])+Math.abs(b0-n[2])+Math.abs(r0-u[0])+Math.abs(g0-u[1])+Math.abs(b0-u[2]);
   if(diff>96){X.strokeStyle='rgba(58,88,140,.62)';X.lineWidth=1.6;X.beginPath();X.moveTo(x*p+2.4,y*p+2.4);X.lineTo(x*p+7.6,y*p+7.6);X.moveTo(x*p+7.6,y*p+2.4);X.lineTo(x*p+2.4,y*p+7.6);X.stroke()}
   continue}
  const h=zufall(.92,1.08),c=[stufe(r0),stufe(g0),stufe(b0)];
  faden(x*p+1.2,y*p+8.8,x*p+8.8,y*p+1.2,c,h*.94);faden(x*p+1.2,y*p+1.2,x*p+8.8,y*p+8.8,c,h*1.04)}
 // Nadel mit Faden: die eigene Position
 X.save();X.translate(300,800);X.shadowColor='rgba(0,0,0,.45)';X.shadowBlur=9;X.shadowOffsetX=5;X.shadowOffsetY=7;
 X.strokeStyle='#d4af37';X.lineWidth=5.5;X.lineCap='round';X.beginPath();X.moveTo(40,26);X.bezierCurveTo(150,-60,250,70,330,-30);X.stroke();X.strokeStyle='#f4dd8c';X.lineWidth=1.8;X.stroke();
 X.rotate(-.62);const gr=X.createLinearGradient(0,-5,0,5);gr.addColorStop(0,'#f6f8fa');gr.addColorStop(.5,'#b3bcc4');gr.addColorStop(1,'#6f7a84');X.fillStyle=gr;X.beginPath();X.moveTo(-120,0);X.quadraticCurveTo(-30,-5.4,34,-5);X.quadraticCurveTo(48,0,34,5);X.quadraticCurveTo(-30,5.4,-120,0);X.fill();X.shadowColor='transparent';X.fillStyle='#4b545c';X.beginPath();X.ellipse(27,0,10,2.2,0,0,7);X.fill();X.restore();
 window.fertig=true};
'''
    leinwandseite('09', 'stickerei', 'Stickerei', js, '#b9ab8c')


def mosaik():
    js = LADE + 'bild.src="data:image/svg+xml;utf8,"+encodeURIComponent(' + json.dumps(basis()) + ''');
bild.onload=()=>{
 const k=document.createElement('canvas');k.width=400;k.height=600;const kx=k.getContext('2d',{willReadFrequently:true});kx.drawImage(bild,0,0);const d=kx.getImageData(0,0,400,600).data;
 X.scale(2.5,2.5);
 // Moertel
 X.fillStyle='#8d8371';X.fillRect(0,0,400,600);for(let i=0;i<26000;i++){X.fillStyle=`rgba(${R()<.5?'40,34,26':'235,225,205'},${zufall(.04,.16)})`;X.fillRect(R()*400,R()*600,zufall(.4,1.6),zufall(.4,1.6))}
 const f=(x,y)=>{x=Math.max(0,Math.min(399,x|0));y=Math.max(0,Math.min(599,y|0));const i=(y*400+x)*4;return[d[i],d[i+1],d[i+2]]};
 // Richtung: entlang der Farbkanten (Strukturrichtung)
 const winkel=(x,y)=>{let gx=0,gy=0;for(const q of [3,6,9]){const a=f(x+q,y),b=f(x-q,y),c=f(x,y+q),e=f(x,y-q);const l=v=>v[0]*.3+v[1]*.6+v[2]*.1;gx+=l(a)-l(b);gy+=l(c)-l(e)}return Math.hypot(gx,gy)>14?Math.atan2(gy,gx)+Math.PI/2:Math.sin(x/47)*.35+Math.cos(y/53)*.35};
 const belegt=new Uint8Array(400*600);
 const stein=(x,y,w,g,c,gold)=>{X.save();X.translate(x,y);X.rotate(w);const a=g/2;const p=[[-a,-a],[a,-a],[a,a],[-a,a]].map(([u,v])=>[u+zufall(-.7,.7),v+zufall(-.7,.7)]);
  const pf=()=>{X.beginPath();p.forEach(([u,v],i)=>i?X.lineTo(u,v):X.moveTo(u,v));X.closePath()};
  X.save();X.translate(.7,.9);pf();X.fillStyle='rgba(30,24,18,.55)';X.fill();X.restore();
  pf();const h=zufall(.84,1.16);if(gold){const gr=X.createLinearGradient(-a,-a,a,a);const t=R();gr.addColorStop(0,t<.4?'#fff0a8':'#d9a92f');gr.addColorStop(1,t<.4?'#d9a92f':'#9c7418');X.fillStyle=gr}else X.fillStyle=hex(c[0]*h+zufall(-8,8),c[1]*h+zufall(-8,8),c[2]*h+zufall(-8,8));X.fill();
  X.strokeStyle='rgba(255,255,255,.28)';X.lineWidth=.6;X.beginPath();X.moveTo(...p[3]);X.lineTo(...p[0]);X.lineTo(...p[1]);X.stroke();X.restore()};
 const grenze=x=>206+18*Math.sin(x/38)+9*Math.sin(x/13);
 const dichte=y=>Math.max(0,Math.min(1,1));
 // Vorzeichnung oben (Roetel)
 X.save();X.beginPath();X.rect(0,0,400,250);X.clip();for(let y=0;y<250;y+=1.2)for(let x=0;x<400;x+=1.2){const a=f(x,y),b=f(x+3,y),c=f(x,y+3);const di=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])+Math.abs(a[0]-c[0])+Math.abs(a[1]-c[1])+Math.abs(a[2]-c[2]);if(di>110&&R()<.5){X.fillStyle='rgba(150,62,38,.5)';X.fillRect(x,y,1.3,1.3)}}X.restore();
 const g=7.6;const ps=[];
 for(let y=-4;y<606;y+=g)for(let x=-4+((y/g|0)%2)*g/2;x<406;x+=g)ps.push([x+zufall(-.9,.9),y+zufall(-.9,.9)]);
 for(const [x,y] of ps){const gr=grenze(x);let wahrsch=y>gr+26?1:y>gr?.82:y>gr-30?.3:.03;if(R()>wahrsch)continue;
  let c=f(x,y);const gold=c[0]>195&&c[1]>155&&c[1]<200&&c[2]<90;stein(x,y,winkel(x,y)+zufall(-.12,.12),g-1.35,c,gold)}
 // Pfau als Position: eigene Steinchen
 const vogel=[];const V=(x,y,c)=>vogel.push([x,y,c]);
 for(let i=0;i<9;i++)for(let j=0;j<4;j++){const w=2.2+i*.15,q=22+j*9;V(182+Math.cos(w)*q*1.1,372+Math.sin(w)*q*.55+10,j==3?[40,120,170]:j==2?[60,160,110]:[50,130,90])}
 for(let i=0;i<14;i++)for(let j=0;j<9;j++){const u=(i-6.5)/6.5,v=(j-4)/4;if(u*u+v*v<1)V(184+u*15,366+v*10,[38,92,170])}
 for(let i=0;i<7;i++)V(196+i*.9,358-i*4.4,[44,104,184]);for(let i=0;i<6;i++){V(202+(i%3)*4.4,324+(i/3|0)*4.4,[44,104,184])}
 V(216,326,[230,170,60]);V(206,316,[230,190,70]);V(202,315,[230,190,70]);
 for(const [x,y,c] of vogel)stein(x,y,zufall(-.3,.3),4.6,c,false);
 // Licht
 const l=X.createRadialGradient(120,90,20,200,300,460);l.addColorStop(0,'rgba(255,246,220,.22)');l.addColorStop(1,'rgba(20,14,10,.28)');X.fillStyle=l;X.fillRect(0,0,400,600);
 window.fertig=true};
'''
    leinwandseite('14', 'mosaik', 'Mosaik', js, '#4a4438')


GLSL = r'''
precision highp float;
uniform vec2 aufl; uniform vec2 versatz;
#define PI 3.14159265
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float rauschen(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float kasten(vec3 p,vec3 b,float r){vec3 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float zyl(vec3 p,float r,float h,float e){vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h)+e;return min(max(d.x,d.y),0.)+length(max(d,0.))-e;}
float torus(vec3 p,float R,float r){return length(vec2(length(p.xz)-R,p.y))-r;}
float kegel(vec3 p,float h,float r1,float r2){vec2 q=vec2(length(p.xz),p.y);vec2 k1=vec2(r2,h);vec2 k2=vec2(r2-r1,2.*h);vec2 ca=vec2(q.x-min(q.x,(q.y<0.)?r1:r2),abs(q.y)-h);vec2 cb=q-k1+k2*clamp(dot(k1-q,k2)/dot(k2,k2),0.,1.);float s=(cb.x<0.&&ca.y<0.)?-1.:1.;return s*sqrt(min(dot(ca,ca),dot(cb,cb)));}
// Weg: x in Abhaengigkeit von z (z waechst nach unten im Bild)
float wegX(float z){ // Stationen bei z=2.2 (x .62), z=0 (x -.68), z=-2.2 (x .46)
 float a=.5+.5*cos((z-2.2)/2.2*PI); float o=mix(-.68,.62,a); float b=.5+.5*cos((z+2.2)/2.2*PI); float p=mix(-.68,.46,b);
 float w=z>0.?o:p; if(z>2.2)w=mix(.62,0.,smoothstep(2.2,4.4,z)); if(z<-2.2)w=mix(.46,0.,smoothstep(-2.2,-4.2,z)); return w;}
float bachX(float z){return 1.62+.16*sin(z*1.1+.6);}
// Stoffe: 1 Wiese 2 Weg 3 Wasser 4 Stein 5 Dach 6 Holz 7 Laub 8 Stamm 9 Erde 10 Kohl 11 Gold 12 Stationstein 13 Mantel 14 Stroh 15 Haut 16 Blume 17 Apfel 18 hell 19 Rotkohl 20 Laterne
vec2 U(vec2 a,vec2 b){return a.x<b.x?a:b;}
float krone(vec3 p,float s){float d=length(p-vec3(0,.0,0))-.42*s;d=smin(d,length(p-vec3(.26,.12,.08)*s)-.28*s,.08);d=smin(d,length(p-vec3(-.24,.08,.12)*s)-.3*s,.08);d=smin(d,length(p-vec3(.03,.32,-.05)*s)-.29*s,.08);d=smin(d,length(p-vec3(.05,-.04,.28)*s)-.26*s,.08);return d;}
vec2 szene(vec3 p){
 float bx=abs(p.x-bachX(p.z));
 float mulde=-.16*smoothstep(.36,.22,bx);
 float wx=abs(p.x-wegX(p.z));
 float boden=.035*sin(p.x*1.7+.5)*cos(p.z*1.3)+mulde+.03*smoothstep(.36,.28,wx);
 float st=wx<.33?2.:1.;
 vec2 r=vec2((p.y-boden)*.75,st);
 r=U(r,vec2(p.y+.085+.012*sin(p.z*9.+p.x*5.),3.));
 // Stationen
 vec3 a=p-vec3(.62,.06,2.2);r=U(r,vec2(zyl(a,.36,.06,.03),12.));
 {vec3 q=a-vec3(0,.075,0);float an=mod(atan(q.z,q.x)+PI/6.,PI/3.)-PI/6.;float l=length(q.xz);vec3 b=vec3(cos(an)*l-.17,q.y,sin(an)*l);float e=length(b/vec3(1.,.42,.62))-.1;r=U(r,vec2(e*.5,16.));r=U(r,vec2(length(q/vec3(1.,.7,1.))-.075,11.));}
 a=p-vec3(-.68,.06,0.);r=U(r,vec2(zyl(a,.36,.06,.03),12.));r=U(r,vec2(torus(a-vec3(0,.09,0),.25,.055),11.));r=U(r,vec2(length((a-vec3(0,.085,0))/vec3(1,.6,1))-.08,11.));
 a=p-vec3(.46,.06,-2.2);r=U(r,vec2(zyl(a,.36,.06,.03),12.));
 // Beet
 a=p-vec3(-1.33,.13,1.75);float kb=kasten(a,vec3(.52,.15,.5),.04);kb=max(kb,-kasten(a-vec3(0,.12,0),vec3(.45,.14,.43),.02));r=U(r,vec2(kb,6.));r=U(r,vec2(kasten(a-vec3(0,-.02,0),vec3(.45,.1,.43),.02)+.012*sin(p.z*38.),9.));
 {vec3 q=a-vec3(0,.12,0);vec2 id=clamp(floor((q.xz+vec2(.45,.40))/.18),vec2(0.),vec2(4.,3.));vec2 m=q.xz+vec2(.45,.40)-.18*id;vec3 b=vec3(m.x-.09,q.y,m.y-.09);float e=length(b)-.072;e=min(e,max(length(b-vec3(0,-.02,0))-.092,abs(q.y+.01)-.02));float so=mod(id.y,2.);if(id.y<2.5)r=U(r,vec2(e*.8,so<.5?10.:19.));}
 // Baeume
 a=p-vec3(-1.5,.0,-.75);r=U(r,vec2(kegel(a-vec3(0,.3,0),.34,.11,.07),8.));{vec3 k=a-vec3(0,.95,0);float d=krone(k,1.12)+.022*sin(k.x*23.)*sin(k.y*21.)*sin(k.z*22.);r=U(r,vec2(d*.7,7.));
  for(int i=0;i<6;i++){float f=float(i);vec3 o=vec3(cos(f*1.9)*.42,sin(f*2.7)*.26+.1,abs(sin(f*1.3))*.34+.16);r=U(r,vec2(length(k-o)-.062,17.));}}
 a=p-vec3(1.12,.0,-.9);r=U(r,vec2(kegel(a-vec3(0,.24,0),.26,.085,.06),8.));{vec3 k=a-vec3(0,.74,0);r=U(r,vec2((krone(k,.85)+.018*sin(k.x*27.)*sin(k.y*25.)*sin(k.z*26.))*.7,7.));}
 a=p-vec3(-1.35,.0,-2.9);r=U(r,vec2(kegel(a-vec3(0,.24,0),.26,.085,.06),8.));{vec3 k=a-vec3(0,.76,0);r=U(r,vec2((krone(k,.95)+.018*sin(k.x*27.)*sin(k.y*25.)*sin(k.z*26.))*.7,7.));}
 // Mauer und Tor hinten
 a=p-vec3(0,.28,-3.55);float ma=kasten(a-vec3(-1.62,0,0),vec3(1.1,.34,.15),.04);ma=min(ma,kasten(a-vec3(1.62,0,0),vec3(1.1,.34,.15),.04));ma+=.008*sin(p.x*16.)*sin(p.y*22.);
 float th=kasten(a-vec3(0,.24,0),vec3(.56,.6,.26),.03);float lo=max(kasten(a-vec3(0,-.12,0),vec3(.27,.36,.6),.0),-1.);lo=min(lo,max(length((a-vec3(0,.24,0)).xy)-.27,abs(a.z)-.6));th=max(th,-lo);
 r=U(r,vec2(min(ma,th)*.85,4.));
 {vec3 q=a-vec3(0,1.02,0);q.x=abs(q.x);float da=dot(q.xy,normalize(vec2(.62,.78)))-.2;da=max(da,-q.y-.2);da=max(da,abs(q.z)-.36);r=U(r,vec2(da*.8+.008*sin(q.y*70.),5.));}
 r=U(r,vec2(kasten(a-vec3(0,1.5,0),vec3(.022,.15,.022),.01),11.));r=U(r,vec2(kasten(a-vec3(0,1.53,0),vec3(.085,.022,.022),.01),11.));
 // Figur
 a=p-vec3(-.28,.06,.72);r=U(r,vec2(kegel(a-vec3(0,.22,0),.22,.19,.09)-.02,13.));r=U(r,vec2(length(a-vec3(0,.53,0))-.1,15.));r=U(r,vec2(zyl(a-vec3(0,.585,0),.21,.012,.01),14.));r=U(r,vec2(max(length((a-vec3(0,.6,0))/vec3(1,.9,1))-.115,-(a.y-.59)),14.));
 r=U(r,vec2(kasten(a-vec3(.17,.26,.04),vec3(.02,.1,.075),.012),11.));
 // Laterne
 a=p-vec3(-1.12,.06,.22);r=U(r,vec2(zyl(a-vec3(0,.3,0),.025,.3,.01),6.));r=U(r,vec2(kasten(a-vec3(0,.68,0),vec3(.075,.1,.075),.02),20.));r=U(r,vec2(kegel(a-vec3(0,.83,0),.06,.13,.02),13.));
 // Steine am Bach
 for(int i=0;i<9;i++){float z=-3.4+float(i)*.85;float s=mod(float(i),2.)<.5?-1.:1.;vec3 o=vec3(bachX(z)+s*.36,.0,z);r=U(r,vec2(length((p-o)/vec3(1.,.62,.8))*.8-.1-.03*hash(vec2(z,1.)),4.));}
 // Blumen
 for(int i=0;i<30;i++){float f=float(i);vec3 o=vec3(-1.8+3.*hash(vec2(f,3.)),.0,-2.9+6.4*hash(vec2(f,7.)));if(abs(o.x-wegX(o.z))<.5||abs(o.x-bachX(o.z))<.5||(o.x<-.7&&o.z>1.1&&o.z<2.4)||(abs(o.x+.28)<.3&&abs(o.z-.72)<.4))continue;vec3 q=p-o;r=U(r,vec2(zyl(q-vec3(0,.07,0),.014,.08,.005),7.));r=U(r,vec2(length((q-vec3(0,.17,0))/vec3(1,.7,1))*.85-.055,16.+.0));}
 return r;}
vec3 norm(vec3 p){vec2 e=vec2(.0015,0);return normalize(vec3(szene(p+e.xyy).x-szene(p-e.xyy).x,szene(p+e.yxy).x-szene(p-e.yxy).x,szene(p+e.yyx).x-szene(p-e.yyx).x));}
float schatten(vec3 o,vec3 d){float r=1.,t=.03;for(int i=0;i<40;i++){float h=szene(o+d*t).x;r=min(r,9.*h/t);t+=clamp(h,.02,.22);if(r<.01||t>5.)break;}return clamp(r,0.,1.);}
float umgebung(vec3 p,vec3 n){float o=0.,s=1.;for(int i=0;i<5;i++){float h=.02+.11*float(i);o+=(h-szene(p+n*h).x)*s;s*=.8;}return clamp(1.-1.25*o,0.,1.);}
vec3 stoff(float m,vec3 p){
 float k=rauschen(p.xz*7.)*.5+rauschen(p.xz*19.)*.3;
 if(m<1.5)return mix(vec3(.36,.52,.22),vec3(.53,.64,.30),k);
 if(m<2.5)return mix(vec3(.80,.66,.44),vec3(.91,.79,.58),rauschen(p.xz*24.));
 if(m<3.5)return mix(vec3(.20,.50,.62),vec3(.45,.73,.80),rauschen(p.xz*vec2(7.,2.4)));
 if(m<4.5)return mix(vec3(.66,.61,.53),vec3(.80,.76,.68),rauschen(p.xy*9.+p.z*5.));
 if(m<5.5)return vec3(.74,.36,.22);if(m<6.5)return mix(vec3(.50,.32,.19),vec3(.62,.42,.26),rauschen(p.xz*vec2(4.,30.)));
 if(m<7.5)return mix(vec3(.22,.42,.19),vec3(.42,.60,.26),clamp(p.y*.75,0.,1.));if(m<8.5)return vec3(.42,.28,.18);if(m<9.5)return vec3(.31,.20,.13);
 if(m<10.5)return vec3(.52,.70,.34);if(m<11.5)return vec3(.88,.66,.17);if(m<12.5)return mix(vec3(.72,.69,.63),vec3(.84,.81,.75),rauschen(p.xz*11.));
 if(m<13.5)return vec3(.13,.21,.42);if(m<14.5)return vec3(.90,.74,.38);if(m<15.5)return vec3(.86,.64,.48);
 if(m<16.5){float h=hash(floor(p.xz*1.7));return h<.33?vec3(.95,.72,.25):h<.66?vec3(.86,.38,.42):vec3(.97,.94,.88);}
 if(m<17.5)return vec3(.80,.20,.16);if(m<19.5)return vec3(.50,.28,.52);return vec3(1.,.86,.5);}
void main(){
 vec3 summe=vec3(0.);
 for(int ii=0;ii<4;ii++){
 vec2 ab=vec2(mod(float(ii),2.),floor(float(ii)/2.))*.5+.25;
 vec2 uv=(gl_FragCoord.xy+versatz+ab-.5*aufl)/aufl.x*4.05;
 float w=.86;vec3 vor=vec3(0.,-sin(w),-cos(w)),hoch=vec3(0.,cos(w),-sin(w)),re=vec3(1,0,0);
 vec3 o=vec3(0.,0.,-.15)-vor*9.+re*uv.x+hoch*uv.y;
 float t=0.;vec2 h=vec2(1.,0.);bool hit=false;
 for(int i=0;i<150;i++){h=szene(o+vor*t);if(h.x<.0012){hit=true;break;}t+=h.x*.9;if(t>20.)break;}
 vec3 c=vec3(.86,.90,.88);
 if(hit){vec3 p=o+vor*t;vec3 n=norm(p);vec3 l=normalize(vec3(-.62,.92,.36));
  float d=max(dot(n,l),0.),s=schatten(p+n*.004,l),a=umgebung(p,n),hi=.5+.5*n.y,rand=pow(1.-max(dot(n,-vor),0.),3.);
  vec3 m=stoff(h.y,p);
  c=m*(d*s*vec3(1.32,1.15,.90)*.92+hi*a*vec3(.42,.52,.68)*.62+.12*a*vec3(1.,.8,.6));
  c+=m*rand*.28*a;
  vec3 hv=normalize(l-vor);float sp=pow(max(dot(n,hv),0.),h.y>2.5&&h.y<3.5?90.:h.y>10.5&&h.y<11.5?42.:14.);c+=sp*s*(h.y>2.5&&h.y<3.5?.8:h.y>10.5&&h.y<11.5?.65:.07)*vec3(1.,.95,.82);
  if(h.y>19.5)c=vec3(1.,.87,.52)*1.12;
  // warmer Schein der Laterne
  float ld=length(p-vec3(-1.12,.7,.22));c+=m*vec3(1.,.7,.3)*.42/(1.+ld*ld*7.);
  // fern und noch nicht erreicht: im Dunst
  float nebel=smoothstep(-1.2,-4.4,p.z);c=mix(c,vec3(.80,.84,.80),nebel*.6);
 }
 c=c/(c+.72)*1.62;c=pow(clamp(c,0.,1.),vec3(.92));
 summe+=c;}
 vec3 c=summe/4.;
 gl_FragColor=vec4(c,1.);
}
'''


def miniatur():
    js = 'const C=document.querySelector("canvas");C.width=800;C.height=1200;const g=C.getContext("webgl",{preserveDrawingBuffer:true,antialias:false});const quelle=' + json.dumps(GLSL) + ''';
if(!g){document.body.textContent='Dieses Bild braucht WebGL.';window.fertig=true}else{
const sh=(t,q)=>{const s=g.createShader(t);g.shaderSource(s,q);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS))console.error(g.getShaderInfoLog(s));return s};
const p=g.createProgram();g.attachShader(p,sh(g.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));g.attachShader(p,sh(g.FRAGMENT_SHADER,quelle));g.linkProgram(p);if(!g.getProgramParameter(p,g.LINK_STATUS))console.error(g.getProgramInfoLog(p));g.useProgram(p);
g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer());g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);g.enableVertexAttribArray(0);g.bindAttribLocation(p,0,'a');const al=g.getAttribLocation(p,'a');g.enableVertexAttribArray(al);g.vertexAttribPointer(al,2,g.FLOAT,false,0,0);
g.uniform2f(g.getUniformLocation(p,'aufl'),800,1200);g.uniform2f(g.getUniformLocation(p,'versatz'),0,0);g.viewport(0,0,800,1200);g.enable(g.SCISSOR_TEST);
// in kleinen Feldern rechnen, damit der Browser bedienbar bleibt
const F=100;const felder=[];for(let y=0;y<1200;y+=F)for(let x=0;x<800;x+=F)felder.push([x,y]);let i=0;
(function weiter(){if(i>=felder.length){window.fertig=true;return}const [x,y]=felder[i++];g.scissor(x,y,F,F);g.drawArrays(g.TRIANGLES,0,3);g.finish();setTimeout(weiter,0)})();}
'''
    leinwandseite('10', 'miniatur', 'Miniatur in 3D', js, '#cfd6cf')
    # Tiefenunschaerfe wie bei einem Modellfoto
    p = os.path.join(ZIEL, '10-miniatur.html')
    s = open(p, encoding='utf-8').read()
    s = s.replace('</style>', 'body{position:relative}.unscharf{position:absolute;inset:0;margin:auto;width:min(100vw,calc(100vh*400/600));aspect-ratio:400/600;backdrop-filter:blur(3.2px);-webkit-mask:linear-gradient(#000 0,transparent 30%,transparent 78%,#000 100%);mask:linear-gradient(#000 0,transparent 30%,transparent 78%,#000 100%);pointer-events:none}</style>').replace('</canvas>', '</canvas><div class="unscharf"></div>')
    open(p, 'w', encoding='utf-8', newline='\n').write(s)


if __name__ == '__main__':
    stickerei()
    miniatur()
    mosaik()
