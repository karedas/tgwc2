export default class MapDrawer{
    constructor () {
        this.container = '#tgMap';
        this.maxmapwidth = 9;
        this.maxmapheight = 9;
        this.maptilewidth = 32;
        this.maptileheight = 32;
        this.maplight;
        this.mapidprefix = 'mp'
        this.mapctx = null;
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
    
    init () {
        let _ = this;
        _.layermap = new Array(_.maxmapheight);
        for(var y = 0; y < _.maxmapheight; ++y)
        {
            _.layermap[y] = new Array(_.maxmapwidth);
        }
    }

    prepareCanvas() {
        let _ = this;

        $(_.container).append('<canvas id="mapcont" width='+(_.maxmapwidth * _.maptilewidth)+' height='+(_.maxmapheight * _.maptileheight)+'></canvas>');
        
        _.mapctx = $('#mapcont')[0].getContext('2d');

        // Base Tiles
        _.maptileimg = new Image();
        _.maptileimg.src = "<%= image_url_from_assets_file('/icons/tiles.png') %>";
        
        // Fog
        _.mapfogimg = new Image();
        _.mapfogimg.src = "<%= image_url_from_assets_file('interface/map/fog.png') %>";
        
        // Rain
        _.maprainimg = new Image();
        _.maprainimg.src = "<%= image_url_from_assets_file('interface/map/rain.png') %>";

        // Snow
        _.mapsnowimg = new Image();
        _.mapsnowimg.src = "<%= image_url_from_assets_file('interface/map/snow.png') %>";

        // Shadows
        _.mapshadowimg[2] = new Image();
        _.mapshadowimg[2].src = "<%= image_url_from_assets_file('interface/map/shadow1.png') %>";
        
        _.mapshadowimg[1] = new Image();
        _.mapshadowimg[1].src = "<%= image_url_from_assets_file('interface/map/shadow2.png') %>";
    
        _.mapshadowimg[0] = new Image();
        _.mapshadowimg[0].src = "<%= image_url_from_assets_file('interface/map/shadow3.png') %>";
        
        _.mapshadowtile = new Image();
        _.mapshadowtile.src = "<%= image_url_from_assets_file('interface/map/shadowtile.png') %>";
    }
}