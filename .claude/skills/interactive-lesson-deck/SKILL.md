---
name: interactive-lesson-deck
description: Turn a lesson plan (giáo án), a lesson document, a textbook unit or a teacher's outline into an interactive, teacher-controlled HTML slide deck in the user's house style — build-step animations, sound effects, big question cards, a group scoreboard reachable from any slide, countdown and speaking timers, clickable reveal of answers, answer frames that turn ideas into linked sentences, one-item-at-a-time steppers, flip cards, real-map and 3D point-of-view scenes, textbook exercise slides with audio and subtitles, a built-in ✎ edit mode so the teacher can retype any text, and a single-file offline export. Use when the user asks for slides, a deck, a presentation or "bài thuyết trình / slides dạy học" for a lesson, says "làm slides theo phong cách của tôi", shares a lesson plan or Claude Docs link or a textbook PDF and wants it taught on screen, or asks to export such a deck as one HTML file. For reviewing a full IELTS Listening test with its audio, use ielts-listening-review instead.
---

# Interactive lesson deck (teacher's house style)

One HTML page, published as an Artifact (plus an optional offline file). The teacher drives
everything; students watch the projector. Two reference builds:

- `examples/map-labelling/`: IELTS Listening Unit 4, Map Labelling (maps, route walking, book exercises with audio).
- `examples/speaking-part3/`: IELTS Speaking Part 3 theory and practice, built from a Claude Docs lesson document
  (question types, answer frames, errors, scoring language, mock test, model answers).

## House style (what the user has asked for, in their words, over several rounds)

- **Teacher controls everything.** Nothing autoplays or auto-advances. Answers, clues and
  traps stay hidden until clicked. → / ← move through build steps first, then slides.
- **Title slides carry only the title.** Content slides have one heading; no eyebrow,
  subtitle, hint line, legend or footnote. Do not add a "lesson agenda" slide: the plan is
  for the teacher, not the class.
- **No redundant guidance text.** No "Bấm … để …" placeholders, no "Tiếp ▸" buttons (→ and the
  bottom bar already advance), no small labels such as "Dấu hiệu", "Tự kiểm tra", no
  Vietnamese subtitle under an English term, no explanatory caption under a picture. An empty
  panel waiting for a click stays empty or shows the first item.
- **Questions are big and clear.** Every question the class must read sits in a
  `.qcard2` (dark card, yellow **Q** badge, Lora ≈3 cqi; `.big` / `.sm` variants), never in a
  small label or a slide heading. A question that changes animates in (`.qx.swap`).
- **Every concept is illustrated in motion**, not listed: build it step by step, with a
  sound effect on each step (`SFX.pop/ding/chime/whoosh/thud/tick/zip/pour/splash/cheer/buzz/grow/minus`).
- **One item at a time** for long lists (errors, tips, rules): a stepper slide, not a grid of
  cards. → reveals the item, then its parts (e.g. *Mất điểm vì*, then *Khắc phục*), then the next
  item; a row of numbered dots jumps to any item.
- **Frames carry the answers.** When a lesson teaches answer structures (P-R-E-B, Then–Now–Why,
  Cause–Effect–Example…), merge the "framework" slide and the "question types" slide: one slide
  per worked question where the teacher clicks each frame block to reveal its short **idea**,
  then "Liên kết" turns the ideas into full sentences with the **linking words** highlighted and
  shown as pills between blocks. Practice slides must show the frame's role too (the frame for
  the chosen question, idea sources mapped onto frame blocks).
- **Group scoreboard** on slide 2, names and scores typed in place, reachable from any
  slide with **B** (and back to the same slide), plus a small "Điểm nhanh" panel.
- **Group activities get countdown timers** (ring timer with a sound at the end); speaking
  practice gets a 0–60 s bar timer with the 30–45 s target zone.
- **The teacher can edit text themselves**: the ✎ edit mode is on by default (see below).
- **Real material over invented material.** Use the source's own questions, model answers and
  examples; textbook maps/questions when the user provides the book (extract with
  `pdfimages -png`, page images with `pdftoppm`), real photos for "in real life" slides
  (Wikimedia Commons, licence noted). Never invent answers silently: tell the user which
  content you wrote yourself (e.g. question-type labels the source did not give, a model answer
  composed from fragments) and which you are unsure of.
