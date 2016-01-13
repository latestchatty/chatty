var gulp = require('gulp')
var config = require('../gulp-config')

gulp.task('watch', function() {
    gulp.watch(config.tsPaths, ['build-ts'])
    gulp.watch(config.staticPaths, ['build-static-debug'])
    gulp.watch(config.cssPaths, ['build-css-debug'])
})
