const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let gitRevisionPlugin = new GitRevisionPlugin({
    lightweightTags: true
});

let webpack;
module.exports = function (prop, wp_instance) {

    // if the local_config is not present then we're likely running webpack directly from the command line
    // load the dev environment by default
    let config = null;
    if (typeof prop == 'undefined') {
        // combine it with the project configuration file
        webpack = require('webpack');
        config = require('./gulp.config.js')();

    } else {
        config = prop;
        webpack = wp_instance;
    }

    let wp = {

        mode: 'development',
        // --watch true, --watch false
        watchOptions: {
            poll: 1000,
            aggregateTimeout: 500,
        },
        // set basedir for entry point
        context: path.resolve(__dirname, config.src.base),

        externals: {
            jquery: "jQuery",
            $: "jQuery",
        },

        entry: {
            'app': './js/app.js'
        },

        output: {
            path: path.resolve(__dirname, config.build.base + config.build.js),
            filename: '[name].min.js', //TODO only on build
            libraryTarget: 'umd',
            library: ['Tg', '[name]'],
            umdNamedDefine: true
        },

        resolve: {
            modules: [
                'node_modules',
                './'
            ],
            alias: {
                modernizr$: path.resolve(__dirname, "./.modernizrrc.js")
            }
        },

        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    loader: "webpack-modernizr-loader",
                    test: /\.modernizrrc\.js$/
                }
            ]
        },

        optimization: {
            minimize: false,
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: path.resolve(__dirname, "node_modules"),
                        chunks: "initial",
                        name: "vendor",
                        minChunks: 1,
                        priority: 10,
                        enforce: true
                    }
                }
            }
        },

        // stats: {
        //     modules: true,
        //     entrypoints: true,
        //     chunks: true
        // },

        performance: {
            hints: process.env.NODE_ENV === 'production' ? "warning" : false
        },

        plugins: [
            new ProgressBarPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new HtmlWebPackPlugin({
                title: 'My Awesome application',
                git_version: JSON.stringify('tgwc.' + gitRevisionPlugin.version()),
                inject: "head",
                minify: false,
                hash: true,
                template: './index.html',
                filename: '../index.html' //relative to root of the application
            }),
            // new BundleAnalyzerPlugin({
            //     // analyzerMode: env == 'dev' ? 'server' : 'disabled',
            //     analyzerPort: 9998,
            //     analyzerHost: '192.168.10.10'
            // })
        ]
    }

    return wp;
};