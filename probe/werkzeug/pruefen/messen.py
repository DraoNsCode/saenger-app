# Wie viel vom Bild aendert sich zwischen zwei Screenshots? Aufruf: python messen.py vorher.png nachher.png [vorher2.png nachher2.png ...]
# „deutlich anders“ heisst Farbabstand (CIE76) ueber 10. Misst, wie viel sich aendert, nicht, wie es wirkt.
import sys, zlib, struct
def lies(f):
    d = open(f, 'rb').read(); p = 8; idat = b''
    while p < len(d):
        l, t = struct.unpack('>I4s', d[p:p+8]); c = d[p+8:p+8+l]; p += 12 + l
        if t == b'IHDR': w, h, bt, ct = struct.unpack('>IIBB', c[:10])
        elif t == b'IDAT': idat += c
    k = {2: 3, 6: 4}[ct]; roh = zlib.decompress(idat); z = w * k; aus = []; vor = bytearray(z); q = 0
    for y in range(h):
        f_ = roh[q]; r = bytearray(roh[q+1:q+1+z]); q += 1 + z
        if f_ == 1:
            for i in range(k, z): r[i] = (r[i] + r[i-k]) & 255
        elif f_ == 2:
            for i in range(z): r[i] = (r[i] + vor[i]) & 255
        elif f_ == 3:
            for i in range(z): r[i] = (r[i] + (((r[i-k] if i >= k else 0) + vor[i]) >> 1)) & 255
        elif f_ == 4:
            for i in range(z):
                a = r[i-k] if i >= k else 0; b = vor[i]; c = vor[i-k] if i >= k else 0
                e = a + b - c; pa, pb, pc = abs(e-a), abs(e-b), abs(e-c)
                r[i] = (r[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        aus.append(bytes(r)); vor = r
    return w, h, k, aus
def lin(v):
    v /= 255
    return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4
LIN = [lin(v) for v in range(256)]
def lab(r, g, b, c={}):
    s = (r, g, b)
    if s in c: return c[s]
    R, G, B = LIN[r], LIN[g], LIN[b]
    X, Y, Z = (.4124*R+.3576*G+.1805*B)/.95047, .2126*R+.7152*G+.0722*B, (.0193*R+.1192*G+.9505*B)/1.08883
    f = lambda t: t ** (1/3) if t > .008856 else 7.787*t + 16/116
    x, y, z = f(X), f(Y), f(Z)
    c[s] = (116*y-16, 500*(x-y), 200*(y-z))
    return c[s]
a = sys.argv[1:]
for f1, f2 in zip(a[::2], a[1::2]):
    w, h, k, A = lies(f1); w2, h2, k2, B = lies(f2)
    n = gesamt = 0; summe = 0
    for y in range(0, min(h, h2), 2):
        ra, rb = A[y], B[y]
        for x in range(0, w, 2):
            i, j = x*k, x*k2
            gesamt += 1
            if ra[i:i+3] != rb[j:j+3]:
                l1, l2 = lab(*ra[i:i+3]), lab(*rb[j:j+3])
                d = ((l1[0]-l2[0])**2 + (l1[1]-l2[1])**2 + (l1[2]-l2[2])**2) ** .5
                summe += d
                if d > 10: n += 1
    print(f'{f1.split("/")[-1]} -> {f2.split("/")[-1]}: {100*n/gesamt:.1f} % deutlich anders, mittlerer Abstand {summe/gesamt:.2f}')
