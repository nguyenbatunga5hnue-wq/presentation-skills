#!/usr/bin/env python3
"""Write slides.html for Unit 1 · Speaking Part 1 · Technique: Wh-words.

    python3 build_pics.py && python3 gen.py && \
    python3 ../../.claude/skills/interactive-lesson-deck/scripts/build_deck.py . OUT --title "Wh-words"

media/ holds the textbook photos (not committed): dish1-8.jpg, act1-9.jpg.
"""
import html, json, os, re
from content import *

HERE = os.path.dirname(os.path.abspath(__file__))
e = html.escape
KW = re.compile(r'\[\[(.+?)\]\]')
SPK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8a5 5 0 0 1 0 8M18.5 5.5a8.5 8.5 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
WHK = {k: (lb, vi, st) for k, lb, vi, st in WH}


def marked(t, cls='tgm'):
    return KW.sub(lambda m: f'<mark class="{cls}">{e(m.group(1))}</mark>', e(t))


def plain(t):
    return KW.sub(r'\1', t)


def pic(w):
    return f'<span class="pic" data-pic="{e(w)}"></span>'


def icon(k):
    return f'<i class="ico" data-icon="{k}"></i>' if k else ''


def title(t):
    return f'<section class="slide dark" data-title="{e(t)}" style="justify-content:center"><h1>{e(t)}</h1></section>'


def vocab(sid, heading, items):
    cards = ''.join(
        f'<button class="vc" aria-label="{e(w)}"><span class="in2"><span class="f">{pic(w)}<b>{e(w)}</b>'
        f'<small class="ipa">{e(pos + " · ") if pos else ""}{e(ipa)}</small>'
        f'<span class="say1" data-say="{e(w.replace("one’s", "one’s"))}" role="button" aria-label="Nghe">{SPK}</span></span>'
        f'<span class="bk"><b>{e(vi)}</b><span class="vex">{e(ex)}</span></span></span></button>'
        for w, pos, lv, ipa, vi, ex in items)
    return f'''<section class="slide" id="{sid}" data-title="{e(heading)}">
 <div class="hdr"><h2>{e(heading)}</h2><div class="tools"><button class="b" data-act="vc-all">Lật tất cả</button></div></div>
 <div class="vgrid g4">{cards}</div>
</section>'''


def photos(sid, heading, items, cols, bank):
    cells = ''.join(f'<button class="phc"><img src="{f}" alt=""><span class="phn">{i+1}</span><span class="phl">{e(lab)}</span></button>'
                    for i, (f, lab) in enumerate(items))
    return f'''<section class="slide" id="{sid}" data-title="{e(heading)}">
 <div class="hdr"><h2>{e(heading)}</h2><div class="tools minitimers"><div class="timer sm2" data-sec="120" data-label="Làm bài"></div><button class="b" data-act="ph-all">Đáp án</button></div></div>
 <div class="bank">{''.join(f'<span>{e(w)}</span>' for w in bank)}</div>
 <div class="phgrid" style="--c:{cols}">{cells}</div>
</section>'''


def guess(sid, heading, mode, items):
    gdata = [{'w': w, 'vi': vi} for w, pos, lv, ipa, vi, ex in items]
    dots = ''.join(f'<button class="gdot" data-gi="{i}">{i+1}</button>' for i in range(len(gdata)))
    cover = {'tiles': '<div class="tiles">' + ''.join(f'<button class="tile">{i+1}</button>' for i in range(12)) + '</div>',
             'spot': '<div class="spot"></div>', 'blur': ''}[mode]
    more = {'tiles': '<button class="b" data-act="g-open">Mở hết tranh</button>', 'spot': '<button class="b" data-act="g-open">Bật đèn</button>',
            'blur': '<button class="b" data-act="g-clear">Rõ hơn</button>'}[mode]
    return f'''<section class="slide gslide g-{mode}" id="{sid}" data-title="{e(heading)}">
 <div class="hdr"><h2>{e(heading)}</h2><div class="tools gdots">{dots}</div></div>
 <div class="gwrap">
  <div class="gpic"><div class="gimg pic"></div>{cover}</div>
  <div class="col gside">
   <div class="gword"></div><div class="gvi"></div>
   <div class="gbtns">{more}<button class="b" data-act="g-first">Chữ cái đầu</button><button class="b" data-act="g-vi">Nghĩa</button><button class="b pri" data-act="g-ans">Đáp án</button></div>
   <div class="gnav"><button class="b" data-act="g-prev">‹ Trước</button><button class="b" data-act="g-next">Sau ›</button></div>
  </div>
 </div>
 <script type="application/json" class="gdata">{json.dumps(gdata, ensure_ascii=False)}</script>
</section>'''


