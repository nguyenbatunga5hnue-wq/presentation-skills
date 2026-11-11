#!/usr/bin/env python3
"""Write slides.html for the Speaking Part 1 deck from content.py.

    python3 gen.py && python3 ../../.claude/skills/interactive-lesson-deck/scripts/build_deck.py . OUT --title "Speaking Part 1"
"""
import html, json, os, random, re
from content import TOPICS

HERE = os.path.dirname(os.path.abspath(__file__))
e = html.escape
KW = re.compile(r'\[\[(.+?)\]\]')

# petals of the answer flower: key, icon, label, Vietnamese cue, sentence starter
PETALS = [
    ('feel', '😊', 'Feeling', 'Cảm xúc', 'It makes me feel… / I really enjoy…'),
    ('why', '❓', 'Why', 'Vì sao', 'because… / The main reason is…'),
    ('when', '🕒', 'When', 'Khi nào', 'usually in the evening / at weekends'),
    ('who', '👥', 'Who', 'Với ai', 'with my friends / with my family'),
    ('where', '📍', 'Where', 'Ở đâu', 'at home / in the park / near my house'),
    ('what', '🔎', 'What', 'Cái gì', 'especially… / My favourite is…'),
    ('often', '🔁', 'How often', 'Bao lâu một lần', 'every day / twice a week / once a month'),
    ('eg', '💡', 'Example', 'Ví dụ', 'For example, … / Last week, I…'),
    ('past', '⏪', 'Past', 'Hồi nhỏ', 'When I was a child, I used to…'),
]
CINEMA = {
    'feel': 'It always makes me feel <u>relaxed and excited</u>.',
    'why': 'because I can enjoy films on a <u>really big screen</u>.',
    'when': 'I usually go <u>on Saturday evenings</u>.',
    'who': 'I often go <u>with my best friends</u>.',
    'where': 'There’s a cinema <u>in a shopping mall</u> near my house.',
    'what': 'My favourite films are <u>superhero movies</u>.',
    'often': 'I go about <u>twice a month</u>.',
    'eg': '<u>For example</u>, last week I watched a cartoon with my sister.',
    'past': '<u>When I was a child</u>, my parents took me there on my birthday.',
}


def keywords(parts):
    out = []
    for p in parts:
        for k in KW.findall(p):
            if k not in out:
                out.append(k)
    return out


def marked(part):
    return KW.sub(lambda m: f'<mark class="tgm">{e(m.group(1))}</mark>', e(part))


def plain(parts):
    return ' '.join(KW.sub(r'\1', p) for p in parts)


def flower(center_html, fid, with_text=False):
    n = len(PETALS)
    ps = ''.join(
        f'<button class="petal" data-p="{k}" style="--a:{i*360/n}deg;--i:{i}"><span class="ptx" style="--a:{i*360/n}deg"><i>{ic}</i><b>{e(lb)}</b></span></button>'
        for i, (k, ic, lb, vi, st) in enumerate(PETALS))
    return f'<div class="flower" id="{fid}">{ps}<div class="core">{center_html}</div></div>'


S = []
S.append('<main id="viewport"><div id="stage">')
S.append('<section class="slide dark" data-title="Speaking Part 1" style="justify-content:center"><h1>IELTS Speaking Part 1</h1></section>')
S.append('''<section class="slide" id="sScore" data-title="Bảng điểm nhóm">
 <div class="hdr"><h2>Bảng điểm nhóm</h2>
  <div class="tools"><button class="b pri" id="scBack" hidden>↩ Quay lại</button><button class="b sm" data-act="sc-add">+ Thêm nhóm</button><button class="b sm" data-act="sc-del">− Bớt nhóm</button><button class="b sm" data-act="sc-reset">Về 0</button></div></div>
 <div class="board" id="board"></div>
</section>''')

# ---- answer formula A-R-E ----
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

# ---- answer flower: centre = direct answer, petals = ways to extend ----
rows = ''.join(f'<div class="frow" data-p="{k}"><span class="fic">{ic}</span><span class="fl"><b>{e(lb)}</b><small>{e(vi)}</small></span><p>{CINEMA[k]}</p></div>'
               for k, ic, lb, vi, st in PETALS)
S.append(f'''<section class="slide" id="sFlower" data-title="Bông hoa mở rộng" data-steps="{len(PETALS)+2}">
 <div class="hdr"><h2>Bông hoa mở rộng câu trả lời</h2><div class="tools"><button class="b pri" data-act="step">Tiếp ▸</button></div></div>
 <div class="flwrap">
  {flower('<span class="cq">Do you like going to the cinema?</span><span class="ca">Yes, I love it!</span><small>Direct answer</small>', 'flDemo')}
  <div class="col flside"><div class="flist">{rows}</div><div class="fnote">Chọn <b>2–3 cánh hoa</b> là đủ cho một câu Part 1.</div></div>
 </div>
</section>''')

