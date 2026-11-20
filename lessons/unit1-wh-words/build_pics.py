#!/usr/bin/env python3
"""Make pics.js = drawing kit from ../speaking-part1/pics.js + this unit's scenes.js."""
import os
H = os.path.dirname(os.path.abspath(__file__))
kit = open(os.path.join(H, '..', 'speaking-part1', 'pics.js'), encoding='utf-8').read()
head, rest = kit.split('const P={', 1)
tail = rest[rest.index('\nwindow.PICS={}'):]
scenes = open(os.path.join(H, 'scenes.js'), encoding='utf-8').read()
scenes = scenes[scenes.index('const P={'):]
tail = tail.replace('\n})();', "\nwindow.ICONS.how=window.ICONS.feel;\n})();")
open(os.path.join(H, 'pics.js'), 'w', encoding='utf-8').write(head + scenes + tail)
print('pics.js written')