def gaps(sid, heading, rows, start, bank):
    r = ''.join(
        f'<div class="gp"><span class="qn">{start+i}</span><p>{e(a)} <button class="gk"><span class="kw">{e(k)}</span></button>{"" if b.startswith((".", ",", ";")) else " "}{e(b)}</p></div>'
        for i, (a, k, b) in enumerate(rows))
    return f'''<section class="slide" id="{sid}" data-title="{e(heading)}">
 <div class="hdr"><h2>{e(heading)}</h2><div class="tools minitimers"><div class="timer sm2" data-sec="120" data-label="Làm bài"></div><button class="b" data-act="gk-all">Đáp án</button></div></div>
 <div class="bank">{''.join(f'<span>{e(w)}</span>' for w in bank)}</div>
 <div class="gaps small">{r}</div>
</section>'''


def flower(center, fid):
    n = len(WH)
    ps = ''.join(f'<button class="petal" data-p="{k}" style="--a:{i*360/n}deg"><span class="ptx" style="--a:{i*360/n}deg">{icon(k)}<b>{e(lb)}</b></span></button>'
                 for i, (k, lb, vi, st) in enumerate(WH))
    return f'<div class="flower six" id="{fid}">{ps}<div class="core">{center}</div></div>'


S = ['<main id="viewport"><div id="stage">', title('Technique: Wh-words'),
     '''<section class="slide" id="sScore" data-title="Bảng điểm nhóm">
 <div class="hdr"><h2>Bảng điểm nhóm</h2>
  <div class="tools"><button class="b pri" id="scBack" hidden>↩ Quay lại</button><button class="b sm" data-act="sc-add">+ Thêm nhóm</button><button class="b sm" data-act="sc-del">− Bớt nhóm</button><button class="b sm" data-act="sc-reset">Về 0</button></div></div>
 <div class="board" id="board"></div>
</section>''']

# ================= FOOD =================
S.append(title('Food'))
S.append(vocab('vTaste', 'Flavours and tastes', [(w, '', '', ipa, vi, '') for w, ipa, vi in TASTES]))
S.append(photos('pTaste', 'Món này vị gì?', DISHES, 4, [w for w, _, _ in TASTES]))
S.append(vocab('vFood1', 'Food vocabulary (1)', FOOD_WORDS[:8]))
S.append(vocab('vFood2', 'Food vocabulary (2)', FOOD_WORDS[8:]))
S.append(vocab('vFood3', 'Food collocations', FOOD_COLLOC))
S.append(guess('gFood', 'Lật ô đoán từ', 'tiles', [FOOD_WORDS[i] for i in (0, 3, 6, 7, 10, 13)] + [FOOD_COLLOC[2], FOOD_COLLOC[5]]))
bank2 = [k for _, k, _ in EX2]
S.append(gaps('x2a', 'Exercise 2 (1–5)', EX2[:5], 1, sorted(bank2[:5])))
S.append(gaps('x2b', 'Exercise 2 (6–10)', EX2[5:], 6, sorted(bank2[5:])))

# ================= DAILY ACTIVITIES =================
S.append(title('Daily activities'))
S.append(photos('pRoutine', 'Exercise 3: Daily routine', ROUTINE, 3, sorted(l for _, l in ROUTINE)))
S.append(vocab('vDay1', 'Daily-life vocabulary (1)', DAILY_WORDS[:8]))
S.append(vocab('vDay2', 'Daily-life vocabulary (2)', DAILY_WORDS[8:]))
S.append(vocab('vDay3', 'Daily-life collocations', DAILY_COLLOC))
S.append(guess('gDay', 'Soi đèn pin', 'spot', [DAILY_WORDS[i] for i in (3, 4, 7, 10, 12)] + [DAILY_COLLOC[i] for i in (0, 1, 4)]))
tabs = ''.join(f'<button class="b sm{" on" if i == 0 else ""}" data-ri="{i}">{i+1}</button>' for i in range(len(EX4)))
S.append(f'''<section class="slide" id="x4" data-title="Exercise 4: Sắp xếp câu">
 <div class="hdr"><h2>Exercise 4: Sắp xếp câu</h2><div class="tools">{tabs}</div></div>
 <div class="rwrap">
  <div class="rline"></div>
  <div class="rpool"></div>
  <div class="rctl"><button class="b" data-act="r-reset">↺ Làm lại</button><button class="b pri" data-act="r-ans">Đáp án</button><div class="timer sm2" data-sec="60" data-label="Làm bài"></div></div>
 </div>
 <script type="application/json" id="rData">{json.dumps(EX4, ensure_ascii=False)}</script>
</section>''')

