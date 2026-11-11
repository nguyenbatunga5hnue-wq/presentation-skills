#!/usr/bin/env python3
"""Write slides.html for the Speaking Part 1 deck from content.py.

    python3 gen.py && python3 ../../.claude/skills/interactive-lesson-deck/scripts/build_deck.py . OUT --title "Speaking Part 1"
"""
import html, json, os, random, re
from content import TOPICS

HERE = os.path.dirname(os.path.abspath(__file__))
e = html.escape
KW = re.compile(r'\[\[(.+?)\]\]')
ARE = [('A', 'Answer', 'Trả lời thẳng'), ('R', 'Reason', 'Lý do'), ('E', 'Example', 'Ví dụ, thêm ý')]


def keywords(parts):
    out = []
    for p in parts:
        for k in KW.findall(p):
            if k not in out:
                out.append(k)
    return out


def frame(part):
    """A sentence whose [[keywords]] become click-to-reveal blanks."""
    return KW.sub(lambda m: f'<button class="gk"><span class="kw">{e(m.group(1))}</span></button>', e(part))


def plain(parts):
    return ' '.join(KW.sub(r'\1', p) for p in parts)


S = []
S.append('<main id="viewport"><div id="stage">')
S.append('<section class="slide dark" data-title="Speaking Part 1" style="justify-content:center"><h1>IELTS Speaking Part 1</h1></section>')
S.append('''<section class="slide" id="sScore" data-title="Bảng điểm nhóm">
 <div class="hdr"><h2>Bảng điểm nhóm</h2>
  <div class="tools"><button class="b pri" id="scBack" hidden>↩ Quay lại</button><button class="b sm" data-act="sc-add">+ Thêm nhóm</button><button class="b sm" data-act="sc-del">− Bớt nhóm</button><button class="b sm" data-act="sc-reset">Về 0</button></div></div>
 <div class="board" id="board"></div>
</section>''')

# ---- answer formula A-R-E, built step by step ----
S.append('''<section class="slide" id="sARE" data-title="Công thức A – R – E" data-steps="4">
 <div class="hdr"><h2>Trả lời Part 1: A – R – E</h2><div class="tools"><button class="b pri" data-act="step">Tiếp ▸</button></div></div>
 <div class="arewrap">
  <div class="examiner"><div class="avatar" style="background:var(--t5)">GV</div><div class="exq">Do you like going to the cinema?</div></div>
  <div class="short"><span class="say">Yes.</span><span class="bad">Quá ngắn!</span></div>
  <div class="arerows">
   <div class="arow ra"><span class="atag">A</span><div><b>Answer</b> · trả lời thẳng<p>Yes, I <u>love</u> it.</p></div></div>
   <div class="arow rr"><span class="atag">R</span><div><b>Reason</b> · lý do<p>It’s a <u>great way to relax</u> after a long week.</p></div></div>
   <div class="arow re"><span class="atag">E</span><div><b>Example</b> · ví dụ, thêm ý<p>I usually go <u>with my friends</u> on Saturday evenings.</p></div></div>
  </div>
  <div class="aremeter"><div class="mbar"><i></i></div><span>2–3 câu · 15–20 giây</span></div>
 </div>
</section>''')

