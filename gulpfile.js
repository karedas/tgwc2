const gulp = require('gulp'),
  debug = require('gulp-debug'),
  path = require('path'),
  fs = require('fs'),
  chalk = require('chalk');



const log = console.log;
log("Starting Gulp, Wait...");

// project configuration file
const config = require('./gulp.config.js')();

// get folders list
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function generateSprites(done) {

  let spritesmith = require('gulp.spritesmith'),
    concat = require("gulp-concat"),
    stream = require('merge-stream');


  let dir = config.src.img + 'sprites/';
  let folders;

  if (fs.existsSync(dir)) {
    folders = getFolders(dir),
      cssStream = [],
      imgStream = [];

    if (folders.length == 0) {
      log(chalk.red('No Sprites folder found! (Maybe is not an error, do u have sprites?)'));
      done();
    } else {
      log(chalk.green('Generating ') + chalk.white.bgRed(folders.length) + " total sprites...");
      for (let i = 0, len = folders.length; i < len; i++) {
        let sprite_options = {
          imgName: folders[i] + '_sprite.png',
          imgPath: '/assets/images/' + folders[i] + '/' + folders[i] + '_sprite.png',
          cssName: "_" + folders[i] + '/abstract/_sprite.scss',
          cssOpts: {
            functions: false
          }
        };

        // generate our spritesheets
        let sprite = gulp.src(dir + folders[i] + '/**/*@sprite.{png,jpg,gif}')
          .pipe(spritesmith(sprite_options));

        // output our images locally
        imgStream[i] = sprite.img.pipe(gulp.dest(config.src.img + '/' + folders[i]));
        cssStream[i] = sprite.css;

        log("	" + chalk.cyan((i + 1)) + " " + sprite_options.imgName);
      }

      let imgSpriteList = stream(imgStream)
      let cssSpriteList = stream(cssStream)
        .pipe(concat('/abstract/_sprites.scss'))
        .pipe(gulp.dest(config.src.scss));

      log(chalk.green("Sprites generated correctly"));
      return stream(imgSpriteList, cssSpriteList)
    }
  } else return done();
}

function generateAssetsList(path) {
  let fileList = require('gulp-filelist');

  switch (path) {
		case 'registration': 
		return gulp.src([
				config.src.img + '**/registration/*.{png,jpg,gif,svg}'
			])
			.pipe(fileList('assets_list_registration.json', {
				relative: true
			}))
			.pipe(gulp.dest(config.src.assets))
			.pipe(debug());
    default: 
      return gulp.src([
          config.src.img + '**/*.{png,jpg,gif,svg}',
          '!' + config.src.img + 'sprites/*/**',
          '!' + config.src.img + 'regions/*/**',
          '!' + config.src.img + 'registration/*/**'
        ])
        .pipe(fileList('assets_list.json', {
          relative: true
        }))
        .pipe(gulp.dest(config.src.assets))
				.pipe(debug());
    }

}


// generate CSS sprite images
gulp.task('generate-sprites', (done) => {
  //waiting stream end
  return generateSprites(done);
});

gulp.task('generate-assetslist', (done) => {
  //waiting stream end
  generateAssetsList('default');
	generateAssetsList('registration');
	done();
});
