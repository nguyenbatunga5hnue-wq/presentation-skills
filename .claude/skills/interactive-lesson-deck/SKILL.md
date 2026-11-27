---
name: interactive-lesson-deck
description: Turn a lesson plan (giáo án), a textbook unit or a teacher's outline into an interactive, teacher-controlled HTML slide deck in the user's house style — build-step animations, sound effects, a group scoreboard reachable from any slide, countdown timers for group work, clickable reveal of answers, flip cards, real-map and 3D point-of-view scenes, a draggable figure with a "describe the route" checker, textbook exercise slides with their own audio, subtitles and A/B/C answer picking, IELTS Writing Task 1 chart lessons (charts redrawn as SVG that zoom in and out on each analysis step, one block of theory per step, sentence-by-sentence guided writing with a box for the class's own sentence before the suggested one), a teacher edit mode that saves into the artifact, a companion student worksheet, and a single-file offline export. Use when the user asks for slides, a deck, a presentation or "bài thuyết trình / slides dạy học" for a lesson, says "làm slides theo phong cách của tôi", shares a lesson plan link or textbook PDF and wants it taught on screen, or asks to export such a deck as one HTML file. For reviewing a full IELTS Listening test with its audio, use ielts-listening-review instead.
---

# Interactive lesson deck (teacher's house style)

One HTML page, published as an Artifact (plus an optional offline file). The teacher drives
everything; students watch the projector. Reference builds:
- `examples/map-labelling/` (IELTS Listening Unit 4, Map Labelling, 90-minute lesson for band 3.0).
- `lessons/wt1-overview-body/` at the repo root (IELTS Writing Task 1, overview + body
  paragraphs, two modules: trend / no trend). Copy it for any chart, table or writing lesson:
  it holds the chart engines with zoom, the one-block-at-a-time layout, the guided sentence
  writing and the teacher edit mode described below.

## House style (what the user has asked for, in their words, over several rounds)

- **Teacher controls everything.** Nothing autoplays or auto-advances. Answers, clues and
  traps stay hidden until clicked. → / ← move through build steps first, then slides.
- **Title slides carry only the title.** Content slides have one heading; no eyebrow,
  subtitle, hint line, legend or footnote. Do not add a "lesson agenda" slide: the plan is
  for the teacher, not the class.
- **Every concept is illustrated in motion**, not listed: build it step by step, with a
  sound effect on each step (`SFX.pop/ding/chime/whoosh/thud/tick/zip/pour/splash/cheer`).
- **Group scoreboard** on slide 2, names and scores typed in place, reachable from any
  slide with **B** (and back to the same slide), plus a small "Điểm nhanh" panel.
- **Group activities get countdown timers** (ring timer with a sound at the end).
- **Real material over invented material.** Use the textbook's own maps/questions when the
  user provides the book (extract with `pdfimages -png`, page images with `pdftoppm`), and
  real photos for "in real life" slides (Wikimedia Commons, licence noted). Never invent
  answers silently: say which answers you derived and which you are unsure of.
- Vietnamese UI text, English examples; British English in IELTS material
  (lift, chemist, car park, toilets, petrol station).
- Text must fit inside its panel at 1280×720; trim content before shrinking type.
  Readable labels on maps (road names on a dark pill, never on the lane markings).
- **The teacher can edit the deck** (✎ Sửa / phím E) and save it into the artifact; see
  "Teacher edit mode" below. Every new deck gets it.

## Slide layout (asked for after the first WT1 draft: "slide còn nhiều khoảng trống")

- **One object, one block of theory per step.** Do not stack a whole table, list or
  paragraph set on one slide. Put the step cards in `<div class="one">` with children
  `data-o="1"`, `data-o="2"`…: only the card for the current step shows, the previous one
  slides out. Use `data-s` (cumulative reveal) only for short lists that must be compared.
- **Big type, filled space.** Body text ≈ 1.75–2cqi, key line (`.big`) 2.6–3.3cqi, cards
  1.9–2.5cqi. A text-only `.one` slide uses the larger sizes. If a slide still shows wide empty
  bands at 1280×720, enlarge the type or the chart before adding content.
- **Analysis layout** (`.ana`): chart left about 60%, the step card right. Wide charts
  (three pies in a row) use `.ana.col`: chart on top, card below. A narrow box gets a compact
  chart layout (pies in a triangle, `PieChart(svg,cfg,{tri:true})`), never a shrunken row.
- **Modules.** A lesson that covers two kinds of material (charts with / without a trend)
  is ONE deck with a dark title slide per module; `data-title` starts with `M1 ·` / `M2 ·` so
  the jump list reads by module. Each module runs: recognise → overview formula → worked
  analysis → language (flip cards) → quick practice → body-paragraph methods → guided writing.

## Chart analysis (WT1 pattern)

- **Redraw the task's charts as SVG from their numbers** (line, grouped bar, pies in
  `main.js`; a table as an HTML `<table class="wt">`), never as a static image: lines draw in,
  bars grow, slices sweep, and every point can be marked. Read the values off the user's image,
  check that parts add up (each bar year or pie = 100%), and say which values you estimated.
  Do not reuse the source image when it carries a watermark.
