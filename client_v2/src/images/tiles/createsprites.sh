#!/bin/bash

# Create all tile sprites
# In: large dir
# Out: tiles.png tiles_m.png tile_s.png

if [ ! -d large ]; then
	echo "Can't find large dir"
	exit 1
fi

echo "Creating medium icons"
mkdir -p medium
./scripts/ltom.sh large medium

echo "Creating small icons"
mkdir -p small
./scripts/ltos.sh large small

echo "Generating sprites"
./scripts/generatetiles.sh large/ tiles.png

echo "Removing temporary dirs"
rm -rf medium small
