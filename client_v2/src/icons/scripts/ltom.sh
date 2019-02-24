#!/bin/bash
# Resize tiles from large to medium
# In: large dir
# Out: medium dir

[ -n "$1" ] || exit 1
[ -n "$2" ] || exit 1

for file in $1/tile[0-9][0-9][0-9][0-9].png; do
	name=$(basename $file)
	convert $file -background transparent -resize 24x24 -extent 32x32 $2/$name
	echo "Resized: $file"
done
echo "Done"
