K = lambda s: f'<mark class="k">{s}</mark>'
T = lambda s: f'<mark class="t">{s}</mark>'
P = lambda s: f'<mark class="p">{s}</mark>'
EX = [
 {"id": "cu1", "file": "checkup1.mp3", "title": "Check-up 1 · Questions 8–10", "page": "trang 56", "img": "book-016.png", "qs": [("8", ["garden centre","sky garden","rooftop bar"], 0), ("9", ["library","main house","school"], 2), ("10", ["botanical","vegetable","green"], 1)], "task": "Complete the map. NO MORE THAN THREE WORDS AND/OR A NUMBER.",
  "tip": "Điểm xuất phát: đi vào làng từ đường cao tốc ở phía <b>đông</b>. Theo dõi thứ tự: church → railway crossing → river → school → bridge → turning on the left → vegetable gardens → spa.",
  "lines": [(0.8, "A", "Would you like me to tell you how to get to the hotel once you’re in the village? It’s a bit difficult to find."),
            (6.8, "B", "Oh, yes please. I have maps on my mobile phone, but there isn’t always a signal."),
            (12.6, "A", "Well, " + P("coming into the village from the motorway") + ", which is in the " + K("east") + ", the first building you see " + P("on your right") + " is the " + K("church") + ". It’s right " + P("opposite") + " the " + K("garden centre") + "."),
            (22.6, "B", "Okay, church on my right and the garden centre on my left."),
            (27.5, "A", "Yes. " + P("Just after that") + ", you’ll come to the " + K("railway crossing") + ", and then you’ll see the " + K("river") + " " + P("on your left") + "."),
            (34.5, "A", P("After that on the right") + ", you’ll see the " + K("school") + ", " + P("before the bridge") + " over the river."),
            (39.7, "B", "So the school’s before the bridge? — Yes, that’s right."),
            (43.4, "A", P("Just after the bridge") + " you’ll see a " + P("turning on your left") + ". Take that and follow the road through the fields."),
            (51.0, "A", P("On your left, between the road and the river") + ", you’ll see a lot of " + K("vegetable gardens") + "."),
            (55.8, "A", "Just keep going down the road " + P("to the end") + ". It leads straight into the " + K("car park") + " at the spa. You can’t miss it.")]},
 {"id": "ex1", "file": "exercise1.mp3", "title": "Exercise 1 · Questions 5–7", "page": "trang 58", "img": "book-019.png", "qs": [("5", ["Kitchen","Lobby","Dance Studios"], 2), ("6", ["Swimming Pool","Toilet","Changing Rooms"], 2), ("7", ["Tennis Courts","Kitchen","Library"], 0)], "task": "Label the map. NO MORE THAN TWO WORDS AND/OR A NUMBER.",
  "tip": "Bẫy sửa lỗi: “behind the swimming pool” → <b>“No, sorry, I meant opposite the swimming pool”</b>.",
  "lines": [(0.4, "L", "Now, some of you won’t have been to Park Hill Leisure Centre before, so let me just tell you a little about the layout."),
            (7.4, "L", "As you can see, the " + K("reception area") + " here is very spacious and there is plenty of room to meet your friends and have a drink."),
            (16.2, "L", "We also have brand new " + K("dance studios") + " with floor to ceiling mirrors and the latest audio equipment."),
            (24.1, "L", "The dance studios are " + P("to the left of") + " the reception area, " + T("behind the swimming pool") + "."),
            (29.8, "L", "<b>No, sorry, I meant</b> " + P("opposite") + " the " + K("swimming pool") + "."),
            (33.9, "L", "Both the roller skating and skateboarding classes will be held in the " + K("Skate Arena") + "."),
            (39.7, "L", "This has also been refurbished and we have a new 5-metre ramp in there, which is proving to be popular."),
            (46.7, "L", "The arena is " + P("behind") + " the " + K("changing rooms") + ", which you can see behind us, " + P("between") + " the " + K("gym") + " and " + K("tennis courts") + "."),
            (54.0, "L", "The tennis courts are " + P("on the right of") + " the arena. You’ll see both of these new spaces on the tour later.")]},
 {"id": "ex3", "file": "exercise3.mp3", "title": "Exercise 3 · Questions 1–5", "page": "trang 59", "img": "book-022.png", "qs": [("1", ["school campus","bowling alley"], 1), ("2", ["university","park"], 1), ("3", ["Elm Tree Café","Mine Tree Café"], 0), ("4", ["leisure centre","swimming baths"], 0), ("5", ["leisure centre","swimming baths"], 1)], "task": "Write the name of the place from the map. Có đáp án nhiễu.",
  "tip": "Hai bẫy: “turn left — oh, nope, sorry — that’s the <b>garage</b>” và “don’t get it confused with the <b>swimming baths</b>”.",
  "lines": [(1.0, "S", "Hi Jane, how are you settling into life at university?"),
            (4.8, "J", "Fine, except I don’t really know what there is to do in town. I haven’t had time to look around yet. You’ve been here for a year, could you give me some ideas?"),
            (16.0, "S", "Of course! There’s lots of places for students. Firstly, if you " + P("go across the bridge") + " over the river outside the campus and " + T("turn left") + " — <b>oh, nope, sorry</b> — that’s the " + T("garage") + "."),
            (26.1, "S", P("Turn right") + ", then you’ll get to the " + K("bowling alley") + ", which is really popular at the weekends because it’s so close to the campus."),
            (33.5, "S", "On Friday nights they have a special discount for students."),
            (42.0, "S", "In that case there’s a running track " + P("behind") + " the university campus, and I think they have a badminton court at the sports centre."),
            (53.8, "J", "Actually, I’m happy just to run in the park."),
            (56.5, "S", "Well, there’s a large park in town too. If you " + P("go down the road opposite the bowling alley") + " and " + P("take the first right") + ", then you’ll get to the " + K("park") + "."),
            (66.1, "S", "It’s big and there’s a lake in it. You can take a boat out on it."),
            (78.6, "S", "There’s the " + K("Elm Tree Café") + ", which is " + P("down the road from the post office") + " " + P("in the opposite direction from the river") + "."),
            (85.5, "S", "The café is " + P("on a fork") + " in the main road, and it’s quite an institution round here."),
            (103.4, "S", "You like sport, so I should mention the " + K("Leisure Centre") + ". Don’t get it confused with the " + T("swimming baths") + ", which are " + P("down the road from the supermarket") + ". The Leisure Centre is " + P("opposite") + ".")]},
]

