module.exports = {
    baseDir: './src/main',
    dist: './build',
    moduleName: 'chatty',

    jsBundleInput: './src/main/app.js',
    jsBundleName: 'bundle.js',
    jsPaths: [
        './src/main/**/*.js',
    ],

    cssBundleName: 'bundle.css',
    cssPaths: [
        './src/main/**/*.css'
    ],

    views: [
        './src/main/**/*.html',
        '!./src/main/index.html'
    ],

    staticPaths: [
        './src/main/index.html',
        './src/main/favicon.ico',
        './src/main/images/**'
    ]
}
