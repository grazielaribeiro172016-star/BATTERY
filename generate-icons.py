#!/usr/bin/env python3
"""
Gera ícones SVG para o BATTERY PWA.
Execute: python3 generate-icons.py
Requer: pip install cairosvg pillow
Ou substitua por ícones PNG reais antes de publicar.
"""

import os

SVG_TEMPLATE = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">
  <rect width="{size}" height="{size}" rx="{radius}" fill="#0a0a0a"/>
  <!-- Battery body -->
  <rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="{br}" 
        fill="none" stroke="#f5a623" stroke-width="{sw}"/>
  <!-- Battery tip -->
  <rect x="{tx}" y="{ty}" width="{tw}" height="{th}" rx="{tr}" fill="#f5a623"/>
  <!-- Battery fill -->
  <rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" rx="{fr}" 
        fill="url(#grad)"/>
  <!-- Gradient -->
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e84040"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#4caf50"/>
    </linearGradient>
  </defs>
  <!-- Letter B -->
  <text x="{lx}" y="{ly}" 
        font-family="Arial Black, sans-serif" 
        font-size="{ls}" font-weight="900" 
        fill="#f5a623" text-anchor="middle">{letter}</text>
</svg>'''

SIZES = [72, 96, 128, 192, 512]

def make_svg(size):
    pad = size * 0.15
    bw = size * 0.65
    bh = size * 0.32
    bx = (size - bw) / 2
    by = (size - bh) / 2
    br = size * 0.06
    sw = max(2, size * 0.025)
    
    # tip
    tw = size * 0.05
    th = bh * 0.45
    tx = bx + bw
    ty = by + (bh - th) / 2
    tr = size * 0.02
    
    # fill (60%)
    fp = 0.6
    fpad = sw * 0.8
    fw = (bw - fpad*2) * fp
    fh = bh - fpad*2
    fx = bx + fpad
    fy = by + fpad
    fr = br * 0.6
    
    ls = size * 0.22
    lx = size / 2
    ly = size * 0.7
    
    return SVG_TEMPLATE.format(
        size=size, radius=size*0.2,
        bx=round(bx,1), by=round(by,1), bw=round(bw,1), bh=round(bh,1),
        br=round(br,1), sw=round(sw,1),
        tx=round(tx,1), ty=round(ty,1), tw=round(tw,1), th=round(th,1), tr=round(tr,1),
        fx=round(fx,1), fy=round(fy,1), fw=round(fw,1), fh=round(fh,1), fr=round(fr,1),
        lx=round(lx,1), ly=round(ly,1), ls=round(ls,1),
        letter='B'
    )

os.makedirs('icons', exist_ok=True)

for size in SIZES:
    svg = make_svg(size)
    path = f'icons/icon-{size}.svg'
    with open(path, 'w') as f:
        f.write(svg)
    print(f'Generated: {path}')

print('\nDone! Para converter para PNG:')
print('  pip install cairosvg')
print('  for s in 72 96 128 192 512: cairosvg icons/icon-{s}.svg -o icons/icon-{s}.png')
print('\nOu use https://realfavicongenerator.net/ com o SVG de 512px.')