def html():
    out = ''
    for e in EX:
        L='ABC'
        qs = ''.join(f'<div class="exq"><b>{n}</b>' + ''.join(f'<button class="opt2{" ok" if i==k else ""}"><i>{L[i]}</i>{o}</button>' for i, o in enumerate(opts)) + '</div>' for n, opts, k in e['qs'])
        lines = ''.join(f'<div class="ln" data-t="{t}"><span class="tm">{int(t//60)}:{int(t%60):02d}</span><span class="sp">{sp}</span><span>{h}</span></div>' for t, sp, h in e['lines'])
        out += f'''<section class="slide exslide" data-title="{e['title'].split(' · ')[0]}" data-audio="{e['file']}">
 <div class="hdr"><h2>{e['title']}</h2>
  <div class="tools"><button class="b pri" data-act="ex-play">▶ Phát</button><button class="b" data-act="ex-back">−5s</button><button class="b sm" data-act="ex-speed">1×</button><button class="b" data-act="ex-cc">CC phụ đề</button><button class="b" data-act="ex-mark">Đánh dấu bẫy</button></div></div>
 <div class="exbar"><span class="extime">0:00</span><input type="range" class="exseek" min="0" max="100" step="0.1" value="0" aria-label="Vị trí audio"><span class="extask">{e['task']}</span></div>
 <div class="exwrap">
  <div class="expage"><img src="{e['img']}" alt="Bản đồ trong sách, {e['page']}"><span class="pgref">IELTS Fighter · Unit 4 · {e['page']}</span></div>
  <div class="col" style="gap:.7cqi;min-height:0">
   <div class="exqs">{qs}<div class="row" style="gap:.5cqi"><button class="b sm" data-act="ex-ans">Đáp án</button><button class="b sm" data-act="ex-clear">Xoá chọn</button></div></div>
   <div class="extip" hidden>{e['tip']}</div>
   <div class="exsubs subs" hidden>{lines}</div>
  </div>
 </div>
</section>
'''
    return out