- Vietnamese UI text, English examples; British English in IELTS material
  (lift, chemist, car park, toilets, petrol station).
- Text must fit inside its panel at 1280×720; trim content before shrinking type.
  Readable labels on maps (road names on a dark pill, never on the lane markings).
- Follow the order the user asks for; for a speaking lesson the user preferred:
  overview → criteria → question types → common errors → scoring language → answering with frames → practice.

## Components (all in this skill)

| Need | Use |
|---|---|
| Look, layout, type scale | `assets/base-head.html` (tokens, 16:9 stage, buttons) + `assets/components.css` (incl. `.qcard2`) |
| Sound effects + scoreboard + B-key jump | `assets/runtime-sfx-scoreboard.html` (`window.SFX`, needs `window.DECK` from main.js) |
| ✎ edit mode | `assets/editmode.js` + `assets/editmode.css`, added by `build_deck.py` unless `--no-edit` |
| Illustrated street map, route walking | `assets/townmap-engine.js`: `TownMap.draw(svg,cfg,{letters,fs,roadFs,roadNames})`, `TownMap.walk(cfg,start,text)` → path, end, log, unknown clauses; `TownMap.model(cfg,start,point)` → a model description |
| Map data | `maps.js` in the lesson (`window.MAPDATA`): roads `{id,name,c:[x1,y1,x2,y2]}` (horizontal or vertical), buildings `{name,x,y,w,h,road,letter?,hide?}`, areas `park/water/square` |
| Controller patterns (maps) | `examples/map-labelling/main.js`: steps (`STEP[id]=(slide,n)=>…`, `data-steps`), 3D POV plane (CSS `@property --rz`), IN/ON/AT overlays, walker on a path, flip cards, draggable figure + start marker, timers, exercise audio with seek/speed/CC, A/B/C picking |
| Book exercise slides | `examples/map-labelling/exercises.py` (`html()` builds them from data: page image, options, answer index, transcript lines with `K()` answer / `T()` trap / `P()` paraphrase marks) |
| Controller patterns (speaking / theory) | `examples/speaking-part3/main.js`: comparison table built row by row; zoom rings (I → society); criteria donut with band 6/7/8 switch; "evidence jar" that fills as answer parts are added and moves band bars; question-type cards + guessing game; **frame guide** (`FR` data: rows `[badge, frame step, idea, sentence with <em>linker</em>]`, steps = rows + 1, last step links); ranking cards that slide into order; band 5→6→7 stairs (`stairs()`); **error stepper** (`data-steps` = 3 × items − 1, dots jump); lens wheel feeding a question's frame blocks (`LROLE` maps frame steps to POINT/WHY/WHO/RESULT); upgrade-the-answer reveal; topic tabs + speaking bar timer + self-check list; mock test with follow-up and "Khung?" reveal; model answers side by side with highlight toggle |

## ✎ Edit mode (built in)

A "✎ Sửa chữ" button in the bottom bar. In edit mode every text leaf on the stage (an element with
its own text and only inline children) gets a dashed outline: click to retype in place (Enter = line
break, Ctrl+B = bold, Esc or click away = save); text inside a button is edited by double-click in a
small pop-up, so tabs and reveal buttons keep working in edit mode. "↺ Chữ gốc" restores one line,
"Khôi phục tất cả" restores the deck.

- Each edit is keyed by a hash of the element's **original** HTML, and a MutationObserver re-applies
  edits whenever the deck re-renders, so edits survive tab switches, steppers and reloads. The same
  original text in two places is one edit.
- Storage: with the artifact `db` capability, one shared document per edit in collection `edits`
  (`{h: html}`); offline or without db, `localStorage` (`deck-edits:<title>`), this browser only.
  Saved HTML is sanitised to inline tags.
- Exclude counters and live numbers: generic exclusions are built in (scoreboard, timers, `svg`,
  `.qn`, `.qk`, `[data-noedit]`); a lesson adds its own with
  `window.EDIT_EXCLUDE='.secs,#vFC,…'` at the top of its main.js.
