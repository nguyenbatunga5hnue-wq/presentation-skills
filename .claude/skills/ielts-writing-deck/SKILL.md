---
name: ielts-writing-deck
description: Build a teacher-controlled, interactive lesson deck for teaching an IELTS Writing skill (Task 1 static / dynamic charts, and the same pattern for other Writing lessons) from the teacher's theory notes and corrected student essays — charts redrawn in code that grow, split and ZOOM IN/OUT onto the figures being analysed, a two-way body-paragraph division tree, a click-two-bars comparison builder that shows the sentence frame before the full sentence, band 6.0 → 7.0 table linked straight to the matching student error, student paragraphs with clickable errors (comment first, fix on demand) and animated score bars, practice slides that give hints before answers, a linking-words summary diagram, a group scoreboard, timers, sound effects, an AI grader panel (Claude estimates a band for a typed sentence and re-grades after edits) and an offline single-file export. Use when the user asks for slides / a deck / "bài thuyết trình", "slides dạy writing", "dạy Writing Task 1", "chữa bài writing", or shares Writing theory notes or graded essays (Claude Docs links, PDFs, images) and wants them taught on screen.
---

# IELTS Writing lesson deck (teacher's house style)

One HTML page, published as an Artifact (plus an offline file). It is built with the
`interactive-lesson-deck` skill's shell (`../interactive-lesson-deck/assets/*`,
`scripts/build_deck.py`, `scripts/pack_offline.py`): read that SKILL.md first for the
general house style (teacher controls everything, title slides carry only the title, one
heading per slide, sound on every build step, scoreboard on slide 2 and key **B**,
Vietnamese UI with English examples). Reference build: `examples/static-chart/`
(Writing Task 1 · static chart: pie charts on game players, bar charts on citrus exports,
and a two-point bar chart on reservoir levels used for the student corrections).

## What the teacher asked for (keep doing this)

- **Lesson layout: Lý thuyết → Nâng band 6 lên 7 → Luyện tập.** The student corrections
  belong INSIDE the band 6 → 7 part, not in a separate part.
- **Charts move.** Redraw every chart in code (never paste a picture): bars grow, pie
  slices draw in and pop out, and the view **zooms in** onto the figures being analysed and
  **zooms out** to the whole chart. Any bar or slice can be clicked to zoom; **Z** or the
  "⤢ Thu nhỏ" pill zooms out.
- **Hints before answers, everywhere.** Never reveal a full answer on the first click.
  Comparison builder: sentence frame with X / Y / `___` and `43 − 20 = ?` first, the full
  sentence only after "Hiện câu đầy đủ", and a box where students write their own
  sentence. Quiz: 💡 hint first, then Đúng/Sai and the corrected sentence. Overview
  practice: a question per chart → its answer → a sentence frame → the model. Body
  practice: for each sentence its role and a frame with blanks → then the full sentence.
  Student errors: the comment first, "Cách sửa ▸" for the fix.
- **Body division in two ways only**: (1) by object / chart (theo đối tượng), (2) by
  category with a purposeful grouping (theo nhóm ngành, gom có chủ đích) whose criteria
  are size (độ lớn), gap (sự chênh lệch), shared nature (tính chất chung; the grouped
  total must be right).
- **Model body paragraphs teach linking between pairs of figures**: sentence 1 = topic
  sentence naming the grouping criterion; sentences 2, 3 (4) = one pair of figures each;
  the link between pairs is the point (similar trend: *followed a similar pattern,
  although …*, *Similarly*; contrast: *In stark contrast*, *By contrast*, *whereas*; move
  on: *Turning to*, *As for*). End with a summary diagram slide of sentence roles and
  links, applied to both body paragraphs.
- **Student work is anonymous**: "Bài 1", "Bài 2", never names. Score a paragraph
  excerpt as a paragraph (no penalty for word count or a missing overview when only one
  paragraph was quoted). Tag each error with its criterion (TA / C&C / LR / GRA).
- Band 6.0 / 7.0 table: each row has a "Bài học sinh ↗" button that opens the student
  slide on the matching error; student slides have "↩ Bảng 6.0 / 7.0".
