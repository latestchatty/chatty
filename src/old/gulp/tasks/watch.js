var gulp = require('gulp')
var config = require('../gulp-config')

gulp.task('watch', function() {
    gulp.watch(config.staticPaths, ['build-static'])
    gulp.watch(config.cssPaths, ['build-css'])
})
