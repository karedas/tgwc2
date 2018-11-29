#!/bin/bash
# OLD script

[ -n "$1" ] || exit 1

if pushd $1; then
	for file in $(ls til[0-9]\.* 2> /dev/null); do
                name="tile000${file#tile}"
                mv "$file" "$name"
                echo "Rename: $file $name"
        done
	for file in $(ls tile[0-9][0-9]\.* 2> /dev/null); do
                name="tile00${file#tile}"
                mv "$file" "$name"
                echo "Rename: $file $name"
        done

	for file in $(ls tile[0-9][0-9][0-9]\.* 2> /dev/null); do
		name="tile0${file#tile}"
		mv "$file" "$name"
		echo "Rename: $file $name"
	done
	popd
	
	echo "Done"
fi