PICK = []
for t in TOPICS:
    tid = t['id']
    S.append(f'<section class="slide dark" data-title="{e(t["name"])}" style="justify-content:center"><h1>{t["icon"]} {e(t["name"])}</h1></section>')
    # vocabulary flip cards
    cards = ''.join(
        f'<button class="vc" aria-label="{e(w)}"><span class="in2"><span class="f"><i class="em">{ic}</i><b>{e(w)}</b>'
        f'<span class="say1" data-say="{e(w)}" role="button" aria-label="Nghe">🔊</span></span>'
        f'<span class="bk"><b>{e(vi)}</b><span class="vex">{e(ex)}</span></span></span></button>'
        for ic, w, vi, ex in t['vocab'])
    S.append(f'''<section class="slide" id="v-{tid}" data-title="{e(t["name"])} · Từ vựng">
 <div class="hdr"><h2>Từ vựng: {e(t["name"])}</h2><div class="tools"><button class="b" data-act="vc-all">Lật tất cả</button></div></div>
 <div class="vgrid">{cards}</div>
</section>''')
    # quick vocab check
    bank = [g[1] for g in t['gaps']]
    random.Random(tid).shuffle(bank)
    rows = ''.join(
        f'<div class="gp"><span class="qn">{i+1}</span><p>{e(a)} <button class="gk"><span class="kw">{e(k)}</span></button>{"" if b.startswith((".", ",")) else " "}{e(b)}</p></div>'
        for i, (a, k, b) in enumerate(t['gaps']))
    S.append(f'''<section class="slide" id="c-{tid}" data-title="{e(t["name"])} · Kiểm tra từ">
 <div class="hdr"><h2>Điền từ: {e(t["name"])}</h2><div class="tools minitimers"><div class="timer sm2" data-sec="90" data-label="Làm bài"></div><button class="b" data-act="gk-all">Hiện đáp án</button></div></div>
 <div class="bank">{''.join(f'<span>{e(w)}</span>' for w in bank)}</div>
 <div class="gaps">{rows}</div>
</section>''')
    # one slide per question
    for n, (q, parts) in enumerate(t['qs'], 1):
        kws = keywords(parts)
        PICK.append({'t': tid, 'name': t['name'], 'q': q, 'k': kws})
        chips = ''.join(f'<span class="chip3" style="--i:{i}">{e(k)}</span>' for i, k in enumerate(kws))
        arows = ''.join(
            f'<div class="arow r{L.lower()}"><span class="atag">{L}</span><p>{frame(p)}</p></div>'
            for (L, _, _), p in zip(ARE, parts))
        S.append(f'''<section class="slide qslide" id="q-{tid}-{n}" data-title="{e(t["name"])} · Câu {n}" data-steps="3">
 <div class="hdr"><span class="qnum">{t["icon"]} {n}/4</span><div class="tools minitimers"><div class="timer sm2" data-sec="30" data-label="Nói"></div></div></div>
 <div class="qbig"><h2>{e(q)}</h2><button class="b sm" data-say="{e(q)}">🔊 Nghe câu hỏi</button></div>
 <div class="hintrow"><span class="lbl2">Từ gợi ý</span><div class="chips">{chips}</div></div>
 <div class="arerows qare">{arows}</div>
 <div class="qtools"><button class="b pri" data-act="step">Tiếp ▸</button><button class="b" data-say="{e(plain(parts))}">🔊 Câu trả lời mẫu</button></div>
</section>''')

# ---- random question game ----
topics_btn = ''.join(f'<button class="b sm on" data-pt="{t["id"]}">{t["icon"]} {e(t["name"])}</button>' for t in TOPICS)
S.append(f'''<section class="slide" id="sPick" data-title="Bốc thăm câu hỏi">
 <div class="hdr"><h2>Bốc thăm câu hỏi</h2><div class="tools">{topics_btn}</div></div>
 <div class="pickwrap">
  <div class="pickcard" id="pickCard"><span class="ptopic" id="pTopic"></span><div class="pq" id="pQ">Bấm “Bốc thăm” để bắt đầu</div><div class="chips" id="pK"></div></div>
  <div class="col pickside">
   <button class="b pri big" data-act="pick">🎲 Bốc thăm</button>
   <button class="b" data-act="pick-hint">💡 Gợi ý</button>
   <button class="b" data-act="pick-say">🔊 Nghe câu hỏi</button>
   <div class="timer" data-sec="30" data-label="Nói"></div>
  </div>
 </div>
 <script type="application/json" id="pickData">{json.dumps(PICK, ensure_ascii=False)}</script>
</section>''')
S.append('<section class="slide dark" data-title="Kết thúc" style="justify-content:center"><h1>Well done!</h1></section>')

open(os.path.join(HERE, 'slides.html'), 'w', encoding='utf-8').write('\n'.join(S) + '\n')
print(len(S) - 1, 'slides')
