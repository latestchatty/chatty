var gulp = require('gulp')
var config = require('../gulp-config')
var awspublish = require('gulp-awspublish')

gulp.task('publish', function() {
    var awsconfig = require('../../../aws-credentials')
    var publisher = awspublish.create(awsconfig)

    return gulp.src(config.publishPaths)
        .pipe(publisher.publish({}))
        .pipe(publisher.cache())
        .pipe(publisher.sync())
        .pipe(awspublish.reporter())
})
