var gulp = require('gulp')
var ts = require('gulp-typescript')
var config = require('../gulp-config')
var sourcemaps = require('gulp-sourcemaps')

var tsProject = ts.createProject('tsconfig.json')
gulp.task('build-ts', function buildTs() {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist))
})
