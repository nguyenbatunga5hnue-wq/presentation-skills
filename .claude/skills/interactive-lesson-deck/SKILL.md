---
name: interactive-lesson-deck
description: Turn a lesson plan (giáo án), a textbook unit or a teacher's outline into an interactive, teacher-controlled HTML slide deck in the user's house style — build-step animations, sound effects, a group scoreboard reachable from any slide, countdown timers for group work, clickable reveal of answers, flip cards, real-map and 3D point-of-view scenes, a draggable figure with a "describe the route" checker, textbook exercise slides with their own audio, subtitles and A/B/C answer picking, and a single-file offline export. Use when the user asks for slides, a deck, a presentation or "bài thuyết trình / slides dạy học" for a lesson, says "làm slides theo phong cách của tôi", shares a lesson plan link or textbook PDF and wants it taught on screen, or asks to export such a deck as one HTML file. For reviewing a full IELTS Listening test with its audio, use ielts-listening-review instead.
---

# Interactive lesson deck (teacher's house style)

One HTML page, published as an Artifact (plus an optional offline file). The teacher drives
everything; students watch the projector. Reference build: `examples/map-labelling/`
(IELTS Listening Unit 4, Map Labelling, 90-minute lesson for band 3.0).

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
