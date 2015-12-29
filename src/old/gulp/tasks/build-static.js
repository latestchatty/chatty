var gulp = require('gulp')
var config = require('../gulp-config')

gulp.task('build-static', function() {
    gulp.src(config.staticPaths, { base: config.baseDir })
        .pipe(gulp.dest(config.dist))
})