- **Zoom in and out on every analysis step** so the back row can read it: each step calls
  `chart.zoom(box)` (animated `viewBox`) on what the card talks about — the x-axis, the start
  points, the end points, a crossing, one bar group (`zc([...keys])`), one pie (`zp(i)`), a
  table row or a pair of cells (`Zoomer.to(block(rows,cols))`, which keeps the row and column
  labels in view). The last step of an analysis zooms back out. Clicking anywhere on a chart
  zooms 2.2× there; clicking again zooms out.
- Per step, besides the zoom: dim the series not discussed (`focus`), ring + tag the points
  named (`mark`), highlight the segment (`seg`), shade a period, add ↑/↓ end tags. Overlays
  belong to the current step only; the step function rebuilds them from scratch.
- For "write horizontally, largest first", sort the row's values as chips that slide into
  order (FLIP animation); for "write vertically, compare pairs", zoom to one pair of cells per step.
- Analyse before you teach the sentence: card = what the zoom shows (names and numbers),
  the next card = the sentence built from it.

## Guided writing, sentence by sentence (asked for: "không show luôn câu mẫu")

Never show the model answer first. The writing part of a module is four slides:
1. **Phân tích** — zoom on each object in turn, one card each (numbers, trend, rank).
2. **Định hướng** — what the overview's two sentences say, how the body is split and why
   (the chart regroups/brackets the objects), which method, and how many sentences per paragraph.
3. **Lập câu** — one line per paragraph listing what each sentence says (①②③), no models.
4. **Viết** — one slide per paragraph, one sentence per step: the sentence's content
   (`.plan`), a suggested structure (`.hint`, a frame with "…"), an empty dashed box (`.wbox`,
   always editable) where the teacher or a student types the class's sentence FIRST, then a
   "Gợi ý" button that reveals the suggested sentence (`.sug`). The chart on the left zooms to
   that sentence's data. The last step ("Cả đoạn") goes full width and shows the class's
   sentences joined as a paragraph beside the suggested paragraph (hidden until clicked).
Each writing slide carries a timer. Each body sentence must hold a number, a trend/time and
a comparison.

## Teacher edit mode

`main.js` of `lessons/wt1-overview-body/` adds ✎ Sửa (E), Lưu and ↺ Gốc slide này to the
bottom bar. Edit mode makes every text block contenteditable (headings, paragraphs, cells,
card faces, flip-card backs, fix/blank lines); keys are `slideId:index`, so every slide needs
an `id`. Edits load from `edits.json` (published next to the page), then from a localStorage
draft. **Lưu** publishes only `edits.json` through the `artifact` capability's files form
(`artifact.publish({'edits.json': …})`), so the view keeps running. Publish the deck with
`capabilities: {artifact: {}}` and `files: {"edits.json": …}` (`{}` at first). Before
republishing a deck the teacher may have edited, read the artifact's `edits.json` first and
publish that content, never `{}` over it. Without the runtime (offline file, read-only
viewer) the page says the change is kept in this browser only. Interactive items that hold
editable text must be `<div>`s, not `<button>`s (typing a space in a button clicks it).

## Companion worksheet

When asked for a handout ("worksheet / bản doc phát cho học sinh"), make a Claude Docs doc
(docs skill), not a file: the task's charts redrawn as doc charts with axes (the exam look,
category hues; pies with a legend and values inside the slices, not labels between pies), the
task wording, every structure from the deck as tables (function · structure · example), and
the same exercises with blanks; the writing task as a table "Đoạn · Câu | Nội dung | Cấu trúc
gợi ý | Câu của em". No answers unless asked (offer a separate teacher tab).

## Components (all in this skill)