# ================= TECHNIQUE =================
S.append(title('Speaking Part 1'))
S.append(f'''<section class="slide" id="sExam" data-title="Exam information" data-steps="3">
 <div class="hdr"><h2>IELTS Speaking Part 1</h2><div class="tools"><button class="b pri" data-act="step">Tiếp ▸</button></div></div>
 <div class="exwrap">{pic('exam')}
  <div class="exlist">
   <div class="exi"><span class="exn">1</span><p>You will be asked some questions <b class="gk"><span class="kw">about yourself</span></b>.</p></div>
   <div class="exi"><span class="exn">2</span><p>You will be asked about a variety of <b class="gk"><span class="kw">familiar topics</span></b>: home, family, studies, hobbies…</p></div>
   <div class="exi"><span class="exn">3</span><p>Part 1 will last <b class="gk"><span class="kw">4–5 minutes</span></b>.</p></div>
  </div>
 </div>
</section>''')
chips = ''.join(f'<span class="whc" style="--i:{i}">{icon(k)}{e(lb)}</span>' for i, (k, lb, vi, st) in enumerate(WH))
S.append(f'''<section class="slide" id="sStrat" data-title="Technique: Wh-words" data-steps="2">
 <div class="hdr"><h2>Technique: Wh-words</h2><div class="tools"><button class="b pri" data-act="step">Tiếp ▸</button></div></div>
 <div class="stwrap">
  <div class="stbox"><p>To give a longer answer, you can use <b class="gk"><span class="kw">Wh-words</span></b>.</p>
   <p>You should think about: What, <b class="gk"><span class="kw">Why</span></b>, Where, When, <b class="gk"><span class="kw">Who</span></b>, or even <b class="gk"><span class="kw">How</span></b>.</p></div>
  <div class="whrow">{chips}</div>
 </div>
</section>''')
rows = ''.join(f'<div class="frow" data-p="{k}"><span class="fic" data-icon="{k}"></span><span class="fl"><b>{e(lb)}</b><small>{e(vi)}</small></span><p>{WH_DEMO[k]}</p></div>' for k, lb, vi, st in WH)
S.append(f'''<section class="slide" id="sFlower" data-title="Bông hoa Wh-words" data-steps="{len(WH)+1}">
 <div class="hdr"><h2>Mở rộng câu trả lời bằng Wh-words</h2><div class="tools"><button class="b pri" data-act="step">Tiếp ▸</button></div></div>
 <div class="flwrap">{flower('<span class="cq">Do you like chocolate?</span><span class="ca">Yes, I adore it!</span>', 'flDemo')}<div class="col flside"><div class="flist">{rows}</div></div></div>
</section>''')
# notes -> sentences
for n, (q, items) in enumerate(EX1, 1):
    rws = ''.join(f'<div class="nrow" style="--i:{i}"><span class="ntag{" ans" if not k else ""}">{icon(k)}{e(pr)}</span><span class="note2">{e(nt)}</span><span class="arr">→</span><p class="sent">{marked(md, "cn")}</p></div>'
                  for i, (pr, k, nt, md) in enumerate(items))
    full = ' '.join(plain(md) for _, _, _, md in items)
    S.append(f'''<section class="slide nslide" id="x1-{n}" data-title="Ghi chú → câu ({n})" data-steps="{len(items)*2}">
 <div class="hdr"><span class="qnum">Exercise 1 · {n}/4</span><div class="tools"><button class="b sm spk" data-say="{e(full)}">{SPK} Nghe</button><button class="b pri" data-act="step">Tiếp ▸</button></div></div>
 <div class="qbig"><h2>{e(q)}</h2></div>
 <div class="nrows">{rws}</div>
</section>''')

