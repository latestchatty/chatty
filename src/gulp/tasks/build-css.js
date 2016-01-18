var _ = require('lodash')
var gulp = require('gulp')
var postcss = require('gulp-postcss')
var concat = require('gulp-concat')
var gutil = require('gulp-util')
var config = require('../gulp-config')

gulp.task('build-css', _.partial(buildCss, false))
gulp.task('build-css-debug', _.partial(buildCss, true))

function buildCss(debug) {
    var browserSync = require('./server.js').browserSync || {stream: gutil.noop}

    var stream = gulp.src(config.cssPaths)
        .pipe(postcss([
            //lint the css using stylelint and suitcss rule set
            require('stylelint')({
                syntax: 'scss'
            }),

            //sass-like syntax
            require('precss')({/*options*/}),

            //remove comments
            require('postcss-discard-comments')(),

            //minify
            require('cssnano')({
                safe: true
            }),

            //reporter
            require('postcss-reporter')({
                clearMessages: true
            })
        ]))

    if (debug) {
        stream.on('error', err => gutil.log(gutil.colors.red('CSS Error:\n'), err.message))
    }

    return stream.pipe(concat(config.cssBundleName))
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream())
}