- Not editable: SVG text (wheels, donuts, maps), counters, the scoreboard, and structure (adding a new
  card or tab is still a change Claude makes in the source).
- To fold edits back into the source, list them with `ArtifactData` (`collection: "edits"`), map each
  key to its element by rebuilding and hashing, change the source text, then delete the edit docs.

## Workflow

1. **Read the source.** A Claude Docs lesson document (a claude.ai artifact link): `read` the
   project, then its tab node with `payload {"kind":"view"}`; a long tab overflows the tool output
   and is saved to a file: strip the XML tags with a short Python script and read the text. A PDF:
   `pdftotext -layout`, `pdfimages -list` then `-png` for figures.
2. **Map the plan to slides**: title slide per section; one interactive slide per concept;
   activities with timers; book exercises with audio. Drop teacher-only material.
3. **Audio** for exercises: transcribe with `ielts-listening-review/scripts/transcribe.py`
   (sherpa-onnx Whisper; models from GitHub releases), then hand-correct and mark
   answers/traps. Encode mp3 mono 64k; artifacts do not serve `.m4a`.
4. **Write the lesson folder** (copy the closer example), put images/mp3 in `media/`. Keep
   content as data arrays in main.js and render from them.
5. **Build**: `python3 scripts/build_deck.py LESSON_DIR OUT_DIR --title "…"` (any other `*.js` in the
   lesson folder loads after main.js; edit mode loads last).
6. **Check once** with Playwright at 1280×720: step through every build slide (wait for
   animations), click each interactive control, look for overlapping text and for page errors;
   make a contact sheet of screenshots and look at it. For the route checker, evaluate
   `TownMap.walk` on 3–4 sample descriptions, including a wrong one. For edit mode: edit a static
   heading, a generated line, a button label (double-click), switch tabs and reload, then restore all.
7. **Publish** with the Artifact tool: `file_path` OUT_DIR/index.html, `files` = every media file,
   `capabilities: {db: {}, user: {}}` on the first publish (omit on redeploys to keep it). Then
   `ArtifactData list` on `edits`, once as yourself and once with `as_level: "view"`. Do not use
   the Slides artifact type: it cannot run these interactions or audio.
8. **Offline / "xuất file html"**: `python3 scripts/pack_offline.py OUT_DIR/index.html OUT.html`
   (inlines media and fonts), test it with the browser offline, send it with SendUserFile.
   Offline edits stay in that browser only; say so.

## Pitfalls met

- Sandbox network may block Wikimedia Commons: tell the user which hosts to allow
  (`commons.wikimedia.org`, `upload.wikimedia.org`) or ask for the photos.
- Don't commit textbook scans or copyrighted audio to a repository; keep them in `media/`
  locally.
- `pgrep -f name` matches the waiting shell itself; check with `ps -eo args | grep "[n]ame"`.
- Class-name collisions with `base-head.html` / `components.css`: `.a` (animation helper; keep
  answer spans `.ga`), `.tag` (`display:none` there; use `.ttag`), `.ex` (exit-ticket grid; use
  `.wex`), `.bandtag`. Grep the assets before naming a new class.
- `SVG <text>` with emoji renders as tofu in headless Chrome; keep map labels plain text.
- Route checker: a named place that is not ahead must stop the walker (no false ✓);
  "go straight on, take the first right" means the same junction.
- Invisible layers still catch clicks: an `opacity:0` sentence stacked over an idea, or a rotated
  SVG wheel whose box grows past its panel. Give hidden layers and decorative SVGs
  `pointer-events:none`.
- A `display:flex` box around a sentence turns each `<em>`/`<b>` into its own column: wrap the
  sentence in one `<span>` (or don't flex the text container).
- `contenteditable` inside a `<button>` cannot be edited reliably (space clicks the button): edit
  button text in a pop-up instead.
- When a slide's number of build steps depends on the selected tab, set `slide.dataset.steps` and
  reset `slide.dataset.step` on every tab switch, or → skips or repeats steps.
- Big `heredoc` blocks containing `rm`-like text or `$(…)` can be refused by the shell safety
  check; write helper scripts with the Write tool and run them.