# ================= PRACTICE =================
S.append(title('Practice'))
PICK = []
for n, (topic, q, ideas) in enumerate(PRACTICE, 1):
    PICK.append({'t': topic, 'name': topic, 'q': q, 'k': [i for i, _ in ideas]})
    nodes = ''.join(f'{"<span class=chev>›</span>" if i else ""}<button class="tgt node" data-k="{e(idea)}" style="--i:{i}"><span class="ck"></span>{e(idea)}</button>' for i, (idea, _) in enumerate(ideas))
    model = ''.join(f'<span class="mk{i % 5}">{marked(m)}</span> ' for i, (_, m) in enumerate(ideas))
    full = ' '.join(plain(m) for _, m in ideas)
    S.append(f'''<section class="slide qslide" id="pq-{n}" data-title="{e(topic)} · {e(q)}" data-steps="{len(ideas)}" data-topic="{e(topic)}" data-q="{e(q)}">
 <div class="hdr"><span class="qnum">{e(topic)} · {n}/{len(PRACTICE)}</span><div class="tools minitimers"><div class="timer sm2" data-sec="30" data-label="Nói"></div></div></div>
 <div class="qgrid">
  <div class="col qmain">
   <div class="qbig"><h2>{e(q)}</h2><button class="b sm spk" data-say="{e(q)}" aria-label="Nghe câu hỏi">{SPK}</button></div>
   <div class="chain">{nodes}</div>
   <div class="model"><p class="mtext">{model}</p><button class="b sm msay spk" data-say="{e(full)}">{SPK} Nghe</button></div>
   <div class="qtools"><button class="b pri" data-act="step">Tiếp ▸</button><button class="b" data-act="q-model">Câu trả lời mẫu</button></div>
  </div>
  <div class="grade">
   <div class="lbl2">Chấm điểm</div>
   <div class="gwho"></div>
   <div class="crit"><span>Ý đã nói</span><b class="cnt">0/{len(ideas)}</b></div>
   <div class="crit"><span>Từ vựng</span><span class="stars" data-c="ext"><button>★</button><button>★</button></span></div>
   <div class="crit"><span>Trôi chảy</span><span class="stars" data-c="flu"><button>★</button><button>★</button></span></div>
   <div class="crit tot"><span>Tổng</span><b class="total">0</b></div>
   <textarea class="note" placeholder="Ghi chú" rows="3"></textarea>
   <button class="b pri" data-act="q-save">Cộng điểm &amp; lưu</button>
   <div class="saved"></div>
  </div>
 </div>
</section>''')

for sid, name, qs in [('f-food', 'Food', [p[1] for p in PRACTICE[:5]]), ('f-day', 'Daily life', [p[1] for p in PRACTICE[5:]])]:
    qbtn = ''.join(f'<button class="b sm{" on" if i == 0 else ""}" data-fq="{i}">{i+1}</button>' for i in range(len(qs)))
    S.append(f'''<section class="slide fstep" id="{sid}" data-title="Trả lời từng bước · {name}" data-qs="{e(json.dumps(qs, ensure_ascii=False))}">
 <div class="hdr"><h2>Trả lời từng bước · {name}</h2><div class="tools">{qbtn}</div></div>
 <div class="flwrap">{flower('<span class="cq"></span>', 'fl-'+sid)}
  <div class="col flside"><div class="task"></div><div class="flog"></div>
   <div class="fctl"><button class="b pri" data-act="f-next">Wh tiếp theo</button><button class="b" data-act="f-reset">↺ Làm lại</button><div class="timer sm2" data-sec="20" data-label="Nói"></div></div></div>
 </div>
</section>''')

topics = sorted({p[0] for p in PRACTICE}, key=[p[0] for p in PRACTICE].index)
S.append(f'''<section class="slide" id="sPick" data-title="Bốc thăm câu hỏi">
 <div class="hdr"><h2>Bốc thăm câu hỏi</h2><div class="tools">{''.join(f'<button class="b sm on" data-pt="{e(t)}">{e(t)}</button>' for t in topics)}</div></div>
 <div class="pickwrap">
  <div class="pickcard" id="pickCard"><span class="ptopic" id="pTopic"></span><div class="pq" id="pQ">?</div><div class="chips" id="pK"></div></div>
  <div class="col pickside"><button class="b pri big" data-act="pick">Bốc thăm</button><button class="b" data-act="pick-hint">Gợi ý</button><button class="b spk" data-act="pick-say">{SPK} Nghe</button><div class="timer" data-sec="30" data-label="Nói"></div></div>
 </div>
 <script type="application/json" id="pickData">{json.dumps(PICK, ensure_ascii=False)}</script>
</section>''')
S.append('''<section class="slide" id="sLog" data-title="Sổ ghi chú GV">
 <div class="hdr"><h2>Sổ ghi chú</h2><div class="tools"><button class="b" data-act="log-copy">Sao chép</button><button class="b" data-act="log-clear">Xoá sổ</button></div></div>
 <div class="logsum" id="logSum"></div>
 <div class="logtab"><table><thead><tr><th>Giờ</th><th>Nhóm</th><th>Câu hỏi</th><th>Ý đã nói</th><th>Điểm</th><th>Ghi chú</th></tr></thead><tbody id="logBody"></tbody></table></div>
</section>''')
S.append(title('Well done!'))
S.append(f'<script type="application/json" id="petalData">{json.dumps([dict(k=k, lb=lb, vi=vi, st=st) for k, lb, vi, st in WH], ensure_ascii=False)}</script>')
open(os.path.join(HERE, 'slides.html'), 'w', encoding='utf-8').write('\n'.join(S) + '\n')
print(len(S) - 2, 'slides')
