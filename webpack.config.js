const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')

const precss = require('precss')
const stylelint = require('stylelint')

const TARGET = process.env.npm_lifecycle_event
const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
    images: path.join(__dirname, 'src/images')
}

const common = {
    entry: {
        'vendor': PATHS.app + '/vendor.ts',
        'main': PATHS.app + '/main.ts'
    },
    resolve: {
        extensions: ['', '.ts', '.js', '.scss', '.html']
    },
    output: {
        path: PATHS.build,
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    },
    postcss: function() {
        return [stylelint, precss]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new CopyWebpackPlugin([
            {from: PATHS.images, to: 'images'},
            {from: PATHS.app + '/favicon.ico'}
        ]),
        new HtmlWebpackPlugin({
            template: PATHS.app + '/index.html',
            inject: true
        })
    ],
    // we need this due to problems with es6-shim
    node: {
        global: 'window',
        progress: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
}

if (TARGET === 'start' || !TARGET) {
    process.env.ENV = process.env.NODE_ENV = 'development'
    module.exports = merge(common, {
        devtool: 'inline-source-map',
        debug: true,
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-url&sourceMap!postcss-loader?sourceMap')
                }
            ]
        },
        devServer: {
            port: 3000,
            host: 'localhost',
            historyApiFallback: true,
            watchOptions: {aggregateTimeout: 300, poll: 1000}
        },
        plugins: [
            new ExtractTextPlugin('[name].css')
        ]
    })
}

if (TARGET === 'build' || TARGET === 'stats') {
    process.env.ENV = process.env.NODE_ENV = 'production'
    module.exports = merge(common, {
        debug: false,
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[id].[chunkhash].chunk.js'
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-url!postcss-loader')
                }
            ]
        },
        plugins: [
            new CleanPlugin([PATHS.build]),
            new webpack.optimize.DedupePlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    ENV: JSON.stringify('production'),
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new ExtractTextPlugin('[name].[chunkhash].css'),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    })
}
