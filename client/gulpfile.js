// load plugins
const 	gulp = require('gulp'),
		_ = require('lodash'),
		argv = require('minimist')(process.argv),
		cache = require('gulp-cached'),
		// concat = require("gulp-concat"),
		debug = require('gulp-debug'),
		del = require('del'),
		exec = require('child_process').exec,
		// folders = require('gulp-folders'),
		fs = require('fs'),
		// ftp = require('vinyl-ftp'),
		gutil = require('gulp-util'),
		jsbeautify = require('gulp-jsbeautify'),
		path = require('path'),
		plumber = require('gulp-plumber'),
		postcss = require('gulp-postcss'),
		rename = require('gulp-rename'),
		// replace = require('gulp-replace'),
		sass = require('gulp-sass'),
		sassbeautify = require('gulp-sassbeautify'),
		sassUnicode = require('gulp-sass-unicode'),
		sourcemaps = require('gulp-sourcemaps'),
		spritesmith = require('gulp-spritesmith'),
		// stream = require('merge-stream'),
		// tasks = require('gulp-task-listing'),
		uglify = require('gulp-uglify'),
		webpack = require('webpack'),
		chalk = require('chalk'),
		webpackStream = require('webpack-stream');



const log = console.log;
// // webpack configuration file
var webpack_config = require("./webpack.config.js");
var postcss_config = require("./postcss.config.js")

// compile javascript with webpack
function jsCompile(watch) {
	
	webpack_config.watch = watch;
	// webpackstream override src and gulp dest
	return gulp.src('src/js/**/*.js', { base: './' })
		.pipe( cache('js') )
		.pipe( plumber() )
		.pipe( webpackStream(webpack_config, webpack) )
		.pipe( gulp.dest('dist/js/') )
		.pipe( debug());

}

// watch sass files for changes then compile and upload
gulp.task('sass-watch', () => {
	return gulp.watch('./src/scss/**/*.scss', { interval: 500, usePolling: true}, gulp.series(['sass-compile']))
		.on('change', (event) => {
			console.log(event.path + ' ' + event.type);
		});
});

// compile sass files
gulp.task('sass-compile', () => {

	return gulp.src('src/scss/**/*.scss')
		// .pipe( sourcemaps.init() : gutil.noop() )
		.pipe( sass({ errLogToConsole: true }).on('error', sass.logError) )
		.pipe( sassUnicode() )
		.pipe( postcss(postcss_config) )
		// .pipe( config.options.scss_sourcemaps ? sourcemaps.write('../maps') : gutil.noop() )
		.pipe( gulp.dest('dist/css/') )
		.pipe( debug() );
});

gulp.task('js-watch', jsCompile.bind(this, true));
gulp.task('js-compile', jsCompile.bind(this, false));


gulp.task('clean', () => {
	// log('%s Erasing Build Folder', chalk.green('✓'));
	return del('dist/**/*');
});

gulp.task('dev', gulp.series(gulp.parallel('sass-watch', 'js-watch')));
gulp.task('build', gulp.series('clean', 'js-compile', 'sass-compile'));


