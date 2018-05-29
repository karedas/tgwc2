#!/bin/bash

which montage || exit 1
montage cmds/*.png -geometry +0+0 -background transparent -bordercolor transparent -tile 1x cmds.png && echo "Done" || echo "Error"
