export default class MapDrawer {

    constructor() {

        this.container = '#tgMap';
        this.maxmapwidth = 9;
        this.maxmapheight = 9;
        this.maptilewidth = 32;
        this.maptileheight = 32;
        this.maplight;
        this.mapidprefix = 'mp'
        this.MAPCTX = null;
        this.maptileimg = null;
        this.mapshadowimg = [];
        this.MAPRAIN = null;
        this.MAPSNOW = null;
        this.mapfogimg = null;
        this.cursoronmap = false;
        // this.mapsizedata = {
        //     'map_n':{ dialogClass:null, width: 360, height: 375 },
        //     'map_m':{ dialogClass:'small', width: 287, height: 295 },
        //     'map_s':{ dialogClass:'tiny', width: 216, height: 225 }
        // };

        this.layermap = null;
    }

    init() {
        let _ = this;

        _.layermap = new Array(_.maxmapheight);

        for (let y = 0; y < _.maxmapheight; ++y) {
            _.layermap[y] = new Array(_.maxmapwidth);
        }

    }

    prepareCanvas(imagesPath) {
        let _ = this;


        $(_.container).append('<canvas id="mapcont" width="' + (_.maxmapwidth * _.maptilewidth) + '" height="' + (_.maxmapheight * _.maptileheight) + '"></canvas>');

        _.MAPCTX = $('#mapcont')[0].getContext('2d');

        //Base Tiles
        _.maptileimg = new Image();
        _.maptileimg.src = imagesPath + '/tiles/tiles.png';

        // // Fog
        // _.mapfogimg = new Image();
        // _.mapfogimg.src = "<%= image_url_from_assets_file('interface/map/fog.png') %>";

        // // Rain
        //_.makeRain();
        // Snow
        _.makeSnow();
        // Shadows
        _.mapshadowimg[2] = new Image();
        _.mapshadowimg[2].src = imagesPath + '/interface/shadow1.png';

        _.mapshadowimg[1] = new Image();
        _.mapshadowimg[1].src = imagesPath + '/interface/shadow2.png';

        _.mapshadowimg[0] = new Image();
        _.mapshadowimg[0].src = imagesPath + '/interface/shadow3.png';

        _.mapshadowtile = new Image();
        _.mapshadowtile.src = imagesPath + '/interface/shadowtile.png';
    }

    updateMap(map) {
        this.drawCanvasMap(map);
    }

    drawCanvasMap(map) {
        let _ = this;
        let xoff, yoff, xlim, ylim, light, canvaswidth, canvasheight;
        //clip options
        let radius = 75;
        let offset = 0;

        xoff = (_.maxmapwidth - map.d) / 2;
        yoff = (_.maxmapheight - map.d) / 2;
        xlim = xoff + map.d;
        ylim = yoff + map.d;

        canvaswidth = _.maxmapwidth * _.maptilewidth;
        canvasheight = _.maxmapheight * _.maptileheight;

        /* Clear the canvas*/
        _.MAPCTX.clearRect(0, 0, canvaswidth, canvasheight);

        /* Cycle on the 2 layers */
        for (let l = 0; l < 2; l++) {
            let pos = 0;
            for (let y = 0; y < _.maxmapwidth; y++) {
                for (let x = 0; x < _.maxmapheight; x++) {
                    if (x >= xoff && x < xlim && y >= yoff && y < ylim)
                        _.layermap[y][x] = map.data[l][pos++];
                    else {
                        _.layermap[y][x] = 59;
                    }
                }
            }

            for (let y = 0; y < _.maxmapwidth; y++) {
                for (let x = 0; x < _.maxmapheight; x++) {
                    let d = _.layermap[y][x];
                    if (d != 59) {
                        let tpos = _.tileCoords(d);
                        //Draw image before Clip
                        //_.MAPCTX.save();
                        //_.MAPCTX.beginPath();
                        // _.MAPCTX.arc(canvaswidth / 2, canvasheight / 2, canvaswidth, 0, 2 * Math.PI, false);
                        // _.MAPCTX.clip();
                        _.MAPCTX.drawImage(_.maptileimg, tpos[0], tpos[1], _.maptilewidth, _.maptilewidth, x * _.maptilewidth, y * _.maptileheight, _.maptilewidth, _.maptileheight);

                    }
                }
            }

            if (l == 0) {
                for (let y = 0; y < _.maxmapwidth; y++) {
                    for (let x = 0; x < _.maxmapheight; x++) {
                        if (_.layermap[y][x] == 59) {
                            let clipx = 0,
                                clipy = 0,
                                swidth = 48,
                                sheight = 48;

                            if (y == 0 || _.layermap[y - 1][x] == 59) {
                                clipy = 8;
                                sheight -= 8;
                            }

                            if (y == (_.maxmapheight - 1) || _.layermap[y + 1][x] == 59) {
                                sheight -= 8;
                            }

                            if (x == 0 || _.layermap[y][x - 1] == 59) {
                                clipx = 8;
                                swidth -= 8;
                            }

                            if (x == (_.maxmapwidth - 1) || _.layermap[y][x + 1] == 59) {
                                swidth -= 8;
                            }
                            _.MAPCTX.drawImage(_.mapshadowtile, clipx, clipy, swidth, sheight, x * _.maptilewidth - 8 + clipx, y * _.maptileheight - 8 + clipy, swidth, sheight);
                        }
                    }
                }
            }
        }

        if (_.mapshadowimg[map.l]) {
            _.MAPCTX.drawImage(_.mapshadowimg[map.l], 96 - 32 * map.l, 96 - 32 * map.l);
        }

        // if(map.f) {
        //     _.MAPCTX.drawImage(mapfogimg, 0, 0);
        // }

        if (map.r) {
            $('#rainCanvas').show();
        } else {
            $('#rainCanvas').hide();
        }

        if (map.s) {
            $('#snowCanvas').show();
        } else {
            $('#snowCanvas').hide();
        }
    }

