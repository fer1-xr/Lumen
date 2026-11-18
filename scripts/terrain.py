import math, os, sys, json, io, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
TILEDIR, NEDIR, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(TILEDIR, exist_ok=True); os.makedirs(OUT, exist_ok=True)
def tile(z, x, y):
    p = os.path.join(TILEDIR, f'{z}_{x}_{y}.png')
    if not os.path.exists(p):
        url = f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        data = urllib.request.urlopen(url, timeout=60).read()
        open(p, 'wb').write(data)
    a = np.asarray(Image.open(p).convert('RGB')).astype(np.float64)
    return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
def merc(lon, lat, z):
    n = 256 * 2 ** z
    x = (lon + 180) / 360 * n
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n
    return x, y
LAND = json.load(open(os.path.join(NEDIR, 'ne_10m_land.geojson')))
LAKES = json.load(open(os.path.join(NEDIR, 'ne_10m_lakes.geojson')))
RIVERS = json.load(open(os.path.join(NEDIR, 'ne_10m_rivers_lake_centerlines.geojson')))
def polys(geo):
    for f in geo['features']:
        g = f['geometry']
        if not g: continue
        if g['type'] == 'Polygon': yield g['coordinates']
        elif g['type'] == 'MultiPolygon':
            for p in g['coordinates']: yield p
def lines(geo):
    for f in geo['features']:
        g = f['geometry']
        if not g: continue
        if g['type'] == 'LineString': yield g['coordinates']
        elif g['type'] == 'MultiLineString':
            for l in g['coordinates']: yield l
def region(name, lon0, lon1, lat0, lat1, z, W, H, HW, HH, river_w):
    # mosaic
    x0, y0 = merc(lon0, lat1, z); x1, y1 = merc(lon1, lat0, z)
    tx0, ty0, tx1, ty1 = int(x0 // 256), int(y0 // 256), int(x1 // 256), int(y1 // 256)
    mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256))
    for ty in range(ty0, ty1 + 1):
        for tx in range(tx0, tx1 + 1):
            mos[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = tile(z, tx, ty)
    print(name, 'tiles', (tx1 - tx0 + 1) * (ty1 - ty0 + 1))
    lons = lon0 + (np.arange(W) + 0.5) / W * (lon1 - lon0)
    lats = lat1 - (np.arange(H) + 0.5) / H * (lat1 - lat0)
    n = 256 * 2 ** z
    px = (lons + 180) / 360 * n - tx0 * 256
    s = np.sin(np.radians(lats))
    py = (0.5 - np.log((1 + s) / (1 - s)) / (4 * np.pi)) * n - ty0 * 256
    PX, PY = np.meshgrid(px, py)
    ix = np.clip(PX.astype(int), 0, mos.shape[1] - 2); iy = np.clip(PY.astype(int), 0, mos.shape[0] - 2)
    fx = PX - ix; fy = PY - iy
    E = (mos[iy, ix] * (1 - fx) * (1 - fy) + mos[iy, ix + 1] * fx * (1 - fy) + mos[iy + 1, ix] * (1 - fx) * fy + mos[iy + 1, ix + 1] * fx * fy)
    def to_px(c):
        return [((lo - lon0) / (lon1 - lon0) * W, (lat1 - la) / (lat1 - lat0) * H) for lo, la, *_ in c]
    def inside(c):
        xs = [p[0] for p in c]; ys = [p[1] for p in c]
        return not (max(xs) < lon0 - 1 or min(xs) > lon1 + 1 or max(ys) < lat0 - 1 or min(ys) > lat1 + 1)
    mask = Image.new('L', (W, H), 0); d = ImageDraw.Draw(mask)
    for p in polys(LAND):
        if not inside(p[0]): continue
        d.polygon(to_px(p[0]), fill=255)
        for hole in p[1:]: d.polygon(to_px(hole), fill=0)
    for p in polys(LAKES):
        if not inside(p[0]): continue
        d.polygon(to_px(p[0]), fill=0)
    rmask = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(rmask)
    for l in lines(RIVERS):
        if not inside(l): continue
        dr.line(to_px(l), fill=255, width=river_w)
    land = np.asarray(mask) > 127
    river = np.asarray(rmask) > 127
    # colors
    cellx = (lon1 - lon0) / W * 111000 * math.cos(math.radians((lat0 + lat1) / 2)); celly = (lat1 - lat0) / H * 111000
    Eland = np.where(land, np.maximum(E, -430), 0)
    gy, gx = np.gradient(Eland, celly, cellx)
    exag = 6.0 if z < 8 else 2.5
    nx, ny, nz = -gx * exag, gy * exag, np.ones_like(E)
    norm = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    L = np.array([-0.6, 0.6, 0.55]); L = L / np.linalg.norm(L)
    shade = (nx * L[0] + ny * L[1] + nz * L[2]) / norm
    stops = [(-450, (120, 150, 95)), (0, (150, 168, 110)), (200, (190, 182, 128)), (600, (205, 180, 130)), (1200, (176, 140, 100)), (2000, (150, 118, 90)), (3000, (200, 190, 180)), (4500, (245, 245, 245))]
    se = np.array([s[0] for s in stops], float); sc = np.array([s[1] for s in stops], float)
    col = np.stack([np.interp(Eland, se, sc[:, i]) for i in range(3)], -1)
    col = col * (0.55 + 0.6 * np.clip(shade, 0, 1))[..., None]
    depth = np.clip(-E, 0, 4000)
    wcol = np.stack([np.interp(depth, [0, 200, 1500, 4000], c) for c in ([110, 80, 50, 35], [170, 140, 110, 90], [200, 185, 165, 150])], -1)
    img = np.where(land[..., None], col, wcol)
    rv = river & land
    img[rv] = img[rv] * 0.3 + np.array([70, 120, 190]) * 0.7
    # coast line darkening
    cm = Image.fromarray((land * 255).astype(np.uint8)).filter(ImageFilter.FIND_EDGES)
    edge = np.asarray(cm) > 0
    img[edge] = img[edge] * 0.6 + np.array([60, 80, 100]) * 0.4
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(OUT, f'{name}.jpg'), quality=86)
    # heightmap
    Hm = np.where(land, np.maximum(E, -430), -60 - np.clip(-E, 0, 3000) * 0.02)
    Hm = np.where(river & land, Hm - 8, Hm)
    hs = np.asarray(Image.fromarray(Hm.astype(np.float32), mode='F').resize((HW, HH), Image.BILINEAR))
    hs.astype('<i2').tofile(os.path.join(OUT, f'{name}.bin'))
    meta = {'lon0': lon0, 'lon1': lon1, 'lat0': lat0, 'lat1': lat1, 'w': HW, 'h': HH, 'maxE': float(hs.max()), 'minE': float(hs.min())}
    json.dump(meta, open(os.path.join(OUT, f'{name}.json'), 'w'))
    print(name, meta)
region('mundo', -10, 62, 10, 46, 6, 4096, 2048, 512, 256, 2)
region('tierrasanta', 33.6, 37.2, 29.3, 33.8, 9, 1600, 2400, 300, 450, 3)
