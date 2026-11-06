---
name: interactive-lesson-deck
description: Turn a lesson plan (giáo án), a textbook unit or a teacher's outline into an interactive, teacher-controlled HTML slide deck in the user's house style — build-step animations, sound effects, a group scoreboard reachable from any slide, countdown timers for group work, clickable reveal of answers, flip cards, real-map and 3D point-of-view scenes, a draggable figure with a "describe the route" checker, textbook exercise slides with their own audio, subtitles and A/B/C answer picking, vocabulary taught through context (a clickable 3D/animated scene that reveals each word, plus a continuous comic story with animated characters for every word), cue-word speaking with tick-to-score, partner practice with teacher notes and a feedback board, and a single-file offline export. Use when the user asks for slides, a deck, a presentation or "bài thuyết trình / slides dạy học" for a lesson, says "làm slides theo phong cách của tôi", shares a lesson plan link or textbook PDF and wants it taught on screen, or asks to export such a deck as one HTML file. For reviewing a full IELTS Listening test with its audio, use ielts-listening-review instead.
---

# Interactive lesson deck (teacher's house style)

One HTML page, published as an Artifact (plus an optional offline file). The teacher drives
everything; students watch the projector. Reference builds: `examples/map-labelling/`
(IELTS Listening Unit 4, Map Labelling, 90-minute lesson for band 3.0) and
`examples/speaking-unit2/` (IELTS Speaking Part 1, Uncommon topics: 3D space journey,
three comic stories, discourse markers, speaking activities). The user approved both.

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
- **Vocabulary is never a list of word + meaning.** Every word the lesson teaches gets
  (1) a context, (2) an example sentence and (3) a place in a comic story. Details below.
- Vietnamese UI text, English examples; British English in IELTS material
  (lift, chemist, car park, toilets, petrol station).
- Text must fit inside its panel at 1280×720; trim content before shrinking type.
  Readable labels on maps (road names on a dark pill, never on the lane markings).

## Teaching vocabulary (the user's standing rule)

Every vocabulary set is taught in this order; no slide shows a bare word list.

1. **Context scene the teacher drives.** Build a scene from the topic's own world in which
   each word *happens* before it is named. Space: a 3D journey (Earth at night → click the
   observatory / the child with a telescope → launch pad: astronaut, spaceship → lift-off →
   planets → comet → meteors → UFO → solar system → constellation → Milky Way → cosmos).
   Other topics get the same treatment in 2D/CSS (a street, a house, a festival).
   - The word appears only when its event happens or when the teacher **clicks the thing
     in the picture** (pulsing ring = clickable); → also advances.
   - Never show upcoming words: the route bar shows labels only for stops already visited.
   - Word card: headword, IPA (British), part of speech, Vietnamese meaning, an example
     sentence with the word highlighted, 🔊 (speechSynthesis en-GB), optional second word.
     A "Chế độ đố" toggle hides the word so students guess first.
2. **One continuous comic story per topic** (not many small strips): ~16 panels, 4 per
   page, page flips with →. Every remaining word of the topic is used in the dialogue or
   captions; check the count against the source list and say it.
   - 3–5 characters per panel from one recurring cast (friends, family, teacher), so the
     class follows a single plot across pages.
   - Characters move: breathing, blinking, the speaker's mouth talks while their bubble
     pops in, mood actions (hop when excited, shiver when nervous, sob, angry shake, head
     tilt when confused, waving, cheering), entrances from the side; scene props move too
     (lanterns sway, balloons float, rain, twinkling stars, rotating rays).
   - Taught words are highlighted in the bubbles; clicking one opens its card in the
     sidebar (meaning + usage pattern such as `be eager to + V`). The sidebar lists only
     the current page's words.
   - Last step: a "Your turn" overlay with 3 personal speaking questions and every word of
     the story as chips.
3. **Speaking with the words**: cue-word questions (question, then 2–3 target words and a
   "+ discourse marker" chip; the teacher ticks what they hear and adds the points to the
   chosen group) and partner practice (A asks / B answers with ≥2 words, timer, swap
   roles; teacher notes per pair with tags, stars, "good language" and "error → fix";
   a feedback slide gathers them, corrections revealed on click).

## Components (all in this skill)

