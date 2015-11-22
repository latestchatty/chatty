var gulp = require('gulp')
var eslint = require('gulp-eslint')
var config = require('../gulp-config')

gulp.task('lint', function() {
    return gulp.src(config.jsPaths)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})
