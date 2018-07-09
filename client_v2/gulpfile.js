const gulp = require('gulp'),
	debug = require('gulp-debug'),
	del = require('del'),
	path = require('path'),
	fs = require('fs'),
	chalk = require('chalk'),
	argv = require('yargs').argv;
	


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

function generateSprites(done, path) {

	let spritesmith = require('gulp.spritesmith'),
		concat = require("gulp-concat"),
		stream = require('merge-stream');


	let dir = config.src.base + config.src.img + 'sprites/';
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
					imgPath: '../images/' + folders[i] + '/' + folders[i] + '_sprite.png',
					cssName: "_" + folders[i] + '_sprite.scss',
					cssOpts: {
						functions: false
					}
				};

				// generate our spritesheets
				let sprite = gulp.src(dir + folders[i] + '/**/*@sprite.{png,jpg,gif}')
					.pipe(spritesmith(sprite_options));

				// output our images locally
				imgStream[i] = sprite.img.pipe(gulp.dest(config.build.base + config.build.img + '/' + folders[i]));
				cssStream[i] = sprite.css;

				log("	" + chalk.cyan((i + 1)) + " " + sprite_options.imgName);
			}

			let imgSpriteList = stream(imgStream)
			let cssSpriteList = stream(cssStream)
				.pipe(concat('_sprites.scss'))
				.pipe(gulp.dest(config.src.base + config.src.scss));

			log(chalk.green("Sprites generated correctly"));
			return stream(imgSpriteList, cssSpriteList)
		}
	} else return done();
}

function generateAssetsList() {
	let fileList = require('gulp-filelist');

	return gulp.src([
		config.build.base + config.build.img + '**/*.{png,jpg,gif}',
		])
		.pipe(fileList('assets_list.json', {
			relative: true
		}))
		.pipe(gulp.dest(config.src.base))
		.pipe(gulp.dest(config.build.base))
		.pipe(debug());

}

// compile javascript with webpack
function jsCompile(mode) {

	let webpack = require('webpack'),
		webpackStream = require('webpack-stream'),
		cache = require('gulp-cached'),
		plumber = require('gulp-plumber');
	
	if (mode == 'development') {
		webpack_config.mode = mode;
		webpack_config.watch = true;
		webpack_config.optimization.minimize = false;
		webpack_config.devtool = "source-map";
	}
	else if (mode == 'production') {
		webpack_config.mode = mode;
		webpack_config.watch = false;
		webpack_config.optimization.minimize = true;
	}

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
	
	let sassUnicode = require('gulp-sass-unicode'),
		postcss = require('gulp-postcss'),
		sass = require('gulp-sass');

	return gulp.src(config.src.base + config.src.scss + '**/*.scss')
		.pipe(sass({
			errLogToConsole: true
		}).on('error', sass.logError))
		.pipe(sassUnicode())
		.pipe(postcss(postcss_config))
		.pipe(gulp.dest(config.build.base + config.build.css))
		.pipe(debug());
});

gulp.task('copy-images', () => {
	let globImg = [
		config.src.base + config.src.img + '**/*.{png,jpg,gif,svg}', 
		'!' + config.src.base + config.src.img + 'sprites/**/*',
		'!' + config.src.base + config.src.img + 'tiles/large/**/*'
	]
	return gulp.src(globImg)
			.pipe(gulp.dest(config.build.base + config.build.img));
});

gulp.task('staticfiles-watch', function () {

	let glob = [
			config.src.base + 'assets_list.json',
			config.src.base + 'ajax/**',
			config.src.base + 'static/**',
			config.src.base + config.src.img + '**/*.{png,jpg,gif,svg}',
			config.src.base + 'fonts/**/*',
			'!' + config.src.base + config.src.img + 'sprites/**/*',
			'!' + config.src.base + config.src.img + 'tiles/large/**/*'
		];

	let watcher = gulp.watch(glob, {
		base: ".",
		interval: 500,
		usePolling: true,
		allowEmpty: true
	});

	watcher.on('all', (event, path) => {
		log('File ' + chalk.yellow(path) + ' was ' + event + ', running tasks...');
		return gulp.src(path, {
				base: './src'
			})
			.pipe(gulp.dest(config.build.base));
	});
});


function copyStaticFiles(done) {
	let staticFileGlob = [
			config.src.base + '**/*.html',
			config.src.base + 'ajax/**',
			config.src.base + 'fonts/**',
			config.src.base + 'sounds/**',
			config.src.base + config.src.img + '**/*.{png,jpg,gif,svg}',
			config.src.base + 'favicon.ico',
			config.src.base + 'fonts/**/*',
			'!' + config.src.base + config.src.img + 'sprites/**/*',
			'!' + config.src.base + config.src.img + 'tiles/large/**/*'

	];
			
	return gulp.src(staticFileGlob, {base: './src', cwd: './'})
		.pipe(gulp.dest(config.build.base))
		.pipe(debug());

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

gulp.task('copy-staticfiles', (done) =>  {
	return copyStaticFiles();
})

//watching js watch and compile on live stream
gulp.task('js-watch', jsCompile.bind(this, 'development'));
gulp.task('js-compile', jsCompile.bind(this, 'production'));

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
	gulp.series( 'generate-sprites', 'copy-staticfiles', 'sass-compile', 'generate-assetslist', gulp.parallel('staticfiles-watch', 'sass-watch', 'js-watch')));

//Compiling file withouth Watch setting
gulp.task('build', gulp.series('clean', 'generate-sprites', 'copy-staticfiles', 'generate-assetslist', 'js-compile', 'sass-compile'));