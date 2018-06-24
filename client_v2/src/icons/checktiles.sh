#!/bin/bash

# Check tiles in an enternal dir
# Check input tiles for "holes" in numbering
# Check size to be 32x32 pixels and format PNG
#
# In: external dir

if [ -z "$1" ]; then
	echo "Syntax: checktiles.sh <dir name>"
	echo "Check tiles from an external dir"
	exit 1
fi

if [ ! -d "$1" ]; then
	echo "$1 is not a directory!"
	exit 1
fi

TILE_DIR="$(dirname $1)/$(basename $1)"

LAST_TILE="$(ls $TILE_DIR/tile[0-9][0-9][0-9][0-9]\.png | sort | tail -1)"
LAST_TILE="${LAST_TILE##$TILE_DIR/tile}"
LAST_TILE="${LAST_TILE%%.png}"

echo "Last tile is: $LAST_TILE"
echo "Check for missing tiles:"
for i in $(seq -w 0 $LAST_TILE); do
	if [ ! -f "$TILE_DIR/tile$i.png" ]; then
		echo "Missing $i, adding empty tile" ;
		cp "$TILE_DIR/tileinv.png" "$TILE_DIR/tile$i.png"
	fi;
done

ERRORS=0

echo "Check for wrong format:"
for file in $1/tile[0-9][0-9][0-9][0-9]\.png; do
	if [ "$(identify -format '%m %wx%h' $file)" != "PNG 32x32" ]; then
		identify $file
		echo "Wrong format!"
		ERRORS=$(($ERRORS + 1))
	fi
done
echo "Errors: $ERRORS"

if [ $ERRORS -gt 0 ]; then
	exit 1
fi

exit 0
