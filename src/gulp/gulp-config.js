module.exports = {
    baseDir: './src/main',
    dist: './build',

    cssBundleName: 'bundle.css',
    cssPaths: [
        './src/main/**/*.css'
    ],

    dependencyPaths: [
        {dir: './node_modules/angular2/bundles/', out: 'angular2.js',
            dev: 'angular2.dev.js', prod: 'angular2.js'},
        {dir: './node_modules/angular2/bundles/', out: 'angular2-polyfills.js',
            dev: 'angular2-polyfills.js', prod: 'angular2-polyfills.min.js'},
        {dir: './node_modules/angular2/bundles/', out: 'angular2-http.js',
            dev: 'http.dev.js', prod: 'http.js'},
        {dir: './node_modules/angular2/bundles/', out: 'angular2-router.js',
            dev: 'router.dev.js', prod: 'router.js'},
        {dir: './node_modules/rxjs/bundles/', out: 'rx.js',
            dev: 'Rx.js', prod: 'Rx.min.js'},
        {dir: './node_modules/systemjs/dist/', out: 'system.js',
            dev: 'system.src.js', prod: 'system.js'}
    ],

    staticPaths: [
        './src/main/index.html',
        './src/main/favicon.ico',
        './src/main/images/**',
        './src/main/app/**/*.html'
    ]
}
