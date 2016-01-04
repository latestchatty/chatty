module.exports = {
    baseDir: './src/main',
    dist: './build',

    cssBundleName: 'bundle.css',
    cssPaths: [
        './src/main/**/*.css'
    ],

    //TODO: swap dev -> min
    dependencyPaths: [
        './node_modules/angular2/bundles/angular2.dev.js',
        './node_modules/angular2/bundles/angular2-polyfills.js',
        './node_modules/angular2/bundles/http.dev.js',
        './node_modules/angular2/bundles/router.dev.js',
        './node_modules/rxjs/bundles/Rx.js',
        './node_modules/systemjs/dist/system.js'
    ],

    staticPaths: [
        './src/main/index.html',
        './src/main/favicon.ico',
        './src/main/images/**',
        './src/main/app/**/*.html'
    ]
}
