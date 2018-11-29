#!/bin/bash
# Create a sprite from a dir containing tiles

[ -n "$1" ] || exit 1
[ -n "$2" ] || exit 1
which montage || exit 1

montage $1/tile[0-9][0-9][0-9][0-9].png -geometry +0+0 -background transparent -bordercolor transparent -tile 128x $2 && echo "Done" || echo "Error"