- Keep a model essay the teacher says to keep unchanged (e.g. the pie-chart band 7
  essay); its sentences are clickable and zoom the chart to the data they describe.
- Drop slides the teacher no longer wants rather than restyling them; ask before adding
  an agenda, a hint line or a footnote.

## Components (in `examples/static-chart/main.js`, by section comment)

| Need | Where |
|---|---|
| Chart data + renderers: `pie`, horizontal `hbar`, grouped vertical `vg` (two time points, change badges) | `chart data`; sets in `SETS` (`data-chart="game|citrus|res|gender"`), charts addressed `chartId:key` |
| Zoom engine: `Z(wrap).show('typ:Action,Sports|gen:Male',{max})`, `.reset()`, `frameAround()` for Body 1 / Body 2 frames | `zoom engine`; markup `.zw > .zi > [data-chart]` |
| Step slides with stale-timer guard (`runStep`) and per-slide `STEP[id]=(s,n,enter)=>…` | `navigation` |
| Overview built from figures → general phrases; division tree; game / citrus division | `Part 1` |
| Comparison builder (frame → full sentence, ratio wording: twice / more than twice / approximately 1.6 times, percentage points, ghost copies and bracket on the bar) | `comparator` |
| Band table with links, sentence upgrade, student paragraphs (`ERR`, `CRIT`, rank re-ordering animation), score cards (`data-sc="TA,GRA,LR,CC,band"`) | `Part 2`, `student paragraphs`, `score cards` |
| Quiz with hint stage, overview / body practice with hint → full, linking map | `Part 3` |
| AI grader panel (`#grader`, key **G**) | `AI grader` |

## Workflow

1. **Read the sources.** Claude Docs links are docs: `read` the project, then its tab
   node. Chart images in a doc are blobs: `read` the blob for its asset id, then the
   Artifact tool `read` with `path` = that id saves the image. Write down every figure.
2. **Map to slides** using the layout above; one interactive slide per idea.
3. **Copy `examples/static-chart/`**, replace `CH` / `SETS`, the slide text, `ERR`, `BAND`
   targets, `QZ`, `OVP`, `BP`, and the grader's `CTX` (task + data per chart).
4. **Build**: `python3 ../interactive-lesson-deck/scripts/build_deck.py LESSON OUT --title "…"`.
5. **Check with Playwright at 1280×720**: step through every slide, wait ~1.5 s per step
   for zoom, click comparison bars, error spans, quiz "?" twice, practice steps. Stub
   `window.claude` in an init script to test the grader UI.
6. **Publish** `OUT/index.html` with the Artifact tool and `capabilities: {sample: {}}`
   (needed by the grader). Load the `artifact-capabilities` skill before touching it.
7. **Offline**: `pack_offline.py OUT/index.html FILE.html`; the grader hides itself there
   (no `window.claude`), say so to the teacher.

## Pitfalls met

- The page has no doctype (quirks mode): class names are matched case-insensitively and
  collide with the shell's classes. Already hit: `.a`/`.A`, `.sl`, `.verdict`, `.chip2`,
  `.fx`, `.who`, `.role`, `.rl`. Check new class names against `components.css` and
  `base-head.html` before using them.
- Zoom must measure with `offsetLeft/Top` relative to `.zi` (layout coordinates), not
  `getBoundingClientRect` (mid-transition values). SVG has no `offsetLeft`: zoom a pie by
  its `.ch` box, using the SVG viewBox ratio for the drawn width.
- Delayed effects (`setTimeout` inside step handlers) fire after the teacher has already
  moved on; `runStep` drops them when the step or slide changed.
- Add the `drawn` class before any early `return` in a render function, or bars stay at 0.
- Pie labels: anchor by `cos` with a small threshold and nudge small neighbouring slices
  (`[name, value, [dx, dy]]`); leave top margin in the viewBox for the title.
- Grader: one `sample.json` call per click (never on load or in a loop), prompt carries
  the task and every figure, asks for whole/half bands, Vietnamese problems and hints
  WITHOUT the corrected sentence, and one improved version shown only on request. Branch
  on error `code`; hide the button when `claude.use('sample')` is `null`.
- Do not commit students' original names; anonymise before saving an example.