| Need | Use |
|---|---|
| Look, layout, type scale | `assets/base-head.html` (tokens, 16:9 stage, buttons) + `assets/components.css` |
| Sound effects + scoreboard + B-key jump | `assets/runtime-sfx-scoreboard.html` (`window.SFX`, needs `window.DECK` from main.js) |
| Illustrated street map, route walking | `assets/townmap-engine.js`: `TownMap.draw(svg,cfg,{letters,fs,roadFs,roadNames})`, `TownMap.walk(cfg,start,text)` → path, end, log, unknown clauses; `TownMap.model(cfg,start,point)` → a model description |
| Map data | `maps.js` in the lesson (`window.MAPDATA`): roads `{id,name,c:[x1,y1,x2,y2]}` (horizontal or vertical), buildings `{name,x,y,w,h,road,letter?,hide?}`, areas `park/water/square` |
| Controller patterns | `examples/map-labelling/main.js`: steps (`STEP[id]=(slide,n)=>…`, `data-steps`), 3D POV plane (CSS `@property --rz`), IN/ON/AT overlays, walker on a path, flip cards, draggable figure + start marker, timers, exercise audio with seek/speed/CC, A/B/C picking |
| Comic stories | `assets/comic-draw.js` (cast, poses, moods, props, backgrounds as SVG strings; animatable groups) + `assets/comic-story.js` (renders `section.slide.comic[data-story]` from `STORIES`/`WORDS`, pages, sidebar, Your turn) + `assets/comic-kit.css` (layout and all character motion). Data format: `examples/speaking-unit2/src/3-stories.js` |
| 3D scene with clickable 2D intro | `examples/speaking-unit2/src/1-space.js` + the `.sp-ov` SVG in its `slides.html`: three.js (vendored `media/three.min.js`, UMD r160), procedural planet textures, ship flight on a Bézier with a chase camera, timed events (meteors, comet tail, UFO), teacher drag/zoom, word cards, hidden route |
| Speaking activities | `examples/speaking-unit2/src/4-speak.js`: discourse-marker sort (click or drag, check, answers), cue words with scoring through the scoreboard, partner practice + teacher notes (localStorage), feedback board |
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
4. **Vocabulary**: list every word from the source (and from any word list the user gives,
   e.g. an .xlsx), split it between the context scene and the comic story, and write the
   story so each word is used naturally. Tell the user which words you added.
5. **Write the lesson folder** (copy `examples/map-labelling/` or `examples/speaking-unit2/`),
   put images/mp3 in `media/`.
6. **Build**: `python3 scripts/build_deck.py LESSON_DIR OUT_DIR --title "…"`; a lesson that
   uses the comic kit builds with its `make.sh` (concatenates kit + lesson sources).
7. **Check once** with Playwright at 1280×720: step through every build slide (wait for
   animations), click each interactive control, look for overlapping text. For the route
   checker, evaluate `TownMap.walk` on 3–4 sample descriptions, including a wrong one.
   For comics, open every page and the Your turn step; for 3D, launch Chromium with
   `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader` (it runs slowly, so
   timed events look late in screenshots).
8. **Publish** with the Artifact tool: `file_path` OUT_DIR/index.html, `files` = every media
   file. Do not use the Slides artifact type: it cannot run these interactions or audio.
9. **Offline / "xuất file html"**: `python3 scripts/pack_offline.py OUT_DIR/index.html OUT.html`
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
- cdnjs may be blocked in the sandbox: get three.js from npm (`npm pack three@0.160.0`,
  `build/three.min.js`) and ship it as a media file loaded with `<script src>`.
- three.js `Points` whose positions are filled every frame need `frustumCulled=false`,
  or they vanish (their bounding sphere is computed at the origin).
- Timed 3D events (comet, meteors) must start after the ship's flight ends, not when the
  step starts.
- Do not set `transform-box: fill-box` on every SVG element: it moves elements that carry
  a `transform="rotate(a cx cy)"` attribute. Set it only on the animated parts. A CSS
  animation on an element that has a `transform` attribute replaces that attribute; animate
  an inner `<g>` instead.
- Keywords inside comic bubbles must be inline `<span role="button">`, not `<button>`
  (buttons are inline-block and break multi-word phrases badly).
- Never name a container class `.comic` when slides use `.slide.comic`.
- Playwright cannot click elements with an infinite pulse animation; use `{force:true}`.
- `pack_offline.py` inlines every Google Fonts link (comic fonts included); re-test the
  packed file offline.
