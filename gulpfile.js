/**
 * Tasks:
 *
 * gulp build
 *   Generates the browser app in production mode (unless NODE_ENV is set
 *   to 'development').
 *
 * gulp live
 *   Generates the browser app in development mode (unless NODE_ENV is set
 *   to 'production'), opens it and watches for changes in the source code.
 *
 * gulp
 *   Alias for `gulp live`.
 */

const path = require('path');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const touch = require('gulp-touch-cmd');
const browserify = require('browserify');
const watchify = require('watchify');
const envify = require('envify/custom');
const uglify = require('gulp-uglify-es').default;
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const del = require('del');
const eslint = require('gulp-eslint');
const stylus = require('gulp-stylus');
const nib = require('nib');
const browserSync = require('browser-sync');

const PKG = require('./package.json');

function getOutputDir()
{
	if (process.env.NODE_ENV === 'production')
		return './docs';
	else
		return './live';
}

function logError(error)
{
	gutil.log(gutil.colors.red(error.stack));
}

function bundle(options)
{
	options = options || {};

	const watch = Boolean(options.watch);

	let bundler = browserify(
		{
			entries      : PKG.main,
			extensions   : [ '.js', '.jsx' ],
			// required for sourcemaps (must be false otherwise).
			debug        : process.env.NODE_ENV === 'development',
			// required for watchify.
			cache        : {},
			// required for watchify.
			packageCache : {},
			// required to be true only for watchify.
			fullPaths    : watch
		})
		.transform('babelify')
		.transform(envify(
			{
				NODE_ENV : process.env.NODE_ENV,
				_        : 'purge'
			}));

	if (watch)
	{
		bundler = watchify(bundler);

		bundler.on('update', () =>
		{
			const start = Date.now();

			gutil.log('bundling...');
			rebundle();
			gutil.log('bundle took %sms', (Date.now() - start));
		});
	}

	function rebundle()
	{
		return bundler.bundle()
			.on('error', logError)
			.pipe(plumber())
			.pipe(source(`${PKG.name}.js`))
			.pipe(buffer())
			.pipe(rename(`${PKG.name}.js`))
			.pipe(gulpif(process.env.NODE_ENV === 'production',
				uglify()
			))
			.pipe(gulp.dest(getOutputDir()));
	}

	return rebundle();
}

gulp.task('env:production', (done) =>
{
	process.env.NODE_ENV = 'production';

	done();
});

gulp.task('env:development', (done) =>
{
	process.env.NODE_ENV = 'development';

	done();
});

gulp.task('clean', () => del(getOutputDir(), { force: true }));

gulp.task('lint', () =>
{
	const src =
	[
		'gulpfile.js',
		'lib/**/*.js',
		'lib/**/*.jsx'
	];

	return gulp.src(src)
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('css', () =>
{
	return gulp.src('stylus/index.styl')
		.pipe(plumber())
		.pipe(stylus(
			{
				use      : nib(),
				compress : process.env.NODE_ENV === 'production'
			}))
		.on('error', logError)
		.pipe(rename(`${PKG.name}.css`))
		.pipe(gulp.dest(getOutputDir()))
		.pipe(touch());
});

gulp.task('html', () =>
{
	return gulp.src('index.html')
		.pipe(gulp.dest(getOutputDir()));
});

gulp.task('bundle', () =>
{
	return bundle({ watch: false });
});

gulp.task('bundle:watch', () =>
{
	return bundle({ watch: true });
});

gulp.task('livebrowser', (done) =>
{
	browserSync(
		{
			server :
			{
				baseDir : getOutputDir()
			},
			ghostMode : false,
			files     : path.join(getOutputDir(), '**', '*')
		});

	done();
});

gulp.task('watch', (done) =>
{
	// Watch changes in HTML.
	gulp.watch([ 'index.html' ], gulp.series(
		'html'
	));

	// Watch changes in Stylus files.
	gulp.watch([ 'stylus/**/*.styl' ], gulp.series(
		'css'
	));

	// Watch changes in JS files.
	gulp.watch([ 'gulpfile.js', 'lib/**/*.js', 'lib/**/*.jsx' ], gulp.series(
		'lint'
	));

	done();
});

gulp.task('build', gulp.series(
	'env:production',
	'clean',
	'lint',
	'bundle',
	'html',
	'css'
));

gulp.task('live', gulp.series(
	'env:development',
	'clean',
	'lint',
	'bundle:watch',
	'html',
	'css',
	'watch',
	'livebrowser'
));

gulp.task('default', gulp.series('live'));