| Need | Use |
|---|---|
| Look, layout, type scale | `assets/base-head.html` (tokens, 16:9 stage, buttons) + `assets/components.css` |
| Sound effects + scoreboard + B-key jump | `assets/runtime-sfx-scoreboard.html` (`window.SFX`, needs `window.DECK` from main.js) |
| Illustrated street map, route walking | `assets/townmap-engine.js`: `TownMap.draw(svg,cfg,{letters,fs,roadFs,roadNames})`, `TownMap.walk(cfg,start,text)` → path, end, log, unknown clauses; `TownMap.model(cfg,start,point)` → a model description |
| Map data | `maps.js` in the lesson (`window.MAPDATA`): roads `{id,name,c:[x1,y1,x2,y2]}` (horizontal or vertical), buildings `{name,x,y,w,h,road,letter?,hide?}`, areas `park/water/square` |
| Controller patterns | `examples/map-labelling/main.js`: steps (`STEP[id]=(slide,n)=>…`, `data-steps`), 3D POV plane (CSS `@property --rz`), IN/ON/AT overlays, walker on a path, flip cards, draggable figure + start marker, timers, exercise audio with seek/speed/CC, A/B/C picking |
| Book exercise slides | `examples/map-labelling/exercises.py` (`html()` builds them from data: page image, options, answer index, transcript lines with `K()` answer / `T()` trap / `P()` paraphrase marks) |

## Workflow

1. **Read the source.** A Claude Docs lesson plan: read it with the Claude Docs connector
   (`read` the project, then its tab node; the XML holds headings, tables and ASCII maps).
   A PDF: `pdftotext -layout`, `pdfimages -list` then `-png` for figures.
2. **Map the plan to slides**: title slide per section; one interactive slide per concept;
   activities with timers; book exercises with audio. Drop teacher-only material.
3. **Audio** for exercises: transcribe with `ielts-listening-review/scripts/transcribe.py`
   (sherpa-onnx Whisper; models from GitHub releases), then hand-correct and mark
   answers/traps. Encode mp3 mono 64k; artifacts do not serve `.m4a`.
4. **Write the lesson folder** (copy `examples/map-labelling/`), put images/mp3 in `media/`.
5. **Build**: `python3 scripts/build_deck.py LESSON_DIR OUT_DIR --title "…"`.
6. **Check once** with Playwright at 1280×720: step through every build slide (wait for
   animations), click each interactive control, look for overlapping text. For the route
   checker, evaluate `TownMap.walk` on 3–4 sample descriptions, including a wrong one.
7. **Publish** with the Artifact tool: `file_path` OUT_DIR/index.html, `files` = every media
   file. Do not use the Slides artifact type: it cannot run these interactions or audio.
8. **Offline / "xuất file html"**: `python3 scripts/pack_offline.py OUT_DIR/index.html OUT.html`
   (inlines media and fonts), test it with the browser offline, send it with SendUserFile.
   Read the live artifact's `edits.json` first; if it holds the teacher's edits, put them into
   the packed file (replace the `fetch('edits.json'…)` call with that JSON) so the file matches
   what the class has seen.

## Pitfalls met

- Sandbox network may block Wikimedia Commons: tell the user which hosts to allow
  (`commons.wikimedia.org`, `upload.wikimedia.org`) or ask for the photos.
- Don't commit textbook scans or copyrighted audio to a repository; keep them in `media/`
  locally.
- `pgrep -f name` matches the waiting shell itself; check with `ps -eo args | grep "[n]ame"`.
- A class named `.a` collides with the animation helper class; keep answer spans `.ga`.
- `SVG <text>` with emoji renders as tofu in headless Chrome; keep map labels plain text.
- Route checker: a named place that is not ahead must stop the walker (no false ✓);
  "go straight on, take the first right" means the same junction.
- Lesson CSS shares the global namespace with `base-head.html` / `components.css`. These
  names are taken there and broke the WT1 layout: `.ex` (grid), `.tag` (`display:none`),
  `.ln`, `.opt`/`.opts`, `.gap`, `.chip`, `.g1–.g3`, `.mk`, `.card`, `.big`, `.hint`, `.w`, `.pp`.
  Grep the assets for a class before using it.
- `python3 -m http.server` sends no charset: Vietnamese shows as mojibake in tests only.
  Test with `file://` (then `fetch('edits.json')` fails, which the page tolerates).
- Shell heredocs that contain `rm` or odd quoting can be refused by the safety check; write
  test scripts with the Write tool into the scratchpad instead.
