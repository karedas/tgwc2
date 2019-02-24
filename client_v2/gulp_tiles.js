const gulp = require('gulp'),
		spritesmith = require('gulp.spritesmith'),
		stream = require('merge-stream'),
		buffer = require('vinyl-buffer'),
		csso = require('gulp-csso');
		chalk = require('chalk');

		
const config = require('./gulp.config.js')();
let log = console.log;



function generateSprites(done) {

	let dir = config.src.base  + '/tiles/';


    log(chalk.green('Generating sprites...'));

            let sprite_options = {
					imgName: 'tiles_set.png',
					imgPath: '../tiles/tiles_set.png',
					//algorithm: "left-right"
            };

            // generate our spritesheets
			 let sprite = gulp.src('./src/tiles/**/*.{png,jpg,gif}')
			 		.pipe(buffer())
					.pipe(spritesmith(sprite_options));

				// output our images locally
				let spriteimg = sprite.img.pipe(gulp.dest('./public/images/tiles/'));
				let spritecss = sprite.css
					.pipe(csso())
					.pipe(gulp.dest('src/scss/'));
 			return stream(spriteimg, spritecss);
			// }
}

// generate CSS sprite images
gulp.task('generate-sprites', (done) => {
	//waiting stream end
	return generateSprites(done);
});