var gulp = require('gulp')

gulp.task('default', ['server', 'watch', 'build-ts', 'build-css-debug', 'build-static-debug'])
