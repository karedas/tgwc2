const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

module.exports = function (config) {
    
    var wp = {
        mode: 'development',

        // --watch true, --watch false
        watch: false,
        watchOptions: {
            poll: 1000,
            aggregateTimeout: 500,
        },
        // set basedir for entry point
        context: path.resolve(__dirname, config.src.base + config.src.js),

        externals: {
            jquery: "jQuery",
            $: "jQuery",
        },

        entry: {
            // 'evennia': './evennia.js',
            'app': './app.js'
        },

        output: {
            path: path.resolve(__dirname, config.build.base + config.build.js),
            filename: '[name].min.js', //TODO only on build
            libraryTarget: 'umd',
            library: ['TG', '[name]'],
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
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    loader: "webpack-modernizr-loader",
                    test: /\.modernizrrc\.js$/
                },

            ]
        },


        plugins: [
            new HtmlWebPackPlugin({
                inject: "head",
                minify: false,
                template: "index.html",
                filename: "./src/index.html"
            })
        ],
        
        optimization: {
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

        stats: {
            modules: false,
            entrypoints: false,
            chunks: false
        },

        plugins: [
            new webpack.NoEmitOnErrorsPlugin()
        ]
    }

    return wp;
};