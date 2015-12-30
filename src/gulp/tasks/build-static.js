var gulp = require('gulp')
var config = require('../gulp-config')
var merge = require('merge2')

gulp.task('build-static', function() {
    return merge(
        gulp.src(config.staticPaths, { base: config.baseDir })
            .pipe(gulp.dest(config.dist)),

        gulp.src(config.dependencyPaths, {})
            .pipe(gulp.dest(config.dist))
    )
})
