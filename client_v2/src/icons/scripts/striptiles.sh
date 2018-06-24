#!/bin/bash
# OLD script

[ -n "$1" ] || exit 1

for file in $1/tile[0-9][0-9][0-9][0-9].png; do
	tmp=/tmp/$(basename $file)
	convert $file -strip $tmp
	mv $tmp $file
	echo "Stripped: $file"
done
echo "Done"
