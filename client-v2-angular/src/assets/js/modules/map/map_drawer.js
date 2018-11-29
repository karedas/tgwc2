export default class Snow {
    constructor () {
        /* --- config start --- */
        this.canvas = null;
        this.canvasID = 'snowCanvas';
        this.context = null;
        this.framerate = 40, // which fps rate to use, this is not followed exactly
        this.flakeNumberModifier = 1.0, // change this to change the number of flakes
        this.fallSpeedModifier = 0.5; // falling speed
        this.width = 0;
        this.height = 0;
        this.numFlakes = null;
        this.flakes = [];
        this.flake = document.createElement("CANVAS");
        this.radHeight = 40;

        /* ---- config end ---- */
    }
    
    make() {

        let _ = this;
            _.canvas = document.getElementById(_.canvasID);
            _.context = _.canvas.getContext("2d");
            _.width = _.canvas.width;
            _.height = _.canvas.height;
            _.numFlakes = Math.min(_.width, 300) * _.height / 400 * _.flakeNumberModifier;
        let TWO_PI = Math.PI * 2,
            flakeContext = _.flake.getContext("2d");

        // create flake grafic
        _.flake.width = 8;
        _.flake.height = 8;
        flakeContext.fillStyle = "#fff";
        flakeContext.beginPath();
        flakeContext.arc(4, 4, 4, 0, TWO_PI);
        flakeContext.fill();

        // init snowflakes
        for (let x = 0; x < _.numFlakes; x++) {
            _.flakes[x] = _.getRandomFlake(true);
        }
    }

    // main routine
    tick() {

        let _ = this;
        let posX = 0;

        // reset canvas for next frame
        _.context.clearRect(0, 0, _.width, _.height);

        for (let x = 0; x < _.numFlakes; x++) {
            // calculate changes to snowflake
            posX = _.flakes[x].x + Math.sin(_.flakes[x].yMod + _.flakes[x].y / _.radHeight * (5 - _.flakes[x].size)) * _.flakes[x].waveSize * (1 - _.flakes[x].size);
            _.flakes[x].y += _.flakes[x].size * _.fallSpeedModifier; // bigger flakes are nearer to screen, thus they fall faster to create 3d effect

            // if snowflake is out of bounds, reset
            if (_.flakes[x].y > _.height + 5) {
                _.flakes[x] = _.getRandomFlake();
            }

            // draw snowflake
            _.context.globalAlpha = (_.flakes[x].size - 1) / 3;
            _.context.drawImage(_.flake, posX, _.flakes[x].y, _.flakes[x].size, _.flakes[x].size);
        }

        // repeat 300px wide strip with snowflakes to fill whole canvas
        if (_.width > 300) {
            _.context.globalAlpha = 1;
            _.context.drawImage(_.canvas, 300, 0);
            if (_.width > 600) _.context.drawImage(_.canvas, 600, 0);
            if (_.width > 1200) _.context.drawImage(_.canvas, 1200, 0);
            if (_.width > 2400) _.context.drawImage(_.canvas, 2400, 0);
        }
    }

    // randomize flake data
    getRandomFlake(init) {
        let _ = this;
        return {
            x: _.range(10, 310),
            y: init ? _.range(-5, _.height + 5) : -5,
            size: Math.max(_.range(1, 4), 2),
            yMod: _.range(0, 150),
            waveSize: _.range(1, 4)
        };
    }

    // get a random number inside a range
    range(start, end) {
        return Math.random() * (end - start) + start;
    }

    start(){
        let _ = this;
        clearInterval(_.canvas.tickHandler);
        this.canvas.tickHandler = setInterval(_.tick.bind(_), Math.floor(1000 / _.framerate));
    }
    stop(){
        let _ = this;
        clearInterval(_.canvas.tickHandler);
    }
}