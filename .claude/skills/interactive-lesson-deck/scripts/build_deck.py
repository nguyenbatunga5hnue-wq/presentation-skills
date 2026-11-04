#!/usr/bin/env python3
"""Assemble a teacher-controlled lesson deck from a lesson folder.

    python3 build_deck.py LESSON_DIR OUT_DIR [--title "Map Labelling"]

LESSON_DIR holds (see examples/map-labelling):
  slides.html    every <section class="slide"> of the lesson; may contain {{EXERCISES}}
  main.js        the lesson controller (navigation, steps, interactions)
  maps.js        optional: window.MAPDATA for the town-map engine
  exercises.py   optional: html() returns the book-exercise slides that replace {{EXERCISES}}
  extra.css      optional: lesson-specific styles
  media/         optional: images and audio the slides reference (copied next to the page)

OUT_DIR receives index.html plus the media files. Publish index.html as an Artifact with
the media files in `files`, or run pack_offline.py for a single self-contained file.
"""
import argparse, importlib.util, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, '..', 'assets')
ap = argparse.ArgumentParser()
ap.add_argument('lesson'); ap.add_argument('out'); ap.add_argument('--title', default='Lesson')
a = ap.parse_args()
L = lambda f: os.path.join(a.lesson, f)
rd = lambda p: open(p, encoding='utf-8').read()

css = rd(os.path.join(A, 'components.css')) + (rd(L('extra.css')) if os.path.exists(L('extra.css')) else '')
head = rd(os.path.join(A, 'base-head.html')).replace('{{TITLE}}', a.title).replace('</style>', css + '\n</style>', 1)
slides = rd(L('slides.html'))
if '{{EXERCISES}}' in slides:
    ex = ''
    if os.path.exists(L('exercises.py')):
        spec = importlib.util.spec_from_file_location('exercises', L('exercises.py'))
        mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod); ex = mod.html()
    slides = slides.replace('{{EXERCISES}}', ex)
bar = '''
</div></main>
<audio id="exAudio" preload="none"></audio>
<div id="bar">
  <button id="prev" aria-label="Slide trước">←</button>
  <span id="count">1 / 1</span>
  <button id="next" aria-label="Slide sau">→</button>
  <select id="jump" aria-label="Đi tới slide"></select>
  <button data-act="sc-goto" title="Phím B">Bảng điểm (B)</button>
  <button data-act="sc-mini">Điểm nhanh</button>
  <button data-act="sc-sfx" class="on">Âm thanh: bật</button>
  <button id="fs">Toàn màn hình</button>
  <span id="help">← → slide/bước · B bảng điểm</span>
</div>
'''
runtime = rd(os.path.join(A, 'runtime-sfx-scoreboard.html'))
scripts = []
if os.path.exists(L('maps.js')): scripts.append(rd(L('maps.js')))
if 'TownMap' in rd(L('main.js')): scripts.append(rd(os.path.join(A, 'townmap-engine.js')))
scripts.append(rd(L('main.js')))
page = head + slides + bar + runtime + ''.join(f'<script>\n{s}\n</script>\n' for s in scripts)
os.makedirs(a.out, exist_ok=True)
open(os.path.join(a.out, 'index.html'), 'w', encoding='utf-8').write(page)
if os.path.isdir(L('media')):
    for f in os.listdir(L('media')):
        shutil.copy(os.path.join(L('media'), f), a.out)
print(f"{page.count('<section')} slides -> {os.path.join(a.out, 'index.html')}")
