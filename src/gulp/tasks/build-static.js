var _ = require('lodash')
var gulp = require('gulp')
var config = require('../gulp-config')
var rename = require('gulp-rename')
var merge = require('merge2')

gulp.task('build-static', _.partial(buildStatic, false))
gulp.task('build-static-debug', _.partial(buildStatic, true))

function buildStatic(debug) {
    return merge(
        gulp.src(config.staticPaths, { base: config.baseDir })
            .pipe(gulp.dest(config.dist)),

        config.dependencyPaths.map(dep => {
            var file = debug ? dep.dev : dep.prod
            return gulp.src(dep.dir + file)
                .pipe(rename(dep.out))
                .pipe(gulp.dest(config.dist))
        })
    )
}
