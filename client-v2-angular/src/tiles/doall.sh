#!/bin/bash

# Check, import, create sprites
#
# In: external dir
# Out: current working directory

if [ -z "$1" ]; then
	echo "Syntax: doall.sh <external dir name> <destination dir>"
	echo "Check, import, create sprites"
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

if ! ./checktiles.sh "$1"; then
	exit 1
fi

./importtiles.sh "$1" "$2"
./createsprites.sh "$2"
echo "Done"