PICK = []
for t in TOPICS:
    tid, V = t['id'], t['vocab']
    S.append(f'<section class="slide dark" data-title="{e(t["name"])}" style="justify-content:center"><h1>{t["icon"]} {e(t["name"])}</h1></section>')

    # 1) guess the word from a picture hidden under tiles
    gdata = [{'pic': p, 'w': w, 'vi': vi} for p, w, vi, ex in V]
    dots = ''.join(f'<button class="gdot" data-gi="{i}">{i+1}</button>' for i in range(len(V)))
    S.append(f'''<section class="slide gslide" id="g-{tid}" data-title="{e(t["name"])} · Đoán từ qua tranh">
 <div class="hdr"><h2>Nhìn tranh, đoán từ</h2><div class="tools gdots">{dots}</div></div>
 <div class="gwrap">
  <div class="gpic"><div class="gimg"></div><div class="tiles">{''.join(f'<button class="tile">{i+1}</button>' for i in range(12))}</div></div>
  <div class="col gside">
   <div class="gword"></div>
   <div class="gvi"></div>
   <div class="gbtns"><button class="b" data-act="g-open">🖼 Mở hết tranh</button><button class="b" data-act="g-first">🔤 Chữ cái đầu</button><button class="b" data-act="g-vi">🇻🇳 Nghĩa</button><button class="b pri" data-act="g-ans">✅ Đáp án</button></div>
   <div class="gnav"><button class="b" data-act="g-prev">‹ Tranh trước</button><button class="b" data-act="g-next">Tranh sau ›</button></div>
  </div>
 </div>
 <script type="application/json" class="gdata">{json.dumps(gdata, ensure_ascii=False)}</script>
</section>''')

    # 2) learn: flip cards
    cards = ''.join(
        f'<button class="vc" aria-label="{e(w)}"><span class="in2"><span class="f"><i class="em">{ic}</i><b>{e(w)}</b>'
        f'<span class="say1" data-say="{e(w)}" role="button" aria-label="Nghe">🔊</span></span>'
        f'<span class="bk"><b>{e(vi)}</b><span class="vex">{e(ex)}</span></span></span></button>'
        for ic, w, vi, ex in V)
    S.append(f'''<section class="slide" id="v-{tid}" data-title="{e(t["name"])} · Từ vựng">
 <div class="hdr"><h2>Từ vựng: {e(t["name"])}</h2><div class="tools"><button class="b" data-act="vc-all">Lật tất cả</button></div></div>
 <div class="vgrid">{cards}</div>
</section>''')

    # 3) memory: which card was turned face down?
    mcards = ''.join(
        f'<button class="mc" data-w="{e(w)}"><span class="in2"><span class="f"><i class="em">{ic}</i><b>{e(w)}</b></span><span class="bk">?</span></span></button>'
        for ic, w, vi, ex in V)
    S.append(f'''<section class="slide mslide" id="m-{tid}" data-title="{e(t["name"])} · Từ nào bị úp?">
 <div class="hdr"><h2>Từ nào vừa bị úp?</h2><div class="tools minitimers"><div class="timer sm2" data-sec="20" data-label="Ghi nhớ"></div>
  <button class="b" data-act="m-hide1">Úp 1 thẻ</button><button class="b" data-act="m-hide2">Úp 2 thẻ</button><button class="b" data-act="m-all">Úp hết</button><button class="b" data-act="m-shuf">🔀 Xáo</button><button class="b pri" data-act="m-open">Mở hết</button></div></div>
 <div class="mgrid">{mcards}</div>
</section>''')

    # 4) quick gap-fill check
    bank = [g[1] for g in t['gaps']]
    random.Random(tid).shuffle(bank)
    rows = ''.join(
        f'<div class="gp"><span class="qn">{i+1}</span><p>{e(a)} <button class="gk"><span class="kw">{e(k)}</span></button>{"" if b.startswith((".", ",")) else " "}{e(b)}</p></div>'
        for i, (a, k, b) in enumerate(t['gaps']))
    S.append(f'''<section class="slide" id="c-{tid}" data-title="{e(t["name"])} · Điền từ">
 <div class="hdr"><h2>Điền từ: {e(t["name"])}</h2><div class="tools minitimers"><div class="timer sm2" data-sec="90" data-label="Làm bài"></div><button class="b" data-act="gk-all">Hiện đáp án</button></div></div>
 <div class="bank">{''.join(f'<span>{e(w)}</span>' for w in bank)}</div>
 <div class="gaps">{rows}</div>
</section>''')

    # 5) speaking practice: question + must-say phrases + teacher scoring
    for n, (q, parts) in enumerate(t['qs'], 1):
        kws = keywords(parts)[:4]
        PICK.append({'t': tid, 'name': t['name'], 'q': q, 'k': kws})
        tg = ''.join(f'<button class="tgt" data-k="{e(k)}" style="--i:{i}"><span class="ck"></span>{e(k)}</button>' for i, k in enumerate(kws))
        arows = ''.join(f'<div class="arow r{L}"><span class="atag">{L.upper()}</span><p>{marked(p)}</p></div>' for L, p in zip('are', parts))
        S.append(f'''<section class="slide qslide" id="q-{tid}-{n}" data-title="{e(t["name"])} · Câu {n}" data-steps="1" data-topic="{e(t["name"])}" data-q="{e(q)}">
 <div class="hdr"><span class="qnum">{t["icon"]} {e(t["name"])} · {n}/4</span><div class="tools minitimers"><div class="timer sm2" data-sec="30" data-label="Nói"></div></div></div>
 <div class="qgrid">
  <div class="col qmain">
   <div class="qbig"><h2>{e(q)}</h2><button class="b sm" data-say="{e(q)}">🔊</button></div>
   <div class="lbl2 tlbl">Cụm từ phải nói · GV bấm khi học sinh nói được</div>
   <div class="tgts">{tg}</div>
   <div class="model arerows">{arows}<button class="b sm msay" data-say="{e(plain(parts))}">🔊 Nghe câu mẫu</button></div>
   <div class="qtools"><button class="b pri" data-act="step">Hiện cụm từ ▸</button><button class="b" data-act="q-model">Câu trả lời mẫu</button></div>
  </div>
  <div class="grade">
   <div class="lbl2">Chấm điểm</div>
   <div class="gwho"></div>
   <div class="crit"><span>Cụm từ</span><b class="cnt">0/{len(kws)}</b></div>
   <div class="crit"><span>Mở rộng 🌸</span><span class="stars" data-c="ext"><button>★</button><button>★</button></span></div>
   <div class="crit"><span>Trôi chảy</span><span class="stars" data-c="flu"><button>★</button><button>★</button></span></div>
   <div class="crit tot"><span>Tổng</span><b class="total">0</b></div>
   <textarea class="note" placeholder="Ghi chú: lỗi phát âm, ngữ pháp, từ hay…" rows="3"></textarea>
   <button class="b pri" data-act="q-save">＋ Cộng điểm &amp; lưu</button>
   <div class="saved"></div>
  </div>
 </div>
</section>''')

    # 6) answer step by step with the flower
    qbtn = ''.join(f'<button class="b sm{" on" if i == 0 else ""}" data-fq="{i}">Câu {i+1}</button>' for i in range(4))
    S.append(f'''<section class="slide fstep" id="f-{tid}" data-title="{e(t["name"])} · Mở rộng từng bước" data-qs="{e(json.dumps([q for q, _ in t["qs"]], ensure_ascii=False))}">
 <div class="hdr"><h2>Trả lời từng bước</h2><div class="tools">{qbtn}</div></div>
 <div class="flwrap">
  {flower('<span class="cq"></span><small>Trả lời thẳng trước</small>', 'fl-'+tid)}
  <div class="col flside">
   <div class="task"><span class="tn">1</span><div><b>Trả lời thẳng</b><p>Yes / No + một ý ngắn</p></div></div>
   <div class="flog"></div>
   <div class="fctl"><button class="b pri" data-act="f-next">🌸 Cánh tiếp theo</button><button class="b" data-act="f-reset">↺ Làm lại</button><div class="timer sm2" data-sec="20" data-label="Nói"></div></div>
  </div>
 </div>
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

# ---- teacher's notebook ----
S.append('''<section class="slide" id="sLog" data-title="Sổ ghi chú GV">
 <div class="hdr"><h2>Sổ ghi chú của giáo viên</h2><div class="tools"><button class="b" data-act="log-copy">📋 Sao chép</button><button class="b" data-act="log-clear">🗑 Xoá sổ</button></div></div>
 <div class="logsum" id="logSum"></div>
 <div class="logtab"><table><thead><tr><th>Giờ</th><th>Nhóm / HS</th><th>Câu hỏi</th><th>Cụm từ đã nói</th><th>Điểm</th><th>Ghi chú</th></tr></thead><tbody id="logBody"></tbody></table></div>
</section>''')
S.append('<section class="slide dark" data-title="Kết thúc" style="justify-content:center"><h1>Well done!</h1></section>')

S.append(f'<script type="application/json" id="petalData">{json.dumps([dict(k=k, ic=ic, lb=lb, vi=vi, st=st) for k, ic, lb, vi, st in PETALS], ensure_ascii=False)}</script>')
open(os.path.join(HERE, 'slides.html'), 'w', encoding='utf-8').write('\n'.join(S) + '\n')
print(len(S) - 2, 'slides')
