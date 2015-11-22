var _ = require('lodash')
var gulp = require('gulp')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var ngAnnotate = require('gulp-ng-annotate')
var gutil = require('gulp-util')
var templateCache = require('gulp-angular-templatecache')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var buffer = require('vinyl-buffer')
var merge2 = require('merge2')
var watchify = require('watchify')
var sourcemaps = require('gulp-sourcemaps')
var config = require('../gulp-config')

gulp.task('build-js-debug', _.partial(bundleJs, true))
gulp.task('build-js', _.partial(bundleJs, false))

function bundleJs(debug) {
    var builder = browserify({
        entries: config.jsBundleInput,
        cache: {},
        packageCache: {},
        debug: true
    }).transform('babelify', {presets: ['es2015']})

    if (debug) {
        builder.plugin(watchify)
            .on('update', bundle)

        gulp.watch(config.views, bundle)
    }

    function bundle() {
        gutil.log(gutil.colors.yellow('Bundling js...'))
        var bundler = builder.bundle()

        if (debug) {
            bundler.on('error', function(err) {
                gutil.log(gutil.colors.red('Browserify error:'), err)
            })
        }

        var bundleStream = bundler
            .pipe(source(config.jsBundleInput))
            .pipe(ngAnnotate())

        var templateStream = gulp.src(config.views)
            .pipe(templateCache({module: config.moduleName}))

        merge2(bundleStream, templateStream)
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(concat(config.jsBundleName))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.dist))
    }

    bundle()
}
