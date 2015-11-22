var _ = require('lodash')
var gulp = require('gulp')
var config = require('../gulp-config')

gulp.task('server', function() {
    var browserSync = require('browser-sync').create()
    module.exports.browserSync = browserSync

    browserSync.init({
        server: {
            baseDir: config.dist
        },
        ui: {
            port: 9001
        },
        port: 3000,
        notify: false
    })

    gulp.watch(['**/*.*', '!**/*.css'], {cwd: config.dist}, browserSync.reload)
})
