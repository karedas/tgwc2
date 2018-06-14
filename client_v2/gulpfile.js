const gulp = require('gulp'),
	_ = require('lodash'),
	cache = require('gulp-cached'),
	debug = require('gulp-debug'),
	del = require('del'),
	path = require('path'),
	exec = require('child_process').exec,
	concat = require("gulp-concat"),
	fs = require('fs'),
	gutil = require('gulp-util'),
	jsbeautify = require('gulp-jsbeautify'),
	plumber = require('gulp-plumber'),
	postcss = require('gulp-postcss'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sassUnicode = require('gulp-sass-unicode'),
	autoprefixer = require('autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	webpack = require('webpack'),
	chalk = require('chalk'),
	argv = require('yargs').argv,
	stream = require('merge-stream'),
	spritesmith = require('gulp.spritesmith'),
	concatFilenames = require('gulp-concat-filenames'),
	webpackStream = require('webpack-stream');


const log = console.log;

const paths = {
	webclient: {
		src: {
			base: './src/',
			scss: 'scss/',
			js: 'js/',
			img: 'images/'
		},
		build: {
			base: './public/',
			css: 'css/',
			js: 'js/',
			img: 'images/',
		}
	}
}



let portal = 'webclient'; //default

if (argv.portal == 'webclient') {
	portal = argv.portal
};

let P = paths[portal]; // just short var



// Configuration files
const webpack_config = require("./webpack.config.js")(portal, paths[portal], paths.portal);
const postcss_config = require("./postcss.config.js")

// const devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development');



//Generating sprites based on folder located inside resources/img path. 
//Adding the suffix @2x before the image extension (.png) will generate a separate sprite for the retina version.

//get folders list
function getFolders(dir) {
	return fs.readdirSync(dir)
		.filter(function (file) {
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}

function generateSprites(done) {

	let dir = P.src.base + P.src.img + 'sprites/';
	let folders;

	if (fs.existsSync(dir)) {
		folders = getFolders(dir),
			cssStream = [],
			imgStream = [];

		if (folders.length == 0) {
			log(chalk.red('No Sprites folder found! (Maybe is not an error, do u have sprites?)'));
			done();
		} else {
			log(chalk.green('Generating ') + chalk.white.bgYellow(folders.length) + " total sprites...");

			for (let i = 0, len = folders.length; i < len; i++) {
				let sprite_options = {
					imgName: folders[i] + '_sprite.png',
					imgPath: '../images/' + folders[i] + '_sprite.png',
					cssName: "_" + folders[i] + '_sprite.scss',
					// retinaSrcFilter: P.src.base + P.src.img + folders[i] + '/*@2x.png',
					// retinaImgName: folders[i] + '_sprite_2x.png',
					// retinaImgPath: P.static_overrides.base + P.static_overrides.img + folders[i] + '_sprite_2x.png',
					cssOpts: {
						functions: false
					}
				};

				// generate our spritesheets
				let sprite = gulp.src(P.src.base + P.src.img + 'sprites/' + folders[i] + '/**/*.{png,jpg,gif}')
					.pipe(spritesmith(sprite_options));

				// output our images locally
				imgStream[i] = sprite.img.pipe(gulp.dest(P.static_overrides.base + P.static_overrides.img));
				cssStream[i] = sprite.css;

				log("	" + chalk.cyan((i + 1)) + " " + sprite_options.imgName);
			}

			// if(!Object.keys(imgStream).length) {

			let imgSpriteList = stream(imgStream)
			let cssSpriteList = stream(cssStream)
				.pipe(concat('_sprites.scss'))
				.pipe(gulp.dest(P.src.static + '/images/'));

			gutil.log(chalk.green("Sprites generated correctly"));
			return stream(imgStream, cssSpriteList)
			// }
		}
	} else return done();
}

function generateAssetsList() {
	return gulp.src(P.src.base + P.src.img + '**/*.{png,jpg,gif}')
		.pipe(concatFilenames('assets_list', {
			root: './'
		}))
		.pipe(gulp.dest(P.build.base));
}


// compile javascript with webpack
function jsCompile(watch) {

	webpack_config.watch = watch;
	// webpackstream override src and gulp dest
	return gulp.src(P.src.base + P.src.js + '**/*.js', {
			base: './'
		})
		.pipe(cache('js'))
		.pipe(plumber())
		.pipe(webpackStream(webpack_config, webpack))
		.pipe(gulp.dest(P.build.base + P.build.js))
		.pipe(debug());
}

// Watch sass files for changes then compile and upload
gulp.task('sass-watch', () => {
	var watcher = gulp.watch(P.src.base + P.src.scss + '**/*.scss', {
		interval: 500,
		usePolling: true
	}, gulp.series('sass-compile'));
	watcher.on('all', (event, path) => {
		console.log('File ' + path + ' was ' + event + ', running tasks...');
	});
});

// Compile sass files
gulp.task('sass-compile', () => {
	return gulp.src(P.src.base + P.src.scss + '**/*.scss')
		// .pipe( sourcemaps.init())
		.pipe(sass({
			errLogToConsole: true,
			includePaths: ['node_modules/susy/sass']
		}).on('error', sass.logError))
		.pipe(sassUnicode())
		.pipe(postcss(postcss_config))
		// .pipe(paths.src.base + 'css' ? sourcemaps.write('./maps'))
		.pipe(gulp.dest(P.build.base + P.build.css))
		.pipe(debug());
});

gulp.task('copy-images', () =>  {
	return gulp.src(P.src.base + P.src.img + '**/*.{png,jpg,gif}')
		.pipe(gulp.dest(P.build.base + P.build.img));
});

// generate CSS sprite images
gulp.task('generate-sprites', (done) => {
	//waiting stream end
	return generateSprites(done);
});

gulp.task('generate-assetsList', (done) => {
	//waiting stream end
	return generateAssetsList();
});

//watching js watch and compile on live stream
gulp.task('js-watch', jsCompile.bind(this, true));
gulp.task('js-compile', jsCompile.bind(this, false));

// Cleaning build folder
gulp.task('clean', () => {
	return del(P.build.base + '**/*', {
		force: true
	});
});

//Task for watching development
gulp.task('dev', gulp.series('generate-sprites', 'generate-assetsList', 'copy-images', gulp.parallel('sass-watch', 'js-watch')));

//Compiling file withouth Watch setting
gulp.task('build', gulp.series('clean', 'generate-sprites', 'generate-assetsList', 'copy-images', 'js-compile', 'sass-compile'));


gulp.task('test', function () {
	return gulp.src(P.src.base + P.src.img + '**/*.{png,jpg,gif}')
		.pipe(concatFilenames('assets_list', {
			root: './'
		}))
		.pipe(gulp.dest(P.build.base));
});