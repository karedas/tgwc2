const gulp = require('gulp'),
	_ = require('lodash'),
	cache = require('gulp-cached'),
	debug = require('gulp-debug'),
	del = require('del'),
	path = require('path'),
	concat = require("gulp-concat"),
	fs = require('fs'),
	plumber = require('gulp-plumber'),
	postcss = require('gulp-postcss'),
	sass = require('gulp-sass'),
	sassUnicode = require('gulp-sass-unicode'),
	sourcemaps = require('gulp-sourcemaps'),
	webpack = require('webpack'),
	chalk = require('chalk'),
	argv = require('yargs').argv,
	stream = require('merge-stream'),
	spritesmith = require('gulp.spritesmith'),
	fileList = require('gulp-filelist'),
	webpackStream = require('webpack-stream'),
	git = require('git-rev');
 
// git.short(function (str) {
// 	git_version = git_version + '-' + str;
// })




const log = console.log;
log("Starting Gulp, Wait...");

// project configuration file
const config = require('./gulp.config.js')();
const postcss_config = require("./postcss.config.js")
const webpack_config = require("./webpack.config.js")(config);

//get folders list
function getFolders(dir) {
	return fs.readdirSync(dir)
		.filter(function (file) {
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}

function generateSprites(done) {

	let dir = config.src.base + config.src.img + '/sprites/';
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
					imgName: folders[i] + '_tls.png',
					imgPath: '../images/sprites/' + folders[i] + '_tls.png',
					cssName: "_" + folders[i] + '_sprite.scss',
					// retinaSrcFilter: config.src.base + config.src.img + folders[i] + '/*@2x.png',
					// retinaImgName: folders[i] + '_sprite_2x.png',
					// retinaImgPath: config.static_overrides.base + config.static_overrides.img + folders[i] + '_sprite_2x.png',
					cssOpts: {
						functions: false
					}
				};

				// generate our spritesheets
				let sprite = gulp.src(dir + folders[i] + '/**/*.{png,jpg,gif}')
					.pipe(spritesmith(sprite_options));

				// output our images locally
				imgStream[i] = sprite.img.pipe(gulp.dest(config.build.base + config.build.img + '/sprites/'));
				cssStream[i] = sprite.css;

				log("	" + chalk.cyan((i + 1)) + " " + sprite_options.imgName);
			}

			// if(!Object.keys(imgStream).length) {

			let imgSpriteList = stream(imgStream)
			let cssSpriteList = stream(cssStream)
				.pipe(concat('_sprites.scss'))
				.pipe(gulp.dest(config.src.base +  config.src.scss));

			log(chalk.green("Sprites generated correctly"));
			return stream(imgSpriteList, cssSpriteList)
			// }
		}
	} else return done();
}

function generateAssetsList() {
	return gulp.src(config.src.base + config.src.img + '**/*.{png,jpg,gif}')
		.pipe(fileList('assets_list.json', {relative: true}))
		.pipe(gulp.dest(config.src.base))
		.pipe(gulp.dest(config.build.base));
}

// compile javascript with webpack
function jsCompile(watch) {

	webpack_config.watch = watch;
	// webpackstream override src and gulp dest
	return gulp.src(config.src.base + config.src.js + '**/*.js', {
			base: './'
		})
		.pipe(cache('js'))
		.pipe(plumber())
		.pipe(webpackStream(webpack_config, webpack))
		.pipe(gulp.dest(config.build.base + config.build.js))
		.pipe(debug());
}

// Watch sass files for changes then compile and upload
gulp.task('sass-watch', () => {
	let watcher = gulp.watch(config.src.base + config.src.scss + '**/*.scss', {
		interval: 500,
		usePolling: true
	}, gulp.series('sass-compile'));
	watcher.on('all', (event, path) => {
		log('File ' + chalk.yellow(path) + ' was ' + event + ', running tasks...');
	});
});

// Compile sass files
gulp.task('sass-compile', () => {
	return gulp.src(config.src.base + config.src.scss + '**/*.scss')
		// .pipe( sourcemaps.init())
		.pipe(sass({
			errLogToConsole: true
		}).on('error', sass.logError))
		.pipe(sassUnicode())
		.pipe(postcss(postcss_config))
		// .pipe(paths.src.base + 'css' ? sourcemaps.write('./maps'))
		.pipe(gulp.dest(config.build.base + config.build.css))
		.pipe(debug());
});

gulp.task('copy-images', () =>  {
	return gulp.src(config.src.base + config.src.img + '**/*.{png,jpg,gif}')
		.pipe(gulp.dest(config.build.base + config.build.img));
});

gulp.task('staticfiles-watch', function() { 

	let glob = [config.src.base + 'assets_list.json', config.src.base + 'ajax/**'];

	let watcher = gulp.watch( glob, {
		base: ".",
		interval: 500,
		usePolling: true
	});
	watcher.on('all', (event, path) => {
		log('File ' + chalk.yellow(path) + ' was ' + event + ', running tasks...');
		return gulp.src(path, {base: './src'})
				.pipe(gulp.dest(config.build.base));
	});
  });


function copyStaticFiles() {
	console.log(config.src.base + 'ajaxs');
	let staticFileGlob = [config.src.base + '**/*.html', config.src.base + 'ajaxs'];
	return gulp.src(staticFileGlob)
		.pipe(gulp.dest(config.build.base));
}


// generate CSS sprite images
gulp.task('generate-sprites', (done) => {
	//waiting stream end
	return generateSprites(done);
});

gulp.task('generate-assetslist', (done) => {
	//waiting stream end
	return generateAssetsList();
});


//watching js watch and compile on live stream
gulp.task('js-watch', jsCompile.bind(this, true));
gulp.task('js-compile', jsCompile.bind(this, false));

// Cleaning build folder
gulp.task('clean', () => {
	return del(config.build.base + '**/*', {
		force: true
	}).then(() => {
		log('%s Cleaned public folder', chalk.green('✓'));
	});
});

//Task for watching development
gulp.task('dev', 
	gulp.series('generate-assetslist', 'generate-sprites', 'sass-compile', 'copy-images',  gulp.parallel('staticfiles-watch', 'sass-watch', 'js-watch')));

//Compiling file withouth Watch setting
gulp.task('build', gulp.series('clean', 'generate-sprites', 'generate-assetslist' , 'copy-images', 'js-compile', 'sass-compile', copyStaticFiles));

