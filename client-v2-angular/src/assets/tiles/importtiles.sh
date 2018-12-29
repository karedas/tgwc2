#!/bin/bash

# Import tiles from an external dir, stripping data
#
# In: external dir
# Out: current working directory

if [ -z "$1" ]; then
	echo "Syntax: importtiles.sh <external dir name> <destination dir>"
	echo "Import tiles from an external dir, stripping data"
	exit 1
fi

if [ ! -d "$1" ]; then
	echo "$1 is not a directory!"
	exit 1
fi

if [ ! -d "$2" ]; then
	echo "$2 is not a directory!"
	exit 1
fi

for file in $1/tile[0-9][0-9][0-9][0-9].png; do
	name="$(basename $file)"
	if [ "$(identify -format '%m %wx%h' $file)" != "PNG 32x32" ]; then
		identify $file
		echo "Wrong format!"
	else
		convert "$file" -strip "$2/$name"
	fi
done
echo "Done"
