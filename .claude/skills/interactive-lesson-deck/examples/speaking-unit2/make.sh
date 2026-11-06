#!/bin/sh
# Build the deck. main.js and extra.css are generated: lesson sources + the skill's comic kit.
#   ./make.sh [OUT_DIR]   (default ./build)
cd "$(dirname "$0")"
A=../../assets
cat src/0-core.js src/1-space.js $A/comic-draw.js src/3-stories.js $A/comic-story.js src/4-speak.js src/5-tail.js > main.js
cat $A/comic-kit.css src/lesson.css > extra.css
python3 ../../scripts/build_deck.py . "${1:-build}" --title "Uncommon topics"