    tileCoords(tilenum) {
        let posx = 32 * (tilenum & 0x7f);
        let posy = 32 * (tilenum >> 7);
        return [posx, posy];
    }


    makeSnow() {

        /* --- config start --- */

        let snowCanvasId = "snowCanvas", // id of the canvas to use
            framerate = 40, // which fps rate to use, this is not followed exactly
            flakeNumberModifier = 1.0, // change this to change the number of flakes
            fallSpeedModifier = 0.5; // falling speed

        /* ---- config end ---- */

        let canvas = document.getElementById(snowCanvasId),
            context = canvas.getContext("2d"),
            width = canvas.width,
            height = canvas.height,
            numFlakes = Math.min(width, 300) * height / 400 * flakeNumberModifier,
            flakes = [],
            TWO_PI = Math.PI * 2,
            radHeight = 40;
        let flake = document.createElement("CANVAS"),
            flakeContext = flake.getContext("2d");

        // create flake grafic
        flake.width = 8;
        flake.height = 8;
        flakeContext.fillStyle = "#fff";
        flakeContext.beginPath();
        flakeContext.arc(4, 4, 4, 0, TWO_PI);
        flakeContext.fill();

        // init snowflakes
        for (let x = 0; x < numFlakes; x++) {
            flakes[x] = getRandomFlake(true);
        }

        // start tick at specified fps
        window.setInterval(tick, Math.floor(1000 / framerate));

        // main routine
        function tick() {
            let posX = 0,
                imageData;

            // reset canvas for next frame
            context.clearRect(0, 0, width, height);

            for (let x = 0; x < numFlakes; x++) {
                // calculate changes to snowflake
                posX = flakes[x].x + Math.sin(flakes[x].yMod + flakes[x].y / radHeight * (5 - flakes[x].size)) * flakes[x].waveSize * (1 - flakes[x].size);
                flakes[x].y += flakes[x].size * fallSpeedModifier; // bigger flakes are nearer to screen, thus they fall faster to create 3d effect

                // if snowflake is out of bounds, reset
                if (flakes[x].y > height + 5) {
                    flakes[x] = getRandomFlake();
                }

                // draw snowflake
                context.globalAlpha = (flakes[x].size - 1) / 3;
                context.drawImage(flake, posX, flakes[x].y, flakes[x].size, flakes[x].size);
            }

            // repeat 300px wide strip with snowflakes to fill whole canvas
            if (width > 300) {
                context.globalAlpha = 1;
                context.drawImage(canvas, 300, 0);
                if (width > 600) context.drawImage(canvas, 600, 0);
                if (width > 1200) context.drawImage(canvas, 1200, 0);
                if (width > 2400) context.drawImage(canvas, 2400, 0);
            }
        }

        // randomize flake data
        function getRandomFlake(init) {
            return {
                x: range(10, 310),
                y: init ? range(-5, height + 5) : -5,
                size: Math.max(range(1, 4), 2),
                yMod: range(0, 150),
                waveSize: range(1, 4)
            };
        }

        // get a random number inside a range
        function range(start, end) {
            return Math.random() * (end - start) + start;
        }
    }

    makeRain() {
        let _ = this;
        _.MAPRAIN = $('#rainCanvas')[0];
        let w = $('#rainCanvas').innerWidth();
        let h = $('#rainCanvas').innerHeight();
        console.log(_.MAPRAIN.getContext);
            _.MAPRAIN =  _.MAPRAIN.getContext('2d');
            _.MAPRAIN.strokeStyle = 'rgba(174,194,224,0.5)';
            _.MAPRAIN.lineWidth = 1;
            _.MAPRAIN.lineCap = 'round';


            let init = [];
            let maxParts = 1000;
            for (let a = 0; a < maxParts; a++) {
                init.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    l: Math.random() * 1,
                    xs: -4 + Math.random() * 4 + 2,
                    ys: Math.random() * 10 + 10
                })
            }

            let particles = [];
            for (let b = 0; b < maxParts; b++) {
                particles[b] = init[b];
            }

            function draw() {
                _.MAPRAIN.clearRect(0, 0, w, h);
                for (let c = 0; c < particles.length; c++) {
                    let p = particles[c];
                    _.MAPRAIN.beginPath();
                    _.MAPRAIN.moveTo(p.x, p.y);
                    _.MAPRAIN.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
                    _.MAPRAIN.stroke();
                }
                move();
            }

            function move() {
                for (let b = 0; b < particles.length; b++) {
                    let p = particles[b];
                    p.x += p.xs;
                    p.y += p.ys;
                    if (p.x > w || p.y > h) {
                        p.x = Math.random() * w;
                        p.y = -20;
                    }
                }
            }
            setInterval(draw, 30);
    }
}