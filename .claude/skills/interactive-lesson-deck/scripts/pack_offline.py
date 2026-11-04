#!/usr/bin/env python3
"""Pack a built deck into ONE self-contained HTML file (works without internet).

    python3 pack_offline.py OUT_DIR/index.html PACKED.html

Inlines, as data URIs: every local file referenced by src="…" or data-audio="…"
(images, mp3), and the Google Fonts (latin, latin-ext, vietnamese subsets). Adds the
<!doctype>/<head> skeleton the artifact host normally supplies. Needs network access to
fonts.googleapis.com once, while packing.
"""
import base64, mimetypes, os, re, sys, urllib.request

src_path, out = sys.argv[1:3]
base = os.path.dirname(os.path.abspath(src_path))
src = open(src_path, encoding='utf-8').read()

def inline(m):
    attr, f = m.group(1), m.group(2)
    p = os.path.join(base, f)
    if f.startswith(('data:', 'http')) or not os.path.exists(p):
        return m.group(0)
    mime = mimetypes.guess_type(p)[0] or 'application/octet-stream'
    return f'{attr}="data:{mime};base64,' + base64.b64encode(open(p, 'rb').read()).decode() + '"'
src = re.sub(r'\b(src|data-audio)="([^"]+)"', inline, src)

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}
m = re.search(r'<link rel="stylesheet" href="(https://fonts.googleapis.com/css2\?[^"]+)">', src)
if m:
    css = urllib.request.urlopen(urllib.request.Request(m.group(1).replace('&amp;', '&'), headers=UA)).read().decode()
    keep, cache = [], {}
    for subset, block in re.findall(r'/\* ([a-z-]+) \*/\s*(@font-face \{.*?\})', css, flags=re.S):
        if subset not in ('latin', 'latin-ext', 'vietnamese'):
            continue
        url = re.search(r'url\((https://[^)]+)\)', block).group(1)
        if url not in cache:
            cache[url] = 'data:font/woff2;base64,' + base64.b64encode(urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read()).decode()
        keep.append(block.replace(url, cache[url]))
    src = src.replace(m.group(0), '<style>\n' + '\n'.join(keep) + '\n</style>')
    src = src.replace('<link rel="preconnect" href="https://fonts.googleapis.com">', '')

title = re.search(r'<title>.*?</title>', src).group(0)
src = src.replace(title, '', 1)
page = ('<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + title + '\n<style>[hidden]{display:none!important}body{margin:0}</style>\n</head>\n<body>\n' + src + '\n</body>\n</html>\n')
open(out, 'w', encoding='utf-8').write(page)
left = re.findall(r'(?:src|href|data-audio)="(?!data:)[^"]+"', page)
print(f'{out}: {os.path.getsize(out) / 1e6:.1f} MB; references not inlined: {left or "none"}')
