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
        this.maprainimg = null;
        this.mapsnowimg = null;
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
        // _.maprainimg = new Image();
        // _.maprainimg.src = "<%= image_url_from_assets_file('interface/map/rain.png') %>";

        // // Snow
        // _.mapsnowimg = new Image();
        // _.mapsnowimg.src = "<%= image_url_from_assets_file('interface/map/snow.png') %>";

        // // Shadows
        // _.mapshadowimg[2] = new Image();
        // _.mapshadowimg[2].src = "<%= image_url_from_assets_file('interface/map/shadow1.png') %>";

        // _.mapshadowimg[1] = new Image();
        // _.mapshadowimg[1].src = "<%= image_url_from_assets_file('interface/map/shadow2.png') %>";

        // _.mapshadowimg[0] = new Image();
        // _.mapshadowimg[0].src = "<%= image_url_from_assets_file('interface/map/shadow3.png') %>";

        // _.mapshadowtile = new Image();
        // _.mapshadowtile.src = "<%= image_url_from_assets_file('interface/map/shadowtile.png') %>";
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
                        // _.MAPCTX.save();
                        // _.MAPCTX.beginPath();
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
                            //_.MAPCTX.drawImage(_.mapshadowtile, clipx, clipy, swidth, sheight, x * _.maptilewidth - 8 + clipx, y * _.maptileheight - 8 + clipy, swidth, sheight);
                        }
                    }
                }
            }
        }

        // if(mapshadowimg[map.l]) {
        //     _.MAPCTX.drawImage(mapshadowimg[map.l], 96 - 32*map.l, 96 - 32*map.l);
        // }
	
        // if(map.f) {
        //     _.MAPCTX.drawImage(mapfogimg, 0, 0);
        // }

        // if(map.r) {
        //     _.MAPCTX.drawImage(maprainimg, 0, 0);
        // }

        // if(map.s) {
        //     _.MAPCTX.drawImage(mapsnowimg, 0, 0);
        // }
    }

    tileCoords(tilenum) {
        var posx = 32 * (tilenum & 0x7f);
        var posy = 32 * (tilenum >> 7);
        return [posx, posy];
    }
}