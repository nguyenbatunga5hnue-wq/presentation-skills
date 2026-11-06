#!/bin/sh
# Build the deck: concatenates src/*.js into main.js, then assembles index.html in OUT (default ./build)
cd "$(dirname "$0")"
cat src/*.js > main.js
python3 ../../.claude/skills/interactive-lesson-deck/scripts/build_deck.py . "${1:-build}" --title "Uncommon topics"
