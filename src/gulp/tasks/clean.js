var gulp = require('gulp')
var del = require('del')
var config = require('../gulp-config')

gulp.task('clean', function() {
    return del([config.dist])
})
